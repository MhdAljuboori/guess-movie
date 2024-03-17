import React, { Component } from 'react';
import { User } from 'firebase/auth';
import './UserInfo.scss';

interface IUserInfoProps {
    user?: User;
    signOut: () => void;
}

export default class UserInfo extends Component<IUserInfoProps, any> {

    private _renderUserInfo = (user: User) => {
        return (
            <div className="user-info text-sm">
                <div className='flex justify-center gap-2'>
                    <div className='italic font-bold'>Welcome</div>
                    <div>{user.displayName}</div>
                    <span>
                        (<a href="/" onClick={this.props.signOut}>Sign out</a>)
                    </span>
                </div>
            </div>
        )
    }

    render() {
        const { user } = this.props;

        if (user) {
            return this._renderUserInfo(user);
        }

        return null;
    }
}
