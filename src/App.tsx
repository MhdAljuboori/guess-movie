import React, { Component } from 'react';
import MovieDescription from './Components/MovieDescription/MovieDescription';
import MoviesList, { IMovieItem } from './Components/MoviesList/MoviesList';
import './App.scss';

interface IAppState {
    loading: boolean;
    searchQuery: string;
    movies: IMovieItem[];
}

export default class App extends Component<null, IAppState> {


    constructor(props: null) {
        super(props);

        this.state = {
            searchQuery: '',
            loading: false,
            movies: []
        };
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
                message: searchQuery
            })
        };

        try {
            this.setState({
                loading: true,
                movies: []
            });
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/guess-movie`, options)
            const data = await response.json();
            this.setState({
                movies: data
            });

            this.setState({
                loading: false
            });
        } catch (error) {
            console.log(error);
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const { searchQuery, movies, loading } = this.state;

        return (
            <div className='flex flex-col items-center justify-center h-screen bg-slate-800'>
                <div>
                    <MovieDescription searchChanged={this.searchChanged} />
                </div>
                {searchQuery.length > 0 &&
                    <div className='h-full w-full p-4 overflow-auto bg-slate-950 text-white'>
                        <MoviesList loading={loading} movies={movies} />
                    </div>
                }
            </div>
        )
    }
}
