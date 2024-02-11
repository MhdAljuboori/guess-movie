import React, { Component } from 'react';
import './Navbar.scss';

interface INavbarProps {
    apiChanged: (apiKey: string | null) => void;
}

interface INavbarState {
    apiKey: string | null;
}

export default class Navbar extends Component<INavbarProps, INavbarState> {
    apiRef: React.RefObject<HTMLInputElement>;

    constructor(props: INavbarProps) {
        super(props);
        this.apiRef = React.createRef();

        this.state = {
            apiKey: null,
        };
    }

    private _getApiKey = () => {
        if (this.apiRef.current?.value) {
            return this.apiRef.current.value;
        }

        return null;
    }

    private _apiChanged = (apiKey: string | null) => {
        this.props.apiChanged(apiKey);
    }

    apiChanged = () => {
        const apiKey = this._getApiKey();
        this.setState({ apiKey: apiKey });
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            const apiKey = this._getApiKey();
            this._apiChanged(apiKey);
        }
    }

    apiKeyChanged = () => {
        const apiKey = this._getApiKey();
        this._apiChanged(apiKey);
    }

    render() {
        return (
            <div className='flex justify-between items-center bg-slate-900 py-1 px-2'>
                <div className='text-zinc-300 text-sm'>
                    If you want to have more than 3 request, you can paste your own OpenAI key
                    <br/> we won't save your key it will be only used during the request
                </div>

                <input
                    type='text'
                    className='input-control input-sm w-96 max-w-full text-black'
                    placeholder='Leave it empty to use your free tests'
                    ref={this.apiRef}
                    onBlur={this.apiKeyChanged}
                    onKeyDown={this.onKeyDown}
                    onChange={this.apiChanged} />
            </div>
        )
    }
}
