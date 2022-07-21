/**
 * Runs embedded signing on a single document.
 *
 * Document should have at least one signer. Offers capability for multiple signers,
 * pre-filled tabs of type text and checkbox.
 *
 * @author Neel Sortur.
 * @author DocuSign.
 */

const path = require("path"),
  fs = require("fs-extra"),
  docusign = require("docusign-esign"),
  dsConfig = require("../config/index.js").config;
const eg001EmbeddedSigning = exports,
  eg = "eg001", // This example reference.
  minimumBufferMin = 3,
  signerClientId = 1000, // The id of the signer within this application.
  demoDocsPath = path.resolve(__dirname),
  dsReturnUrl = dsConfig.appUrl + "/signingDone/",
  dsPingUrl = dsConfig.appUrl + "/"; // Url that will be pinged by the DocuSign signing via Ajax
/**
 * Create the envelope, the embedded signing, and then redirect to the DocuSign signing
 * @param {object} req Request obj
 * @param {object} res Response obj
 * @param {Array} docPaths Relative paths of documents
 * @param {String} displayName Display name of envelope
 * @param {object} prefillVals All information field values to prefill
 * @param {object} dsTabs All DocuSign tags to display on the documents, positioned correctly
 * @param {object} recipients All signer, carbon copy, etc. information
 * @throws {Error} if signing cannot happen with given arguments
 */
eg001EmbeddedSigning.createController = async (
  req,
  res,
  docPaths,
  displayName,
  prefillVals,
  dsTabs,
  recipients
) => {
  // Check the token
  let tokenOK = req.dsAuth.checkToken(minimumBufferMin);
  if (!tokenOK) {
    // Save the current operation so it will be resumed after authentication
    req.dsAuth.setEg(req, eg);
    res.json({ errorOccurred: true });
  } else {
    // Call the worker method
    let body = req.body,
      args = {
        accessToken: req.user.accessToken,
        basePath: req.session.passport.user.basePath,
        accountId: req.session.passport.user.accountId,
        docInfo: {
          envelopeArgs: prefillVals,
          docPaths: docPaths,
          docName: displayName,
          docTabs: dsTabs,
          docRecipients: recipients,
        },
        signerClientId: signerClientId,
        dsReturnUrl: dsReturnUrl,
        dsPingUrl: dsPingUrl,
      },
      results = null;

    results = await eg001EmbeddedSigning.worker(args);

    if (results) {
      // Redirect the user to the embedded signing
      res.json({ signingUrl: results.redirectUrl, errorOccurred: false });
    }
  }
};

/**
 * This function does the work of creating the envelope and the
 * embedded signing
 * @param {object} args
 */
eg001EmbeddedSigning.worker = async (args) => {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;

  // Make the envelope request body
  let envelope = makeEnvelope(args.docInfo, args.signerClientId);
  if (!envelope) {
    throw new Error("Could not find document");
  }

  // call Envelopes::create API method
  // Exceptions will be caught by the calling function
  results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope,
  });

  let envelopeId = results.envelopeId;
  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);

  // create the recipient view, the embedded signing
  let viewRequest = makeRecipientViewRequest(args);
  // Call the CreateRecipientView API
  results = await envelopesApi.createRecipientView(args.accountId, envelopeId, {
    recipientViewRequest: viewRequest,
  });

  return { envelopeId: envelopeId, redirectUrl: results.url };
};

/**
 * Creates envelope with parent and social worker signers
 * @function
 * @param {Object} docInfo parameters for the envelope:
 * @param {Number} signerClientId the signer id within this application
 * @returns {Envelope} An envelope definition
 * @private
 */
function makeEnvelope(docInfo, signerClientId) {
  let doc1PdfBytes;
  let doc2PdfBytes;
  // read file from a local directory
  try {
    doc1PdfBytes = fs.readFileSync(
      path.resolve(demoDocsPath, docInfo.docPaths[0])
    );
    doc2PdfBytes = fs.readFileSync(
      path.resolve(demoDocsPath, docInfo.docPaths[1])
    );
  } catch (error) {
    console.log("bad: ", error);
    return false;
  }

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = docInfo.docName;

  // add the documents
  let doc1 = new docusign.Document(),
    doc1b64 = Buffer.from(doc1PdfBytes).toString("base64");
  doc1.documentBase64 = doc1b64;
  doc1.name = docInfo.docName + ": Family"; // can be different from actual file name
  doc1.fileExtension = "pdf";
  doc1.documentId = "3";

  // add the documents
  let doc2 = new docusign.Document(),
    doc2b64 = Buffer.from(doc2PdfBytes).toString("base64");
  doc2.documentBase64 = doc2b64;
  doc2.name = docInfo.docName + ": Social Worker"; // can be different from actual file name
  doc2.fileExtension = "pdf";
  doc2.documentId = "4";

  // The order in the docs array determines the order in the envelope
  env.documents = [doc1, doc2];

  // Create a signer recipient to sign the document, identified by name and email
  const signers = [];
  // parent is embedded, so specify clientUserId
  signers.push(
    docusign.Signer.constructFromObject({
      email: docInfo.docRecipients.signers[0].email,
      name: docInfo.docRecipients.signers[0].name,
      clientUserId: signerClientId,
      recipientId: 1,
      routingOrder: 1,
    })
  );
  // social worker is remote, so don't specify clientUserId
  signers.push(
    docusign.Editor.constructFromObject({
      email: docInfo.docRecipients.signers[1].email,
      name: docInfo.docRecipients.signers[1].name,
      recipientId: 2,
      routingOrder: 2,
      emailNotification:
        docusign.RecipientEmailNotification.constructFromObject({
          emailSubject: docInfo.docName,
          emailBody:
            "As our trusted partner in this process, please sign your family’s application using DocuSign to verify the authenticity of all information. Thank you. Katie",
        }),
    })
  );

  // let familyVisList = new docusign.DocumentVisibilityList()
  // familyVisList.documentVisibility = [doc1]

  if (signers.length === 0) {
    throw new Error("Must have at least one signer.");
  }
  let parentSigner = signers[0];
  let socWorkSigner = signers[1];

  const tabs = docInfo.docTabs;
  // Tabs are set per recipient / signer
  let parentTabs = docusign.Tabs.constructFromObject({
    signHereTabs: tabs.parentTabs.signHereTabs,
    dateSignedTabs: tabs.parentTabs.dateSignedTabs,
    checkboxTabs: tabs.parentTabs.checkboxTabs,
    textTabs: tabs.parentTabs.textTabs,
    signerAttachmentTabs: tabs.parentTabs.signerAttachmentTabs,
  });
  parentSigner.tabs = parentTabs;

  let socWorkTabs = docusign.Tabs.constructFromObject({
    signHereTabs: tabs.socWorkTabs.signHereTabs,
    dateSignedTabs: tabs.socWorkTabs.dateSignedTabs,
    checkboxTabs: tabs.socWorkTabs.checkboxTabs,
    textTabs: tabs.socWorkTabs.textTabs,
    signerAttachmentTabs: tabs.socWorkTabs.signerAttachmentTabs,
  });
  socWorkSigner.tabs = socWorkTabs;

  // Add the recipient to the envelope object
  let recipients = docusign.Recipients.constructFromObject({
    signers: [parentSigner, socWorkSigner],
  });
  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = "sent";

  return env;
}

function makeRecipientViewRequest(args) {
  // Data for this method
  // args.dsReturnUrl
  // args.signerEmail
  // args.signerName
  // args.signerClientId
  // args.dsPingUrl

  let viewRequest = new docusign.RecipientViewRequest();

  // Set the url where you want the recipient to go once they are done signing
  // should typically be a callback route somewhere in your app.
  // The query parameter is included as an example of how
  // to save/recover state information during the redirect to
  // the DocuSign signing. It's usually better to use
  // the session mechanism of your web framework. Query parameters
  // can be changed/spoofed very easily.
  viewRequest.returnUrl = args.dsReturnUrl; // + "?state=123";

  // How has your app authenticated the user? In addition to your app's
  // authentication, you can include authenticate steps from DocuSign.
  // Eg, SMS authentication
  viewRequest.authenticationMethod = "none";

  // Recipient information must match embedded recipient info
  // we used to create the envelope.

  // first signer (signers[0]) is parent, who uses embedded signing
  viewRequest.email = args.docInfo.docRecipients.signers[0].email;
  viewRequest.userName = args.docInfo.docRecipients.signers[0].name;
  viewRequest.clientUserId = args.signerClientId;

  // DocuSign recommends that you redirect to DocuSign for the
  // embedded signing. There are multiple ways to save state.
  // To maintain your application's session, use the pingUrl
  // parameter. It causes the DocuSign signing web page
  // (not the DocuSign server) to send pings via AJAX to your
  // app,
  // viewRequest.pingFrequency = 600; // seconds
  // // NOTE: The pings will only be sent if the pingUrl is an https address
  // viewRequest.pingUrl = args.dsPingUrl; // optional setting

  return viewRequest;
}
