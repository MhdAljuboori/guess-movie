const admin = require('firebase-admin');
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { collection, doc, getDoc, setDoc } = require("firebase/firestore");
require('dotenv').config();


const collectionName = process.env.QUOTA_COLLECTION_NAME ? process.env.QUOTA_COLLECTION_NAME : 'users-quota';

// init firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.REACT_APP_PROJECT_ID,
        clientEmail: process.env.REACT_APP_CLIENT_EMAIL,
        privateKey: process.env.REACT_APP_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
});

const getUserId = (userId) => {
    const col = collection(firestore, collectionName);
    return doc(col, userId);
}

const getDocument = async (userIp) => {
    try {
        const userIpDoc = getUserId(userIp);
        const docSnapshot = await getDoc(userIpDoc);

        return docSnapshot;
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}

const setDocument = async (userIp, data) => {
    try {
        const userIpDoc = getUserId(userIp);
        await setDoc(userIpDoc, data);
    } catch (error) {
        console.error("Error setting document: ", error);
    }
}

const getUserById = async (userId) => {
    const user = await admin.auth().getUser(userId);

    return user;
}

module.exports = { getDocument, setDocument, getUserById };
