import express from 'express';
import actorRouter from './routes/actor.route.js';
import asyncError from 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger-spec.js';
import logger from './utils/logger.js';
import * as uuid from 'uuid';

const app = express();
app.use(express.json());

//Logger middleware
app.use((req, res, next) => {
    
    const uniqueNumber = uuid.v4();
    const { method, url, params, query, body, headers } = req;
    
    logger.info(`uuid = ${uniqueNumber} - Incoming Request - Method: ${method}, URL: ${url}, Headers: ${JSON.stringify(headers)}, Params: ${JSON.stringify(params)}, Query: ${JSON.stringify(query)}, Request Body: ${JSON.stringify(body)}`);
    res.on('finish', () => {
        const { statusCode } = res;
        logger.info(`uuid = ${uniqueNumber} - Outgoing Response - Status Code: ${statusCode}`);
    });

    next();
});

app.use('/api/actor', actorRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 3000;
app.listen(PORT, function(){
    console.log(`Sakila api is listening at http://localhost:${PORT}`);
});

app.get('/err', function (req, res) {
    throw new Error('Error!');
});