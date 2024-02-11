import React, { Component } from 'react';
import Navbar from './Components/Navbar/Navbar';
import MovieDescription from './Components/MovieDescription/MovieDescription';
import MoviesList, { IMovieItem } from './Components/MoviesList/MoviesList';
import './App.scss';

interface IAppState {
    loading: boolean;
    error: string;
    searchQuery: string;
    apiKey: string | null;
    movies: IMovieItem[];
}

export default class App extends Component<null, IAppState> {


    constructor(props: null) {
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
                message: searchQuery
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
        const { searchQuery, movies, loading, error } = this.state;

        return (
            <div>
                <Navbar apiChanged={this.apiChanged} />

                <div className='flex flex-col items-center justify-center h-screen bg-slate-800'>
                    <div>
                        <MovieDescription  loading={loading} searchChanged={this.searchChanged} />
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
