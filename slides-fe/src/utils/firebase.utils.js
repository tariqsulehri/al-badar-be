import firebase from 'firebase';  //Load all firebase util libary.
import 'firebase/firestore';
import 'firebase/auth';

var config = {
    apiKey: "AIzaSyB0gbMEoL2KHus_fMfyVQKJKIubh0UcARU",
    authDomain: "template-react-fae79.firebaseapp.com",
    projectId: "template-react-fae79",
    storageBucket: "template-react-fae79.appspot.com",
    messagingSenderId: "74702863218",
    appId: "1:74702863218:web:a8ac51864ba38ef919fbeb",
    measurementId: "G-S3L9QBFLXB"
  };
  

export const createUserProfileDocument = async (userAuth, addtionalData) => {

    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {

            await userRef.set({
                displayName,
                email,
                createdAt,
                ...addtionalData
            });

        } catch (error) {
            console.log("Error Creating User...", error.message);
        }

    }
    return userRef;
};


export const convertCollectionSnapshotToMap = (collections) => {
    const transformColletion = collections.docs.map(doc => {
        const { title, items } = doc.data();
        return {
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title: title,
            items: items
        }
    })

    return transformColletion.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    }, {});


}


// export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
//     const collectionRef = firestore.collection(collectionKey);
//     const batch = firestore.batch();

//     objectsToAdd.forEach(obj => {
//         const newDocRef = collectionRef.doc();
//         batch.set(newDocRef, obj)
//     });

//     return await batch.commit();
// }

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const facebookProvider = new firebase.auth.FacebookAuthProvider();
// facebookProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);
export const signInWithFacebook = () => auth.signInWithPopup(facebookProvider);
export default firebase;


