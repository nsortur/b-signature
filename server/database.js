/**
 * Populates and manages database operations, currently using MongoDB Atlas Cluster.
 *
 * @author Neel Sortur.
 */

const database = exports,
  { MongoClient } = require("mongodb"),
  dsConfig = require("../config/index.js").config,
  fastcsv = require("fast-csv"),
  fs = require("fs"),
  path = require("path"),
  exportAllPath = path.resolve(__dirname, "bepos_all_patient_data.csv");

const uri = `mongodb+srv://nsortur:${dsConfig.mongodbPassword}@projects.zj6ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`,
  client = new MongoClient(uri);

/**
 * Populates patient aid information into the bsignature database
 * if it doesn't exist already
 * @param {object} info values to populate
 * @param {String} collectionName collection to populate values into
 */
database.populateAidInfo = async (info, collectionName) => {
  try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db("bsignature");
    const col = db.collection(collectionName);

    // standardize name format: firstlast
    info.childName = info.childName.toLowerCase().trim();

    const p = await col.insertOne(info);
    console.log("Successfully added");
    // Find one document
    // const myDoc = await col.findOne();
    // // Print to the console
    // console.log(myDoc);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
};

/**
 * Gets relevant data from the bsignature database through patient full name.
 *
 * @param {String} patientName the patient's first and last name to search
 * @param {Boolean} searchSingle whether to search for a value or query entire database
 * @returns {Promise<object>} medInfoResults and familyInfoResults stemming from patient name
 */
database.queryByPatientName = async (patientName, searchSingle, res) => {
  try {
    await client.connect();
    const col = client.db("bsignature"),
      medInfo = col.collection("childMedicalInfo"),
      familyInfo = col.collection("familyAidInfo");

    let medInfoResults, familyInfoResults;
    if (searchSingle) {
      const searchName = patientName.toLowerCase().trim();
      medInfoResults = await allMatchingInCollection(searchName, medInfo);
      familyInfoResults = await allMatchingInCollection(searchName, familyInfo);
    } else {
      medInfoResults = await allInCollection(medInfo);
      familyInfoResults = await allInCollection(familyInfo);
    }

    // if we get results, uppercase the names in all results back
    const medInfoFormatted = formatNames(medInfoResults);
    const familyInfoFormatted = formatNames(familyInfoResults);
    return {
      medInfoResults: medInfoFormatted,
      familyInfoResults: familyInfoFormatted,
    };
  } catch (err) {
    console.log(err.stack);
    throw new Error("Querying failed");
  } finally {
    await client.close();
  }
};

// formats names properly for viewing documents' information
function formatNames(documents) {
  // uppercase first letter of each part of name
  return documents.map((document) => {
    document.childName = document.childName
      .split(" ")
      .map((x) => {
        return x[0].toUpperCase() + x.substring(1);
      })
      .join(" ");
    return document;
  });
}

// gets all matching patient names in given collection
async function allMatchingInCollection(matchName, collection) {
  const infoCursor = await collection.find({ childName: matchName });

  console.log(
    `Found results for collection ${
      collection.collectionName
    }, size: ${await infoCursor.count()}`
  );
  const infoResults = [];

  // get all results
  await infoCursor.forEach((doc) => {
    infoResults.push(doc);
  });
  return infoResults;
}

// gets all information from a collection
async function allInCollection(collection) {
  const infoCursor = await collection.find();
  console.log(
    `Found results for collection ${
      collection.collectionName
    }, size: ${await infoCursor.count()}`
  );
  const infoResults = [];

  // get all results
  await infoCursor.forEach((doc) => {
    infoResults.push(doc);
  });
  return infoResults;
}

database.exportAll = async (req, res) => {
  try {
    await client.connect();
    const col = client.db("bsignature"),
      medInfo = col.collection("childMedicalInfo"),
      familyInfo = col.collection("familyAidInfo");

    const medInfoResults = await allInCollection(medInfo),
      familyInfoResults = await allInCollection(familyInfo),
      allResults = [];
    // join patient information

    medInfoResults.forEach((patientInfo) => {
      delete patientInfo["_id"];
      let patientName = patientInfo["childName"],
        familyInfo = familyInfoResults.find(
          (elem) => elem.childName === patientName
        );
      // merge dictionary and push to all results, only if both are filled
      if (familyInfo !== undefined) {
        delete familyInfo["_id"];
        // no duplicate patient name
        delete familyInfo["childName"];
        allResults.push(Object.assign({}, patientInfo, familyInfo));
      }
    });

    // write to csv and send to frontend
    try {
      await fastcsv
        .writeToPath(exportAllPath, allResults, { headers: true })
        .on("finish", () => {
          console.log("Writing successful, sending file to frontend");
          res.download(exportAllPath);
        })
        .on("error", (err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log(err.stack);
    throw new Error("Querying failed");
  } finally {
    await client.close();
  }
};
