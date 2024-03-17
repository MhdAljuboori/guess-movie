import React, { Component } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { FirebaseApp, initializeApp } from "firebase/app";
import './Login.scss';

interface ILoginProps {
    userSet: (user: any) => void;
}

interface ILoginState {
    errorMessage?: string;
    user?: User;
}

export default class Login extends Component<ILoginProps, ILoginState> {

    firebaseApp: FirebaseApp | null = null;

    constructor(props: ILoginProps) {
        super(props);

        this.state = {};
        this._initFirebase();
    }

    private _initFirebase() {
        const firebaseConfig = {
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_PROJECT_ID,
            storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_APP_ID,
            measurementId: process.env.REACT_APP_MEASUREMENT_ID
        };
        this.firebaseApp = initializeApp(firebaseConfig);
    }

    signInWithGoogle = () => {
        if (!this.firebaseApp) {
            return;
        }

        this.setState({ errorMessage: '' });

        const auth = getAuth(this.firebaseApp);
        auth.languageCode = 'en';

        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    const user = result.user;
                    this.setState({
                        user: user
                    });
                    this.props.userSet(user);
                }
            }).catch((error) => {
                this.setState({ errorMessage: error.message });
            });
    }

    render() {
        const { errorMessage } = this.state;

        return (
            <div className="flex justify-center items-center h-full">
                <div className="rounded-lg p-4 w-[35rem] max-w-full shadow-2xl bg-white text-black">
                    <p>You can try the Guess Movie by logging in, it's simple login using Google</p>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    <div className='text-center mt-3'>
                        <button
                            type="button"
                            className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55"
                            onClick={this.signInWithGoogle}>
                            <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
