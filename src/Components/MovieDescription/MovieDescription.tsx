import React, { Component } from 'react';
import './MovieDescription.scss';

interface IMovieDescriptionProps {
    loading: boolean;
    searchChanged: (search: string) => void;
}

interface IMovieDescriptionState {
    searchQuery: string;
}

export default class MovieDescription extends Component<IMovieDescriptionProps, IMovieDescriptionState> {
    searchRef: React.RefObject<HTMLTextAreaElement>;

    constructor(props: IMovieDescriptionProps) {
        super(props);
        this.searchRef = React.createRef();

        this.state = {
            searchQuery: '',
        };
    }

    private _getUserMessage = () => {
        if (this.searchRef.current?.value) {
            return this.searchRef.current.value;
        }

        return null;
    }

    private _searchChanged = (message: string) => {
        this.props.searchChanged(message);
    }

    searchQueryChanged = () => {
        const message = this._getUserMessage();
        this.setState({ searchQuery: message || '' });
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            const message = this._getUserMessage();
            if (message) {
                this._searchChanged(message);
            }
        }
    }

    searchClicked = () => {
        const message = this._getUserMessage();
        if (message) {
            this._searchChanged(message);
        }
    }

    render() {
        const message = this.state.searchQuery;
        const { loading } = this.props;

        return (
            <div className='w-full flex flex-col justify-center items-center text-white'>
                <div className='flex flex-col w-[35rem] text-center items-center'>
                    <div className='opacity-80'>
                        <p className='mb-1'>
                            This app is using <a href='https://openai.com' target='_blank' rel='noreferrer'>GPT</a> & <a href='https://www.themoviedb.org' target='_blank' rel='noreferrer'>TMDB</a> to get your result, you can find the source code for <a href='https://github.com/MhdAljuboori/guess-movie' target='_blank' rel='noreferrer'>this</a> on this Github Repository
                        </p>
                    </div>

                    <textarea
                        className='mt-4 input-control w-96 max-w-full h-24 text-black'
                        placeholder='What is your movie story?'
                        ref={this.searchRef}
                        disabled={loading}
                        onKeyDown={this.onKeyDown}
                        onChange={this.searchQueryChanged}>
                    </textarea>
                </div>

                <div className='flex justify-end w-96'>
                    <button
                        className='btn-primary'
                        disabled={message.length === 0 || loading}
                        onClick={this.searchClicked}>
                        Search
                    </button>
                </div>
            </div>
        )
    }
}
