import React from "react";
import firebase  from "./firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {useParams} from 'react-router-dom'


function SignInScreen() {
    // Configure FirebaseUI.
    let {redirect} = useParams();
    let uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        signInSuccessUrl: decodeURIComponent(redirect) || "/"
    };

    return (
            <div>
                <h1>Welcome to Cuando</h1>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
        );
}

export default SignInScreen;