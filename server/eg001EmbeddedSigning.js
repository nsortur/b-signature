const path = require('path')
    , fs = require('fs-extra')
    , docusign = require('docusign-esign')
    , validator = require('validator')
    , dsConfig = require('../config/index.js').config
    ;

const eg001EmbeddedSigning = exports
    , eg = 'eg001' // This example reference.
    , mustAuthenticate = '/ds/mustAuthenticate'
    , minimumBufferMin = 3
    , signerClientId = 1000 // The id of the signer within this application.
    , demoDocsPath = path.resolve(__dirname)
    , pdf1File = 'Family-Assistance-Application-3.2.21.pdf'
    , dsReturnUrl = dsConfig.appUrl + '/signingDone/'
    , dsPingUrl = dsConfig.appUrl + '/' // Url that will be pinged by the DocuSign signing via Ajax
    ;


/**
 * Create the envelope, the embedded signing, and then redirect to the DocuSign signing
 * @param {object} req Request obj
 * @param {object} res Response obj
 */
eg001EmbeddedSigning.createController = async (req, res) => {
    // Step 1. Check the token
    // At this point we should have a good token. But we
    // double-check here to enable a better UX to the user.
    let tokenOK = req.dsAuth.checkToken(minimumBufferMin);
    if (! tokenOK) {
        // req.flash('info', 'Sorry, you need to re-authenticate.');
        // Save the current operation so it will be resumed after authentication
        req.dsAuth.setEg(req, eg);
        // res.redirect(mustAuthenticate);
    }

    // Step 2. Call the worker method
    let body = req.body
      , envelopeArgs = {
            childName: body.childName, 
            childDOB: body.childDOB, 
            childGender: body.childGender,
            childEthnicity: body.childEthnicity,
            parentName: body.parentName,
            parentAddress: body.parentAddress,
            parentCity: body.parentCity,
            parentState: body.parentState,
            parentZip: body.parentZip,
            parentPhone: body.parentPhone,
            parentCell: body.parentCell,
            parentEmail: body.parentEmail,
            annualIncome: body.annualIncome,
            requestedGrant: body.requestedGrant,
            intendedUse: body.intendedUse,
            signerClientId: signerClientId,
            dsReturnUrl: dsReturnUrl,
            dsPingUrl: dsPingUrl
        }
      , args = {
            
            accessToken: req.user.accessToken,
            basePath: req.session.basePath,
            accountId: req.session.accountId,
            envelopeArgs: envelopeArgs
        }
      , results = null
      ;
    try {
        results = await eg001EmbeddedSigning.worker (args)
    }
    catch (error) {
        let errorBody = error && error.response && error.response.body
            // we can pull the DocuSign error code and message from the response body
          , errorCode = errorBody && errorBody.errorCode
          , errorMessage = errorBody && errorBody.message
          ;
        // In production, may want to provide customized error messages and
        // remediation advice to the user.
        console.log('bad', {err: error, errorCode: errorCode, errorMessage: errorMessage});
        // res.render('pages/error', {err: error, errorCode: errorCode, errorMessage: errorMessage});
    }
    if (results) {
        // Redirect the user to the embedded signing
        // Don't use an iFrame!
        // State can be stored/recovered using the framework's session or a
        // query parameter on the returnUrl (see the makeRecipientViewRequest method)
        res.json({signingUrl: results.redirectUrl});
        //res.redirect(results.redirectUrl);
    }
}


/**
 * This function does the work of creating the envelope and the
 * embedded signing
 * @param {object} args
 */
// ***DS.snippet.0.start
eg001EmbeddedSigning.worker = async (args) => {
    // Data for this method
    // args.basePath
    // args.accessToken
    // args.accountId

    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
      , results = null;

    // Step 1. Make the envelope request body
    let envelope = makeEnvelope(args.envelopeArgs)

    // Step 2. call Envelopes::create API method
    // Exceptions will be caught by the calling function
    results = await envelopesApi.createEnvelope(args.accountId, {envelopeDefinition: envelope});

    let envelopeId = results.envelopeId;
    console.log(`Envelope was created. EnvelopeId ${envelopeId}`);

    // Step 3. create the recipient view, the embedded signing
    let viewRequest = makeRecipientViewRequest(args.envelopeArgs);
    // Call the CreateRecipientView API
    // Exceptions will be caught by the calling function
    results = await envelopesApi.createRecipientView(args.accountId, envelopeId,
        {recipientViewRequest: viewRequest});

    return ({envelopeId: envelopeId, redirectUrl: results.url})
}

/**
 * Creates a tab to add to a document
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {String} value value for this tab to take
selected
 * @returns a DocuSign tab
 */
function makeTextTab(anchorString, xOffset, xWidth, value) {
    return (
        docusign.Text.constructFromObject({
            anchorString: anchorString, anchorUnits: 'inches',
            anchorCaseSensitive: false, 
            anchorYOffset: '-0.12', anchorXOffset: xOffset,
            font: 'helvetica', fontSize: 'size11',
            bold: 'true', value: value,
            locked: 'false', tabId: anchorString,
            tabLabel: anchorString, width:xWidth
        })
    )
}

/**
 * Makes a pre-filled checkbox on a document
 * @param {String} anchorString place tab to matching this string
 * @param {Number} xOffset x offset from center of string
 * @param {Boolean} checked whether this box should be 
 * @returns a DocuSign tab
 */
function makeCheckbox(anchorString, xOffset, checked) {
    return (
        docusign.Checkbox.constructFromObject({
            anchorString: anchorString, anchorUnits: 'inches', anchorXOffset: xOffset, anchorYOffset: -0.1,  anchorCaseSensitive: false, locked: false, selected: checked, tabId: anchorString, tabLabel: anchorString
        })
    )
}

/**
 * Creates envelope
 * @function
 * @param {Object} args parameters for the envelope:
 * @returns {Envelope} An envelope definition
 * @private
 */
function makeEnvelope(args){
    // Data for this method
    // args.signerEmail
    // args.signerName
    // args.signerClientId
    // demoDocsPath (module constant)
    // pdf1File (module constant)

    // document 1 (pdf) has tag /sn1/
    //
    // The envelope has one recipients.
    // recipient 1 - signer

    let docPdfBytes;
    // read file from a local directory
    // The read could raise an exception if the file is not available!
    docPdfBytes = fs.readFileSync(path.resolve(demoDocsPath, pdf1File));

    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = 'Family Agreement';

    // add the documents
    let doc1 = new docusign.Document()
      , doc1b64 = Buffer.from(docPdfBytes).toString('base64')
      ;

    doc1.documentBase64 = doc1b64;
    doc1.name = 'Family Agreement'; // can be different from actual file name
    doc1.fileExtension = 'pdf';
    doc1.documentId = '3';

    // The order in the docs array determines the order in the envelope
    env.documents = [doc1];

    // Create a signer recipient to sign the document, identified by name and email
    // We set the clientUserId to enable embedded signing for the recipient
    // We're setting the parameters via the object creation
    let signer1 = docusign.Signer.constructFromObject({
        email: args.parentEmail,
        name: args.parentName,
        clientUserId: args.signerClientId,
        recipientId: 1
    });

    // Parse child ethnicity for checkboxes based on input
    let isAfricanEth, isAsianEth, isCaucasianEth, isHispanicEth, isNativeEth, isOtherEth, isNoAnswerEth, otherEthInfoDial;
    isAfricanEth = isAsianEth = isCaucasianEth = isHispanicEth = isNativeEth = isOtherEth = isNoAnswerEth = false;
    switch (args.childEthnicity) {
        case 'African-American':
            isAfricanEth = true;
            break;
        case 'Asian/Pacific Islander':
            isAsianEth = true;
            break;
        case 'Caucasian':
            isCaucasianEth = true;
            break;
        case 'Hispanic':
            isHispanicEth = true;
            break;
        case 'Native American':
            isNativeEth = true;
            break;
        case 'Other':
            isOtherEth = true;
            break;
        case 'Prefer not to answer':
            isNoAnswerEth = true;
            break;
        default:
            isOtherEth = true;
            otherEthInfoDial = args.childEthnicity;
    }

    // Create signHere fields (also known as tabs) on the documents,
    // We're using anchor (autoPlace) positioning
    let parentSignature = docusign.SignHere.constructFromObject({
          anchorString: 'Parent/Legal Guardian\'s Hand-Written Signature',
          anchorYOffset: '-0.33', anchorUnits: 'inches'})
        , parentDateSigned = docusign.DateSigned.constructFromObject({
            anchorString: 'Date', anchorYOffset: '-0.35', anchorUnits: 'inches'});

    let childName = makeTextTab('Child\'s Name:', 1, 230, args.childName)
        , childDob = makeTextTab('DOB:', 0.35, 40, args.childDOB)
        , childGender = makeTextTab('Gender:', 0.55, 45, args.childGender)
        , africanEth = makeCheckbox('African-American', 1.3,  isAfricanEth)
        , asianEth = makeCheckbox('Asian/Pacific Islander', 1.65, isAsianEth)
        , caucasianEth = makeCheckbox('Caucasian', 0.75, isCaucasianEth)
        , hispanicEth = makeCheckbox('Hispanic', 0.75, isHispanicEth)
        , nativeEth = makeCheckbox('Native American', 1.3, isNativeEth)
        , otherEth = makeCheckbox('Other', 0.5, isOtherEth)
        , noAnswerEth = makeCheckbox('Prefer not to answer', 1.5, isNoAnswerEth)
        , otherInfoEth = makeTextTab('Prefer not to answer', 1.7, 150, `Other: ${otherEthInfoDial}`)
        , parentName = makeTextTab('Parent/Legal Guardian Name:', 2.2, 340, args.parentName)
        , parentAddress = docusign.Text.constructFromObject({
            anchorString: 'Information will be used', anchorUnits: 'inches',
            anchorYOffset: '1.05', anchorXOffset: '0.7',
            font: 'helvetica', fontSize: 'size11',
            bold: 'true', value: args.parentAddress,
            locked: 'false', tabId: 'Address',
            tabLabel: 'Address', width:450
        })
        , parentCity = makeTextTab('City:', 0.25, 100, args.parentCity)
        , parentState = makeTextTab('State:', 0.35, 80, args.parentState)
        , parentZipcode = makeTextTab('Zip Code', 0.7, 200, args.parentZip)
        , parentPhone = makeTextTab('Cell', -1.75, 100, args.parentPhone)
        , parentCell = makeTextTab('Cell', 0.8, 150, args.parentCell)
        , parentEmail = makeTextTab('E-mail Address:', 1.4, 400, args.parentEmail)
        , usFormat = new Intl.NumberFormat('en-US',
          {style: 'currency', currency: 'USD', minimumFractionDigits: 0})
        , annualIncome = makeTextTab('to pay living expenses):', 2.5, 150, usFormat.format(args.annualIncome))
        , requestedGrant = makeTextTab('Requested grant amount ($ amount required):', 3.5, 100, usFormat.format(args.requestedGrant))
        , intendedUse = docusign.Text.constructFromObject({
            anchorString: 'account number', anchorUnits: 'inches',
            anchorCaseSensitive: false, 
            anchorYOffset: '0.1', anchorXOffset: 0,
            font: 'helvetica', fontSize: 'size7',
            bold: 'true', value: args.intendedUse,
            locked: 'false', tabId: 'account number',
            tabLabel: 'account number', width:600, height: 15
        })

    // Tabs are set per recipient / signer
    let textualTabs = [childName, childDob, childGender, parentName, parentAddress, parentCity, parentState, parentZipcode, parentPhone, parentCell, parentEmail, annualIncome, requestedGrant, intendedUse];
    if (isOtherEth) {
        textualTabs.push(otherInfoEth)
    }
    let signer1Tabs = docusign.Tabs.constructFromObject({
        signHereTabs: [parentSignature],
        dateSignedTabs: [parentDateSigned],
        checkboxTabs: [africanEth, asianEth, caucasianEth, hispanicEth, nativeEth, otherEth, noAnswerEth],
        textTabs: textualTabs});
    signer1.tabs = signer1Tabs;

    // Add the recipient to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
      signers: [signer1]});
    env.recipients = recipients;

    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = 'sent';

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
    viewRequest.authenticationMethod = 'none';

    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = args.parentEmail;
    viewRequest.userName = args.parentName;
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

    return viewRequest
}
// ***DS.snippet.0.end

