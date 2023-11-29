const express = require('express');
const app = express();
const request = require('request');
const cheerio = require('cheerio');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/color-guess-rules/', (req, res) => {
    const { url } = req.body;
    console.log('URL', url);
    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            $('prep').each((i, el) => {
                const item = $(el).text();
                console.log('ITEM', item);
            })
        }
        res.send({
            message: 'Hello World'
        })
    })
})

app.listen(3001, () => {
    console.log('SERVER IS RUNNING');
})