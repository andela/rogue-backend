import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Barefoot Nomad' }));
app.all('*', (req, res) => res.send({ message: 'route not found' }));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`Listening from port ${port}`);
});

export default app;
