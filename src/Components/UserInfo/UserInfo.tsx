import React, { Component } from 'react';
import { User } from 'firebase/auth';
import './UserInfo.scss';

interface IUserInfoProps {
    user?: User;
    showQuota: boolean;
    signOut: () => void;
}

interface IUserInfoState {
    quota: number | null;
}

export default class UserInfo extends Component<IUserInfoProps, IUserInfoState> {

    constructor(props: IUserInfoProps) {
        super(props);

        this.state = {
            quota: null
        };
    }

    componentDidMount(): void {
        if (this.props.showQuota) {
            this._getUserQuota();
        }
    }

    componentDidUpdate(prevProps: IUserInfoProps) {
        if (this.props.showQuota !== prevProps.showQuota) {
            if (this.props.showQuota) {
                this._getUserQuota();
            } else {
                this._resetQuota();
            }
        }
    }

    private _resetQuota = () => {
        this.setState({
            quota: null
        });
    }

    private _getUserQuota = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-quota?userId=${this.props.user?.uid}`, options)
        const data = await response.json();
        this.setState({
            quota: data.quota,
        });
    }

    private _renderQuota = () => {
        const { quota } = this.state;

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

    private _renderUserInfo = (user: User, showQuota: boolean) => {

        return (
            <div className="user-info text-sm">
                <div className='flex justify-center gap-2'>
                    <div className='italic font-bold'>Welcome</div>
                    <div>{user.displayName}</div>
                    <span>
                        (<a href="/" onClick={this.props.signOut}>Sign out</a>)
                    </span>
                </div>
                {showQuota && this._renderQuota()}
            </div>
        )
    }

    render() {
        const { user, showQuota } = this.props;

        if (user) {
            return this._renderUserInfo(user, showQuota);
        }

        return null;
    }
}
