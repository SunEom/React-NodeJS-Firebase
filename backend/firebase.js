var firebase = require("firebase/app");

var admin = require("firebase-admin");
var serviceAccount = require("./public/keys/serviceAccountKey.json");

const myFb = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = myFb.auth();
