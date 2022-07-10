/**
 * Contains information about documents present in documentsToSign.js, including
 * text, checkbox, recipients/signers, and date signed DocuSign Tabs
 *
 * @author Neel Sortur.
 */

const { DocumentsApi } = require("docusign-rooms");

const documentInformation = exports,
  docusign = require("docusign-esign"),
  documents = require("./documentsToSign").documents;

/**
 * Creates a prefilled tab to add to a B+ document
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {Number} xWidth width of tab in pixels
 * @param {String} value value for this tab to take
selected
 * @returns a DocuSign tab
 */
function makePrefilledTextTab(anchorString, tabLabel, xOffset, xWidth, value) {
  return docusign.Text.constructFromObject({
    anchorString: anchorString,
    anchorUnits: "inches",
    anchorCaseSensitive: false,
    anchorYOffset: "-0.12",
    anchorXOffset: xOffset,
    font: "helvetica",
    fontSize: "size11",
    bold: "false",
    value: value,
    locked: "false",
    tabId: anchorString,
    tabLabel: tabLabel,
    width: xWidth,
  });
}

/**
 * Creates a tab to add to a B+ document
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {Number} xWidth width of tab in pixels
 * @returns a DocuSign tab
 */
function makeTextTab(anchorString, tabLabel, xOffset, xWidth) {
  return docusign.Text.constructFromObject({
    anchorString: anchorString,
    anchorUnits: "inches",
    anchorCaseSensitive: false,
    anchorYOffset: "-0.12",
    anchorXOffset: xOffset,
    font: "helvetica",
    fontSize: "size11",
    bold: "false",
    locked: "false",
    tabId: anchorString,
    tabLabel: tabLabel,
    width: xWidth,
  });
}

/**
 * Creates a tab to add to a B+ document, with an x and y offset
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {Number} yOffset offset from center of string, inches
 * @param {Number} xWidth width of tab in pixels
 * @returns a DocuSign tab
 */
function makeYTextTab(anchorString, tabLabel, xOffset, yOffset, xWidth) {
  return docusign.Text.constructFromObject({
    anchorString: anchorString,
    anchorUnits: "inches",
    anchorCaseSensitive: false,
    anchorYOffset: yOffset,
    anchorXOffset: xOffset,
    font: "helvetica",
    fontSize: "size11",
    bold: "false",
    locked: "false",
    tabId: anchorString,
    tabLabel: anchorString,
    width: xWidth,
  });
}

/**
 * Makes a pre-filled checkbox on a B+ document
 * @param {String} anchorString place tab to matching this string
 * @param {Number} xOffset x offset from center of string
 * @param {Boolean} checked whether this box should be
 * @returns a DocuSign tab
 */
function makeCheckbox(anchorString, xOffset, checked) {
  return docusign.Checkbox.constructFromObject({
    anchorString: anchorString,
    anchorUnits: "inches",
    anchorXOffset: xOffset,
    anchorYOffset: -0.1,
    anchorCaseSensitive: false,
    locked: false,
    selected: checked,
    tabId: anchorString,
    tabLabel: anchorString,
  });
}

/**
 * Formats object of DocuSign envelope details with multiple documents
 * @param {Array} docs array of document enums to be included in this envelope
 * @param {object} req request
 * @param {object} res result
 */
documentInformation.makeEnvelopeDetails = (docs, req, res) => {
  // extract values from the request
  const body = req.body;

  const prefillVals = {};
  const dsTabs = {
    parentTabs: {
      //   signHereTabs: [],
      //   dateSignedTabs: [],
      //   checkboxTabs: [],
      //   textTabs: []
    },
    socWorkTabs: {
      //   signHereTabs: [],
      //   dateSignedTabs: [],
      //   checkboxTabs: [],
      //   textTabs: []
    },
  };
  const recipients = {
    signers: [],
  };
  let displayName = body.childName + "'s Financial Assistance Agreement";

  docs.forEach((doc) => {
    switch (doc) {
      case documents.FAMILY:
        prefillVals.childName = body.childName;
        prefillVals.childDOB = body.childDOB;
        prefillVals.childGender = body.childGender;
        prefillVals.childEthnicity = body.childEthnicity;
        prefillVals.parentName = body.parentName;
        prefillVals.parentAddress = body.parentAddress;
        prefillVals.parentCity = body.parentCity;
        prefillVals.parentState = body.parentState;
        prefillVals.parentZip = body.parentZip;
        prefillVals.parentPhone = body.parentPhone;
        prefillVals.parentCell = body.parentCell;
        prefillVals.parentEmail = body.parentEmail;
        prefillVals.annualIncome = body.annualIncome;
        prefillVals.requestedGrant = body.requestedGrant;
        prefillVals.intendedUse = body.intendedUse;

        // document recipients, must have at least name and email
        recipients.signers.push({
          name: body.parentName,
          email: body.parentEmail,
        });

        // docusign tabs
        dsTabs.parentTabs.signHereTabs = [
          docusign.SignHere.constructFromObject({
            anchorString: "Parent/Legal Guardian's Hand-Written Signature",
            anchorYOffset: "-0.3",
            anchorUnits: "inches",
          }),
        ];
        dsTabs.parentTabs.dateSignedTabs = [
          docusign.DateSigned.constructFromObject({
            anchorString: "name and medical condition",
            anchorYOffset: "-0.60",
            anchorUnits: "inches",
          }),
        ];

        // checkbox tabs
        // parse child ethnicity for checkboxes based on input
        let isAfricanEth,
          isAsianEth,
          isCaucasianEth,
          isHispanicEth,
          isNativeEth,
          isOtherEth,
          isNoAnswerEth,
          otherEthInfoDial;
        isAfricanEth =
          isAsianEth =
          isCaucasianEth =
          isHispanicEth =
          isNativeEth =
          isOtherEth =
          isNoAnswerEth =
            false;
        switch (body.childEthnicity) {
          case "African-American":
            isAfricanEth = true;
            break;
          case "Asian/Pacific Islander":
            isAsianEth = true;
            break;
          case "Caucasian":
            isCaucasianEth = true;
            break;
          case "Hispanic":
            isHispanicEth = true;
            break;
          case "Native American":
            isNativeEth = true;
            break;
          case "Other":
            isOtherEth = true;
            break;
          case "Prefer not to answer":
            isNoAnswerEth = true;
            break;
          default:
            isOtherEth = true;
            otherEthInfoDial = body.childEthnicity;
        }
        dsTabs.parentTabs.checkboxTabs = [
          makeCheckbox("African-American", 1.3, isAfricanEth),
          makeCheckbox("Asian/Pacific Islander", 1.65, isAsianEth),
          makeCheckbox("Caucasian", 0.75, isCaucasianEth),
          makeCheckbox("Hispanic", 0.75, isHispanicEth),
          makeCheckbox("Native American", 2.5, isNativeEth),
          docusign.Checkbox.constructFromObject({
            anchorString: "Native American",
            anchorUnits: "inches",
            anchorXOffset: 3.5,
            anchorYOffset: -0.1,
            anchorCaseSensitive: false,
            locked: false,
            selected: isOtherEth,
            tabId: "Other",
            tabLabel: "Other",
          }),
          makeCheckbox("Prefer not to answer", 1.5, isNoAnswerEth),
        ];

        // plain text tabs
        let usFormat = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        });
        dsTabs.parentTabs.textTabs = [
          docusign.Text.constructFromObject({
            anchorString: "Information will",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: "-0.4",
            anchorXOffset: 1,
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            value: body.childName,
            locked: "false",
            tabId: "Child's Name",
            tabLabel: "Child's Name",
            width: 230,
          }),
          makePrefilledTextTab(
            "DOB:",
            "Child Date of Birth",
            0.35,
            30,
            body.childDOB
          ),
          makePrefilledTextTab(
            "Gender:",
            "Child Gender",
            0.55,
            45,
            body.childGender
          ),
          makePrefilledTextTab(
            "Parent/Legal Guardian Name:",
            "Parent/Legal Guardian Name",
            2.2,
            340,
            body.parentName
          ),
          docusign.Text.constructFromObject({
            anchorString: "Information will be used",
            anchorUnits: "inches",
            anchorYOffset: "1.05",
            anchorXOffset: "0.7",
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            value: body.parentAddress,
            locked: "false",
            tabId: "Address",
            tabLabel: "Parent Address",
            width: 450,
          }),
          docusign.Text.constructFromObject({
            anchorString: "Information will",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: 1.3,
            anchorXOffset: 0.3,
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            value: body.parentCity,
            locked: "false",
            tabId: "Parent City",
            tabLabel: "Parent City",
            width: 100,
          }),
          // makePrefilledTextTab("State:", 0.35, 80, body.parentState),
          docusign.Text.constructFromObject({
            anchorString: "Information will",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: 1.3,
            anchorXOffset: 2.4,
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            value: body.parentState,
            locked: "false",
            tabId: "Parent State",
            tabLabel: "Parent State",
            width: 80,
          }),
          docusign.Text.constructFromObject({
            anchorString: "Information will",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: 1.3,
            anchorXOffset: 4.3,
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            value: body.parentZip,
            locked: "false",
            tabId: "Parent Zip",
            tabLabel: "Parent Zip",
            width: 150,
          }),
          makePrefilledTextTab(
            "Cell",
            "Parent phone",
            -1.75,
            100,
            body.parentPhone
          ),
          makePrefilledTextTab(
            "Cell",
            "Parent cell",
            0.8,
            150,
            body.parentCell
          ),
          makePrefilledTextTab(
            "E-mail Address:",
            "Parent email",
            1.4,
            400,
            body.parentEmail
          ),
          makePrefilledTextTab(
            "to pay living expenses):",
            "Annual household income",
            2.5,
            150,
            usFormat.format(body.annualIncome)
          ),
          makePrefilledTextTab(
            "Requested grant amount ($ amount required):",
            "Requested grant amount",
            3.5,
            100,
            usFormat.format(body.requestedGrant)
          ),
          docusign.Text.constructFromObject({
            anchorString: "account number",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: "0.1",
            anchorXOffset: 0,
            font: "helvetica",
            fontSize: "size7",
            bold: "false",
            value: body.intendedUse,
            locked: "false",
            tabId: "account number",
            tabLabel: "Intended use of grant",
            width: 600,
            height: 15,
          }),
        ];
        if (isOtherEth) {
          dsTabs.parentTabs.textTabs.push(
            makePrefilledTextTab(
              "Prefer not to answer",
              "Ethnicity",
              1.7,
              150,
              `Other: ${otherEthInfoDial}`
            )
          );
        }
        break;

      case documents.SOCIAL_WORKER:
        // social worker's tab are not prefilled because they are filled via remote signing
        // not done through the web app, just sent through email

        // document recipients, must have at least name and email
        recipients.signers.push({
          name: body.socialWorkerName,
          email: body.socialWorkerEmail,
        });

        // docusign tabs
        dsTabs.socWorkTabs.signHereTabs = [
          docusign.SignHere.constructFromObject({
            anchorString: "Social Worker's Hand-Written Signature",
            anchorXOffset: "3",
            anchorYOffset: "0.1",
            anchorUnits: "inches",
          }),
        ];
        dsTabs.socWorkTabs.dateSignedTabs = [
          docusign.DateSigned.constructFromObject({
            anchorString: "Social Worker's Hand-Written Signature",
            anchorYOffset: "0.45",
            anchorXOffset: "0.45",
            anchorUnits: "inches",
          }),
        ];

        // checkbox tabs
        dsTabs.socWorkTabs.checkboxTabs = [];

        // plain text tabs
        // some are constructed with a different anchor string elsewhere
        // to deal with duplicate fields between documents
        dsTabs.socWorkTabs.textTabs = [
          docusign.Text.constructFromObject({
            anchorString: "Child's Diagnosis:",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: -0.4,
            anchorXOffset: 1.3,
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            locked: "false",
            tabId: "Child's Name",
            tabLabel: "Child's Name",
            width: 400,
          }),
          makeTextTab("Child's Diagnosis:", "Child Diagnosis", 1.5, 350),
          makeTextTab("Date of Diagnosis", "Date of Diagnosis", 3, 250),
          makeTextTab("Child's Physician", "Child Physician", 1.3, 400),
          makeTextTab("Hospital:", "Hospital", 0.7, 400),
          docusign.Text.constructFromObject({
            anchorString: "Date of Diagnosis",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: 0.7,
            anchorXOffset: 0.6, //-1
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            locked: "false",
            tabId: "Hospital Address",
            tabLabel: "Hospital Address",
            width: 400,
          }),
          docusign.Text.constructFromObject({
            anchorString: "Date of Diagnosis",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: 1.0,
            anchorXOffset: 0.3, //-1.3
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            locked: "false",
            tabId: "Hospital City",
            tabLabel: "Hospital City",
            width: 140,
          }),
          docusign.Text.constructFromObject({
            anchorString: "Date of Diagnosis",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: 1.0,
            anchorXOffset: 2.7,
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            locked: "false",
            tabId: "Hospital State",
            tabLabel: "Hospital State",
            width: 65,
          }),
          docusign.Text.constructFromObject({
            anchorString: "Date of Diagnosis",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: 1.0,
            anchorXOffset: 4.3,
            font: "helvetica",
            fontSize: "size11",
            bold: "false",
            locked: "false",
            tabId: "Hospital Zip",
            tabLabel: "Hospital Zip",
            width: 70,
          }),
          makeYTextTab(
            "Social Worker's Direct Phone Number and Extension:",
            "Social Worker Phone",
            4.25,
            -0.05,
            200
          ),
          docusign.Text.constructFromObject({
            anchorString: "Please describe",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: "0.5",
            anchorXOffset: 0,
            font: "helvetica",
            fontSize: "size10",
            bold: "false",
            locked: "false",
            tabId: "Please describe",
            tabLabel: "Medical Condition Description",
            width: 600,
            height: 230,
          }),
          makeTextTab(
            "Clark/Perlmans",
            "The Change Reaction assistance",
            1.0,
            80
          ),
          makeTextTab(
            "Social Worker's Name and Title",
            "Social Worker Name",
            3.4,
            250
          ),
          makeTextTab(
            "Email Address (please print)",
            "Social Worker Email",
            1.8,
            170
          ),
        ];

        // social worker supporting description attachment tab
        dsTabs.socWorkTabs.signerAttachmentTabs = [
          docusign.SignerAttachment.constructFromObject({
            anchorString: "Has this family",
            anchorUnits: "inches",
            anchorCaseSensitive: false,
            anchorYOffset: "-0.8",
            tabId: "Attachment",
            tabLabel: "Medical Condition Description attachment",
            optional: true,
          }),
        ];

        break;
      default:
        throw new Error("Document not found");
    }
  });
  return {
    docPaths: docs,
    displayName: displayName,
    prefillVals: prefillVals,
    dsTabs: dsTabs, // signHereTabs, dateSignedTabs, checkboxTabs, textTabs
    recipients: recipients, // signers
  };
};

/**
 * DEPRECATED: Use makeEnvelopeDetails instead
 * Creates object of doc details in DocuSign form depending on specified document
 * @param {object} doc document to make details from
 * @param {object} req request
 * @param {object} res response
 * @returns object of all docusign tab, recipient, and signer
 */
// documentInformation.makeDocDetails = (doc, req, res) => {
//   // extract values from the request
//   const body = req.body;

//   const prefillVals = {};
//   const dsTabs = {};
//   const recipients = {};
//   let displayName = "Document";
//   switch (doc) {
//     case documents.FAMILY:
//       displayName = "Family Agreement";
//       prefillVals.childName = body.childName;
//       prefillVals.childDOB = body.childDOB;
//       prefillVals.childGender = body.childGender;
//       prefillVals.childEthnicity = body.childEthnicity;
//       prefillVals.parentName = body.parentName;
//       prefillVals.parentAddress = body.parentAddress;
//       prefillVals.parentCity = body.parentCity;
//       prefillVals.parentState = body.parentState;
//       prefillVals.parentZip = body.parentZip;
//       prefillVals.parentPhone = body.parentPhone;
//       prefillVals.parentCell = body.parentCell;
//       prefillVals.parentEmail = body.parentEmail;
//       prefillVals.annualIncome = body.annualIncome;
//       prefillVals.requestedGrant = body.requestedGrant;
//       prefillVals.intendedUse = body.intendedUse;

//       // document recipients, must have at least name and email
//       recipients.signers = [
//         {
//           name: body.parentName,
//           email: body.parentEmail,
//         },
//       ];

//       // docusign tabs
//       dsTabs.signHereTabs = [
//         docusign.SignHere.constructFromObject({
//           anchorString: "Parent/Legal Guardian's Hand-Written Signature",
//           anchorYOffset: "-0.3",
//           anchorUnits: "inches",
//         }),
//       ];
//       dsTabs.dateSignedTabs = [
//         docusign.DateSigned.constructFromObject({
//           anchorString: "Date",
//           anchorYOffset: "-0.35",
//           anchorUnits: "inches",
//         }),
//       ];

//       // checkbox tabs
//       // parse child ethnicity for checkboxes based on input
//       let isAfricanEth,
//         isAsianEth,
//         isCaucasianEth,
//         isHispanicEth,
//         isNativeEth,
//         isOtherEth,
//         isNoAnswerEth,
//         otherEthInfoDial;
//       isAfricanEth =
//         isAsianEth =
//         isCaucasianEth =
//         isHispanicEth =
//         isNativeEth =
//         isOtherEth =
//         isNoAnswerEth =
//           false;
//       switch (body.childEthnicity) {
//         case "African-American":
//           isAfricanEth = true;
//           break;
//         case "Asian/Pacific Islander":
//           isAsianEth = true;
//           break;
//         case "Caucasian":
//           isCaucasianEth = true;
//           break;
//         case "Hispanic":
//           isHispanicEth = true;
//           break;
//         case "Native American":
//           isNativeEth = true;
//           break;
//         case "Other":
//           isOtherEth = true;
//           break;
//         case "Prefer not to answer":
//           isNoAnswerEth = true;
//           break;
//         default:
//           isOtherEth = true;
//           otherEthInfoDial = body.childEthnicity;
//       }
//       dsTabs.checkboxTabs = [
//         makeCheckbox("African-American", 1.3, isAfricanEth),
//         makeCheckbox("Asian/Pacific Islander", 1.65, isAsianEth),
//         makeCheckbox("Caucasian", 0.75, isCaucasianEth),
//         makeCheckbox("Hispanic", 0.75, isHispanicEth),
//         makeCheckbox("Native American", 1.3, isNativeEth),
//         makeCheckbox("Other", 0.5, isOtherEth),
//         makeCheckbox("Prefer not to answer", 1.5, isNoAnswerEth),
//       ];

//       // plain text tabs
//       let usFormat = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//         minimumFractionDigits: 0,
//       });
//       dsTabs.textTabs = [
//         makePrefilledTextTab("Child's Name:", 1, 230, body.childName),
//         makePrefilledTextTab("DOB:", 0.35, 40, body.childDOB),
//         makePrefilledTextTab("Gender:", 0.55, 45, body.childGender),
//         makePrefilledTextTab(
//           "Parent/Legal Guardian Name:",
//           2.2,
//           340,
//           body.parentName
//         ),
//         docusign.Text.constructFromObject({
//           anchorString: "Information will be used",
//           anchorUnits: "inches",
//           anchorYOffset: "1.05",
//           anchorXOffset: "0.7",
//           font: "helvetica",
//           fontSize: "size11",
//           bold: "false",
//           value: body.parentAddress,
//           locked: "false",
//           tabId: "Address",
//           tabLabel: "Address",
//           width: 450,
//         }),
//         makePrefilledTextTab("City:", 0.25, 100, body.parentCity),
//         makePrefilledTextTab("State:", 0.35, 80, body.parentState),
//         makePrefilledTextTab("Zip Code", 0.7, 200, body.parentZip),
//         makePrefilledTextTab("Cell", -1.75, 100, body.parentPhone),
//         makePrefilledTextTab("Cell", 0.8, 150, body.parentCell),
//         makePrefilledTextTab("E-mail Address:", 1.4, 400, body.parentEmail),
//         makePrefilledTextTab(
//           "to pay living expenses):",
//           2.5,
//           150,
//           usFormat.format(body.annualIncome)
//         ),
//         makePrefilledTextTab(
//           "Requested grant amount ($ amount required):",
//           3.5,
//           100,
//           usFormat.format(body.requestedGrant)
//         ),
//         docusign.Text.constructFromObject({
//           anchorString: "account number",
//           anchorUnits: "inches",
//           anchorCaseSensitive: false,
//           anchorYOffset: "0.1",
//           anchorXOffset: 0,
//           font: "helvetica",
//           fontSize: "size7",
//           bold: "false",
//           value: body.intendedUse,
//           locked: "false",
//           tabId: "account number",
//           tabLabel: "account number",
//           width: 600,
//           height: 15,
//         }),
//       ];
//       if (isOtherEth) {
//         dsTabs.textTabs.push(
//           makePrefilledTextTab(
//             "Prefer not to answer",
//             1.7,
//             150,
//             `Other: ${otherEthInfoDial}`
//           )
//         );
//       }
//       break;

//     case documents.SOCIAL_WORKER:
//       // social worker's tab are not prefilled because they are filled via remote signing
//       // not done through the web app, just sent through email

//       displayName = "Medical Information";

//       // document recipients, must have at least name and email
//       recipients.signers = [
//         {
//           name: body.socialWorkerName,
//           email: body.socialWorkerEmail,
//         },
//       ];

//       // docusign tabs
//       dsTabs.signHereTabs = [
//         docusign.SignHere.constructFromObject({
//           anchorString: "Social Worker's Hand-Written Signature",
//           anchorXOffset: "3",
//           anchorUnits: "inches",
//         }),
//       ];
//       dsTabs.dateSignedTabs = [
//         docusign.DateSigned.constructFromObject({
//           anchorString: "By signing this application",
//           anchorYOffset: "-0.4",
//           anchorXOffset: "0.5",
//           anchorUnits: "inches",
//         }),
//       ];

//       // checkbox tabs
//       dsTabs.checkboxTabs = [];

//       // plain text tabs
//       dsTabs.textTabs = [
//         makeTextTab("Child's Name:", 1.3, 400),
//         makeTextTab("Child's Diagnosis:", 1.5, 350),
//         makeTextTab("Date of Diagnosis", 3, 250),
//         makeTextTab("Child's Physician", 1.3, 400),
//         makeTextTab("Hospital:", 0.7, 400),
//         makeTextTab("Address:", 0.7, 400),
//         makeTextTab("City:", 0.4, 140),
//         makeTextTab("State", 0.4, 70),
//         makeTextTab("Zip Code:", 0.7, 200),
//         makeYTextTab(
//           "Social Worker's Direct Phone Number and Extension:",
//           4.25,
//           -0.05,
//           200
//         ),
//         docusign.Text.constructFromObject({
//           anchorString: "Please describe",
//           anchorUnits: "inches",
//           anchorCaseSensitive: false,
//           anchorYOffset: "0.5",
//           anchorXOffset: 0,
//           font: "helvetica",
//           fontSize: "size10",
//           bold: "false",
//           locked: "false",
//           tabId: "Please describe",
//           tabLabel: "Please describe",
//           width: 600,
//           height: 230,
//         }),
//         makeYTextTab("Social Worker's Name and Title", 3.4, -0.2, 250),
//         makeTextTab("Social Worker's Email Address", 2.85, 170),
//       ];

//       break;
//     default:
//       throw new Error("Document not found");
//   }
//   return {
//     docPath: doc,
//     displayName: displayName,
//     prefillVals: prefillVals,
//     dsTabs: dsTabs, // signHereTabs, dateSignedTabs, checkboxTabs, textTabs
//     recipients: recipients, // signers
//   };
//   // remember doc is just a string
// };
