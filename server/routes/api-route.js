const router = require('express').Router();
const fetch = require("node-fetch");
const { getDocument, setDocument, getUserById } = require('../firebase');

router.post('/guess-movie', async (req, res) => {
    if (!req.body.apiKey) {
        const userId = req.body.userId;

        const user = await getUserById(userId);
        if (!user) {
            return res.send({ error: 'User not found' });
        }

        const doc = await getDocument(userId);
        let userIdData = null;
        if (doc.exists()) {
            userIdData = doc.data();
        }

        const count = userIdData?.usageCount || 0;
        const maximumTries = parseInt(process.env.NUMBER_OF_TRIES);
        if (count >= maximumTries) {
            return res.send({ error: `You can\'t make more than ${maximumTries} requests` });
        }

        try {
            await setDocument(
                userId,
                { usageCount: count + 1 }
            );
        } catch(e) {
            console.log(e);
            return res.send({ error: 'Database error' });
        }
    }

    const messages = [{
        role: 'system',
        content: 'Your job is to give the movies name when the user provides a description of a movie, as an "AI Movie Reminder"\n' +
            'as an "AI Movie Reminder" you\'re only allowed to answer questions about movies\n' +
            'Your answers should be a JSON, showing the movie names, the year of the movie, and the movie language\n' +
            'Your responses should only be an JSON looks like\n{\n    "movies": [{"name":"A Beautiful Mind", "year":"2001", "language": "en"}, {"name":"Dark Waters", "year": "2019", "language": "en"}]\n}\n\n' +
            'DO NOT write any word just the needed JSON'
    }, {
        role: 'assistant',
        content: '{\n"movies": [{"name":"A Beautiful Mind", "year":"2001"}, {"name":"Dark Waters", "year": "2019"}]\n}'
    }];

    try {
        messages.push({role: 'user', content: req.body.message});

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.body.apiKey ? req.body.apiKey : process.env.OPEN_AI_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.AI_MODEL ? process.env.AI_MODEL : 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 64,
            })
        };

        const response = await fetch(`https://api.openai.com/v1/chat/completions`, options);

        const data = await response.json();

        if (data.error) {
            return res.send({ error: data.error.message });
        }

        try {
            const foundMovies = [];
            const moviesObj = JSON.parse(data.choices[0].message.content);
            const movies = moviesObj.movies;

            for (const movie of movies) {
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${ process.env.TMDB_API_KEY }&query=${ encodeURIComponent(movie.name) }&year=${ movie.year }&language=${ movie.language }`);
                const movieData = await response.json();

                for (const movieObj of movieData.results) {
                    foundMovies.push({
                        title: movieObj.title,
                        poster: movieObj.poster_path ? `http://image.tmdb.org/t/p/w500${ movieObj.poster_path }` : null
                    });
                }

            }

            res.send(foundMovies);
        } catch (error) {
            console.log(error);
            res.send({ error: 'Could not get movies' });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;