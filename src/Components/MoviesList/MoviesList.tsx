import React, { Component } from 'react'

export interface IMovieItem {
    title: string;
    poster: string;
}

interface IMoviesListProps {
    movies: IMovieItem[];
    error: string;
    loading: boolean;
}

export default class MoviesList extends Component<IMoviesListProps> {

    render() {
        const { movies, loading, error } = this.props;

        return (
            <div className='flex justify-center text-center m-auto'>
                <div className='flex gap-4 flex-wrap w-[60rem] max-w-full justify-center'>
                    {loading && <div>Thinking...</div>}

                    {error && <div className='text-red-500'>{error}</div>}

                    {!loading && !error && (movies.length > 0 ? movies.map((movie, index) => (
                        <div key={index} className='text-white'>
                            {movie.poster && <img className='w-48 rounded-md' src={movie.poster} alt={movie.title} />}
                            {!movie.poster &&
                                <div className='h-[288px] flex items-center justify-center bg-slate-900 rounded-md'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                            }
                            <h3 className='w-48 mt-2'>{movie.title}</h3>
                        </div>
                    )) : 'No Results found!')}
                </div>
            </div>
        )
    }
}
