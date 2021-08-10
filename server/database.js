/**
 * Populates and manages database operations, currently using MongoDB Atlas Cluster.
 * 
 * @author Neel Sortur.
 */

const database  = exports
    , {MongoClient} = require('mongodb')
    , dsConfig = require('../config/index.js').config;

const uri = `mongodb+srv://nsortur:${dsConfig.mongodbPassword}@projects.zj6ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`
    , client = new MongoClient(uri);

/**
 * Populates information into the bsignature database.
 * @param {object} info values to populate
 * @param {String} collectionName collection to populate values into
 */
database.populateAidInfo = async (info, collectionName) => {
  try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db("bsignature");
    const col = db.collection(collectionName);
    
    // Insert a single document
    const p = await col.insertOne(info);
    console.log('Successfully added');
    // Find one document
    // const myDoc = await col.findOne();
    // // Print to the console
    // console.log(myDoc);
  } catch (err) {
    console.log(err.stack);
  }
  
  finally {
    await client.close();
  }
}

/**
 * Gets relevant data from the bsignature database through patient full name.
 * 
 * @param {String} patientName the patient's first and last name to search
 * @param {Boolean} searchSingle whether to search for a value or query entire database
 * @returns {object} medInfoResults and familyInfoResults stemming from patient name
 */
database.queryByPatientName = async (patientName, searchSingle, res) => {
  try {
    await client.connect();
    const col = client.db("bsignature")
        , medInfo = col.collection("childMedicalInfo")
        , familyInfo = col.collection("familyAidInfo")

    const medInfoResults = await allMatchingInCollection(patientName, searchSingle, medInfo)
    , familyInfoResults = await allMatchingInCollection(patientName, searchSingle, familyInfo);
    
    return {
      medInfoResults: medInfoResults,
      familyInfoResults: familyInfoResults 
    };
  } catch (err) {
    console.log(err.stack);
    throw new Error("Querying failed");
  }

  finally {
    await client.close();
  }
}

// gets all matching patient names in given collection
async function allMatchingInCollection(matchName, searchSingle, collection) {
  let infoCursor;
  if (searchSingle) {
    infoCursor = await collection.find({childName: matchName})
  } else {
    infoCursor = await collection.find()
  }

  console.log(`Found results for collection ${collection.collectionName}, size: ${await infoCursor.count()}`);
  const infoResults = [];

  // get all results
  await infoCursor.forEach((doc) => {
    infoResults.push(doc);
  });
  return infoResults;
}