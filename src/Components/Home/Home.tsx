import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import UserInfo from '../UserInfo/UserInfo';
import MovieDescription from '../MovieDescription/MovieDescription';
import MoviesList, { IMovieItem } from '../MoviesList/MoviesList';
import { User } from 'firebase/auth';
import './Home.scss';

interface IHomeProps {
    user: User;
    signOut: () => void;
}

interface IHomeState {
    loading: boolean;
    error: string;
    searchQuery: string;
    quota: number | null;
    apiKey: string | null;
    movies: IMovieItem[];
}

export default class Home extends Component<IHomeProps, IHomeState> {

    constructor(props: IHomeProps) {
        super(props);

        this.state = {
            searchQuery: '',
            quota: null,
            apiKey: null,
            loading: false,
            error: '',
            movies: []
        };
    }

    componentDidMount(): void {
        if (!this.state.apiKey) {
            this._getUserQuota();
        }
    }

    componentDidUpdate(prevProps: IHomeProps, prevState: IHomeState) {
        if (this.state.apiKey !== prevState.apiKey) {
            if (this.state.apiKey) {
                this._resetQuota();
            } else {
                this._getUserQuota();
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

    apiChanged = (apiKey: string | null) => {
        this.setState({
            apiKey: apiKey
        });
    }

    searchChanged = async (searchQuery: string) => {
        this.setState({
            searchQuery: searchQuery
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: this.state.apiKey,
                message: searchQuery,
                userId: this.props.user.uid
            })
        };

        try {
            this.setState({
                loading: true,
                error: '',
                movies: []
            });
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/guess-movie`, options)
            const data = await response.json();
            if (data.error) {
                const quota = data.quota !== null && data.quota !== undefined ?
                    data.quota :
                    this.state.quota;

                this.setState({
                    error: data.error,
                    quota: quota,
                    loading: false,
                });
            } else {
                this.setState({
                    quota: data.quota,
                    movies: data.movies,
                    loading: false,
                });
            }
        } catch (error) {
            console.error(error);
            this.setState({
                error: 'Unknown error',
                loading: false
            });
        }
    }

    render() {
        const { searchQuery, movies, loading, error, apiKey, quota } = this.state;

        return (
            <div>
                <Navbar apiChanged={this.apiChanged} />

                <div className='flex flex-col items-center justify-center'>
                    <div className='p-5'>
                        <div className='pb-2 text-center'>
                            <UserInfo user={this.props.user} signOut={this.props.signOut} showQuota={apiKey ? false : true} quota={quota} />
                        </div>
                        <MovieDescription loading={loading} searchChanged={this.searchChanged} />
                    </div>
                    {searchQuery.length > 0 &&
                        <div className='h-full w-full p-4 overflow-auto bg-slate-950 text-white'>
                            <MoviesList loading={loading} movies={movies} error={error} />
                        </div>
                    }
                </div>
            </div>
        )
    }
}
