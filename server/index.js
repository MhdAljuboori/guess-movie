const PORT = 8000;
const express = require("express");
const cors = require("cors");
require('dotenv').config();

// init app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        credentials: true,
    })
);

app.get('/', (req, res) => {
    res.send('AI for guessing movie');
});

app.use('/api', require('./routes/api-route'));

app.listen(PORT, () => console.log('Your server is running on PORT: ' + PORT));

