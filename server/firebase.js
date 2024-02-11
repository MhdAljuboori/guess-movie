const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { collection, doc, getDoc, setDoc } = require("firebase/firestore");
require('dotenv').config();


const collectionName = 'user-ip-usage';

// init firebase
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const getUserIp = (ipAddress) => {
    const col = collection(firestore, collectionName);
    return doc(col, ipAddress);
}

const getDocument = async (userIp) => {
    try {
        const userIpDoc = getUserIp(userIp);
        const docSnapshot = await getDoc(userIpDoc);

        return docSnapshot;
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}

const setDocument = async (userIp, data) => {
    try {
        const userIpDoc = getUserIp(userIp);
        await setDoc(userIpDoc, data);
    } catch (error) {
        console.error("Error setting document: ", error);
    }
}

module.exports = { getDocument, setDocument };
