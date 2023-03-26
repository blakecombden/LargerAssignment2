import express from 'express';
import path from 'path';
import {MongoClient} from "mongodb";
import {fileURLToPath} from 'url';
import multer from 'multer';

const app = express();
const port = 8000;
let url = "mongodb://127.0.0.1:27017";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../posters')));

const upload = multer({dest: 'posters/'});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.get('/api/movies', async (req, res) => {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db('movies');
    const movieData = await db.collection('movieReviews').find({}).toArray();
    res.json(movieData);
});

app.post('/api/review', upload.single('image'), async (req, res) => {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db('movies');

    const result = await db.collection('movieReviews').insertOne(
        {'title':req.body.title,
            'releaseDate':req.body.releaseDate,
            'actors':req.body.actors,
            'rating':req.body.rating,
            'image':req.file.filename});

    console.log(`${req.body.title} was added.`);
    res.redirect('/');
});

app.post('/api/removeMovie', async (req, res) => {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db('movies');
    const result = await db.collection('movieReviews').deleteOne({title: req.body.title});
    if (result.deletedCount === 1) {
        console.log(`${req.body.title} was removed.`);
    } else {
        console.log("There was an error. Movie not removed.");
    }
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});