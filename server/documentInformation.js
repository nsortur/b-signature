const documentInformation = exports
      , docusign = require('docusign-esign')
      , documents = require('./documentsToSign').documents;

/**
 * Creates a tab to add to a B+ document
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {Number} xWidth width of tab in pixels
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
 * Creates a tab to add to a B+ document, with an x and y offset
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {Number} yOffset offset from center of string, inches
 * @param {Number} xWidth width of tab in pixels
 * @param {String} value value for this tab to take
selected
 * @returns a DocuSign tab
 */
function makeYTextTab(anchorString, xOffset, yOffset, xWidth, value) {
  return (
      docusign.Text.constructFromObject({
          anchorString: anchorString, anchorUnits: 'inches',
          anchorCaseSensitive: false, 
          anchorYOffset: yOffset, anchorXOffset: xOffset,
          font: 'helvetica', fontSize: 'size11',
          bold: 'true', value: value,
          locked: 'false', tabId: anchorString,
          tabLabel: anchorString, width:xWidth
      })
  )
}

/**
 * Makes a pre-filled checkbox on a B+ document
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

documentInformation.makeDocDetails = (doc, req, res) => {
  // extract values from the request
  const body = req.body;

  const prefillVals = {};
  const dsTabs = {};
  const recipients = {};
  let displayName = 'Document';
  switch (doc) {
    case documents.FAMILY:
      displayName = 'Family Agreement'
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
      recipients.signers = [
        {
          name: body.parentName,
          email: body.parentEmail
        }
      ];

      // docusign tabs
      dsTabs.signHereTabs = [
        docusign.SignHere.constructFromObject({
          anchorString: 'Parent/Legal Guardian\'s Hand-Written Signature',
          anchorYOffset: '-0.3', anchorUnits: 'inches'
        })
      ];
      dsTabs.dateSignedTabs = [
        docusign.DateSigned.constructFromObject({
          anchorString: 'Date', anchorYOffset: '-0.35', anchorUnits: 'inches'
        })
      ];

      // checkbox tabs
      // parse child ethnicity for checkboxes based on input
      let isAfricanEth, isAsianEth, isCaucasianEth, isHispanicEth, isNativeEth, isOtherEth, isNoAnswerEth, otherEthInfoDial;
      isAfricanEth = isAsianEth = isCaucasianEth = isHispanicEth = isNativeEth = isOtherEth = isNoAnswerEth = false;
      switch (body.childEthnicity) {
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
            otherEthInfoDial = body.childEthnicity;
      }
      dsTabs.checkboxTabs = [
        makeCheckbox('African-American', 1.3,  isAfricanEth),
        makeCheckbox('Asian/Pacific Islander', 1.65, isAsianEth),
        makeCheckbox('Caucasian', 0.75, isCaucasianEth),
        makeCheckbox('Hispanic', 0.75, isHispanicEth),
        makeCheckbox('Native American', 1.3, isNativeEth),
        makeCheckbox('Other', 0.5, isOtherEth),
        makeCheckbox('Prefer not to answer', 1.5, isNoAnswerEth)
      ];

      // plain text tabs
      let usFormat = new Intl.NumberFormat('en-US',
        {style: 'currency', currency: 'USD', minimumFractionDigits: 0})
      dsTabs.textTabs = [
        makeTextTab('Child\'s Name:', 1, 230, body.childName),
        makeTextTab('DOB:', 0.35, 40, body.childDOB),
        makeTextTab('Gender:', 0.55, 45, body.childGender),
        makeTextTab('Parent/Legal Guardian Name:', 2.2, 340, body.parentName),
        docusign.Text.constructFromObject({
            anchorString: 'Information will be used', anchorUnits: 'inches',
            anchorYOffset: '1.05', anchorXOffset: '0.7',
            font: 'helvetica', fontSize: 'size11',
            bold: 'true', value: body.parentAddress,
            locked: 'false', tabId: 'Address',
            tabLabel: 'Address', width:450
        }),
        makeTextTab('City:', 0.25, 100, body.parentCity),
        makeTextTab('State:', 0.35, 80, body.parentState),
        makeTextTab('Zip Code', 0.7, 200, body.parentZip),
        makeTextTab('Cell', -1.75, 100, body.parentPhone),
        makeTextTab('Cell', 0.8, 150, body.parentCell),
        makeTextTab('E-mail Address:', 1.4, 400, body.parentEmail),
        makeTextTab('to pay living expenses):', 2.5, 150, usFormat.format(body.annualIncome)),
        makeTextTab('Requested grant amount ($ amount required):', 3.5, 100, usFormat.format(body.requestedGrant)),
        docusign.Text.constructFromObject({
            anchorString: 'account number', anchorUnits: 'inches',
            anchorCaseSensitive: false, 
            anchorYOffset: '0.1', anchorXOffset: 0,
            font: 'helvetica', fontSize: 'size7',
            bold: 'true', value: body.intendedUse,
            locked: 'false', tabId: 'account number',
            tabLabel: 'account number', width:600, height: 15
        })
      ];
      if (isOtherEth) {
        dsTabs.textTabs.push(
          makeTextTab('Prefer not to answer', 1.7, 150, `Other: ${otherEthInfoDial}`),
        );
      }
      break;

    case documents.SOCIAL_WORKER:
      displayName = 'Medical Information'
      // TODO make these fields in frontend, compartmentalize
      prefillVals.childName = body.childName;
      prefillVals.childDiagnosis = body.childDiagnosis;
      prefillVals.diagnosisDate = body.diagnosisDate;
      prefillVals.childPhysician = body.childPhysician;
      prefillVals.hospital = body.hospital;
      prefillVals.hospitalAddress = body.hospitalAddress;
      prefillVals.hospitalCity = body.hospitalCity;
      prefillVals.hospitalState = body.hospitalState;
      prefillVals.hospitalZip = body.hospitalZip;
      prefillVals.socialWorkerPhone = body.socialWorkerPhone;
      prefillVals.notableFacts = body.notableFacts;
      prefillVals.socialWorkerName = body.socialWorkerName;
      prefillVals.socialWorkerEmail = body.socialWorkerEmail;

      // document recipients, must have at least name and email
      recipients.signers = [
        {
          name: body.socialWorkerName,
          email: body.socialWorkerEmail
        }
      ];

      // docusign tabs
      dsTabs.signHereTabs = [
        docusign.SignHere.constructFromObject({
          anchorString: 'Social Worker\'s Hand-Written Signature',
          anchorXOffset: '3', anchorUnits: 'inches'
        })
      ];
      dsTabs.dateSignedTabs = [
        docusign.DateSigned.constructFromObject({
          anchorString: 'By signing this application', anchorYOffset: '-0.4', 
          anchorXOffset: '0.5', anchorUnits: 'inches'
        })
      ];

      // checkbox tabs
      dsTabs.checkboxTabs = [];

      // plain text tabs
      dsTabs.textTabs = [
        makeTextTab('Child\'s Name:', 1.3, 400, body.childName),
        makeTextTab('Child\'s Diagnosis:', 1.5, 350, body.childDiagnosis),
        makeTextTab('Date of Diagnosis', 3, 250, body.diagnosisDate),
        makeTextTab('Child\'s Physician', 1.3, 400, body.childPhysician),
        makeTextTab('Hospital:', 0.7, 400, body.hospital),
        makeTextTab('Address:', 0.7, 400, body.hospitalAddress),
        makeTextTab('City:', 0.4, 140, body.hospitalCity),
        makeTextTab('State', 0.4, 70, body.hospitalState),
        makeTextTab('Zip Code:', 0.7, 200, body.hospitalZip),
        makeYTextTab('Social Worker\'s Direct Phone Number and Extension:',
          4.25, -0.05, 200, body.socialWorkerPhone),
          docusign.Text.constructFromObject({
            anchorString: 'Please describe', anchorUnits: 'inches',
            anchorCaseSensitive: false, 
            anchorYOffset: '0.5', anchorXOffset: 0,
            font: 'helvetica', fontSize: 'size10',
            bold: 'true', value: body.notableFacts,
            locked: 'false', tabId: 'Please describe',
            tabLabel: 'Please describe', width:600, height: 230
        }),
        makeYTextTab('Social Worker\'s Name and Title', 3.4, -0.2, 250, body.socialWorkerName),
        makeTextTab('Social Worker\'s Email Address', 2.85, 170, body.socialWorkerEmail)  
        // makeTextTab('Child\'s Name:', 1, 230, body.childName),
        // makeTextTab('DOB:', 0.35, 40, body.childDOB),
        // makeTextTab('Gender:', 0.55, 45, body.childGender),
        // makeTextTab('Parent/Legal Guardian Name:', 2.2, 340, body.parentName),
        // docusign.Text.constructFromObject({
        //     anchorString: 'Information will be used', anchorUnits: 'inches',
        //     anchorYOffset: '1.05', anchorXOffset: '0.7',
        //     font: 'helvetica', fontSize: 'size11',
        //     bold: 'true', value: body.parentAddress,
        //     locked: 'false', tabId: 'Address',
        //     tabLabel: 'Address', width:450
        // }),
        // makeTextTab('City:', 0.25, 100, body.parentCity),
        // makeTextTab('State:', 0.35, 80, body.parentState),
        // makeTextTab('Zip Code', 0.7, 200, body.parentZip),
        // makeTextTab('Cell', -1.75, 100, body.parentPhone),
        // makeTextTab('Cell', 0.8, 150, body.parentCell),
        // makeTextTab('E-mail Address:', 1.4, 400, body.parentEmail),
        // makeTextTab('to pay living expenses):', 2.5, 150, usFormat.format(body.annualIncome)),
        // makeTextTab('Requested grant amount ($ amount required):', 3.5, 100, usFormat.format(body.requestedGrant)),
        // docusign.Text.constructFromObject({
        //     anchorString: 'account number', anchorUnits: 'inches',
        //     anchorCaseSensitive: false, 
        //     anchorYOffset: '0.1', anchorXOffset: 0,
        //     font: 'helvetica', fontSize: 'size7',
        //     bold: 'true', value: body.intendedUse,
        //     locked: 'false', tabId: 'account number',
        //     tabLabel: 'account number', width:600, height: 15
        // })
      ];

      break;
    default:
      throw new Error('Document not found');
  }
  return {
    docPath: doc,
    displayName: displayName,
    prefillVals: prefillVals,
    dsTabs: dsTabs, // signHereTabs, dateSignedTabs, checkboxTabs, textTabs
    recipients: recipients // signers
  };
  // remember doc is just a string
}
