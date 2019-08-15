/* eslint-disable linebreak-style */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoute from './routes/api/users'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Barefoot Nomad' }));
app.use('/api/v1', userRoute);
app.all('*', (req, res) => res.send({ message: 'route not found' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`Listening from port ${port}`);
});

export default app;
