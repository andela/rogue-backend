import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Barefoot Nomad' }));
app.use('*', (req, res) => res.send({ message: 'route not found' }));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});

export default app;
