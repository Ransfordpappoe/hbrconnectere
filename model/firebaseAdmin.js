const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.CLIENT_EMAIL,
        projectId: process.env.PROJECT_ID
    }),
    databaseURL: process.env.DATABASE_URL
});
const db = admin.database();
const firestore = admin.firestore();
module.exports = {db, admin, firestore};