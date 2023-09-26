import express from 'express';
import actorRouter from './routes/actor.route.js';
import asyncError from 'express-async-errors';

const app = express();

app.use(express.json());
app.use('/api/actor', actorRouter);

const PORT = 3000;
app.listen(PORT, function(){
    console.log(`Sakila api is listening at http://localhost:${PORT}`);
});

app.get('/err', function (req, res) {
    throw new Error('Error!');
  })