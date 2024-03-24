import React, { Component } from 'react';
import { User } from 'firebase/auth';
import './UserInfo.scss';

interface IUserInfoProps {
    user?: User;
    showQuota: boolean;
    quota: number | null;
    signOut: () => void;
}

export default class UserInfo extends Component<IUserInfoProps, any> {

    private _renderQuota = (quota: number | null) => {
        let quotaText = null;
        if (quota === null) {
            quotaText = "Loading quota...";
        } else if (quota === 0) {
            quotaText = "You have no requests left";
        } else {
            quotaText = "You have " + quota + " requests left";
        }

        return (
            <div className='text-center font-mono'>
                { quotaText }
            </div>
        )
    }

    private _renderUserInfo = (user: User, showQuota: boolean, quota: number | null) => {

        return (
            <div className="user-info text-sm">
                <div className='flex justify-center gap-2'>
                    <div className='italic font-bold'>Welcome</div>
                    <div>{user.displayName}</div>
                    <span>
                        (<a href="/" onClick={this.props.signOut}>Sign out</a>)
                    </span>
                </div>
                {showQuota && this._renderQuota(quota)}
            </div>
        )
    }

    render() {
        const { user, showQuota, quota } = this.props;

        if (user) {
            return this._renderUserInfo(user, showQuota, quota);
        }

        return null;
    }
}
