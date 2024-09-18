import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSoYkWEAUz5iLunbN5aOyUWlj9KeWvbyQ",
    authDomain: "bookstore-6fb30.firebaseapp.com",
    projectId: "bookstore-6fb30",
    storageBucket: "bookstore-6fb30.appspot.com",
    messagingSenderId: "201207289763",
    appId: "1:201207289763:web:41099068a48aa59ea3ac16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <FirebaseContext.Provider value={{ auth, user, functions }}>
            {children}
        </FirebaseContext.Provider>
    );
};
