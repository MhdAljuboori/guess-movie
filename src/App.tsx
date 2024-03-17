import React, { Component } from 'react';
import { User } from 'firebase/auth';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import './App.scss';

interface IAppState {
    user?: User;
}

export default class App extends Component<null, IAppState> {

    private readonly _SIGNED_IN_USER = 'signed-in-user';

    constructor(props: null) {
        super(props);

        try {
            const stringifiedUser = localStorage.getItem(this._SIGNED_IN_USER);
            const user = stringifiedUser ? JSON.parse(stringifiedUser) : null;
            if (user) {
                this.state = {
                    user: user
                };
            } else {
                this.state = {};
            }
        } catch (e) {
            this.state = {};
        }
    }

    userSet = (user: any) => {
        this.setState({
            user: user
        });

        localStorage.setItem(this._SIGNED_IN_USER, JSON.stringify(user));
    }

    signOut = () => {
        localStorage.removeItem(this._SIGNED_IN_USER);
        this.setState({
            user: undefined
        });
    }

    render() {
        const { user } = this.state;

        return (
            <div className="bg-slate-800 h-screen text-white">
                {user && <Home user={user} signOut={this.signOut} />}
                {!user && <Login userSet={this.userSet} />}
            </div>
        )
    }
}
