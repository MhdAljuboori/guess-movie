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
    apiKey: string | null;
    movies: IMovieItem[];
}

export default class Home extends Component<IHomeProps, IHomeState> {

    constructor(props: IHomeProps) {
        super(props);

        this.state = {
            searchQuery: '',
            apiKey: null,
            loading: false,
            error: '',
            movies: []
        };
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
            this.setState({
                error: data.error,
                movies: data,
                loading: false,
            });
        } catch (error) {
            console.error(error);
            this.setState({
                error: 'Unknown error',
                loading: false
            });
        }
    }

    render() {
        const { searchQuery, movies, loading, error, apiKey } = this.state;

        return (
            <div>
                <Navbar apiChanged={this.apiChanged} />

                <div className='flex flex-col items-center justify-center'>
                    <div className='p-5'>
                        <div className='pb-2 text-center'>
                            <UserInfo user={this.props.user} signOut={this.props.signOut} showQuota={apiKey ? false : true} />
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
