const PORT = 8000;
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { getDocument, setDocument } = require('./firebase');
require('dotenv').config();

// init app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('AI for guessing movie');
})

app.post('/api/guess-movie', async (req, res) => {
    if (!req.body.apiKey) {
        const userIP = req.ip;

        const doc = await getDocument(userIP);
        let userIPData = null;
        if (doc.exists()) {
            userIPData = doc.data();
        }

        const count = userIPData?.usageCount || 0;
        if (count >= 3) {
            return res.send({ error: 'You can\'t make more than 3 requests' });
        }

        try {
            await setDocument(
                userIP,
                { usageCount: count + 1 }
            );
        } catch(e) {
            console.log(e);
            return res.send({ error: 'Database error' });
        }
    }

    const messages = [{
        role: 'system',
        content: `Your name will be "AI Movie Reminder" Your job is to give the movies name when the user provides a description of the movie that he wants to remember its name, as an "AI Movie Reminder" you're not allowed to answer any questions just a list of movies names with the year of the movie, your response should be an JSON looks like\n{\n    "movies": [{"name":"A Beautiful Mind", "year":"2001"}, {"name":"Dark Waters", "year": "2019"}]\n}\n\nDO NOT write any word just the needed JSON`
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
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 64,
            })
        };

        const response = await fetch(`https://api.openai.com/v1/chat/completions`, options);

        const data = await response.json();
        console.log(data);


        if (data.error) {
            return res.send({ error: data.error.message });
        }

        try {
            const foundMovies = [];
            console.log(data.choices[0].message);
            const moviesObj = JSON.parse(data.choices[0].message.content);
            const movies = moviesObj.movies;

            for (const movie of movies) {
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${ process.env.TMDB_API_KEY }&query=${ encodeURIComponent(movie.name) }&year=${ movie.year }`);
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
})

app.listen(PORT, () => console.log('Your server is running on PORT: ' + PORT));

