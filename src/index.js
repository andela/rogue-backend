/* eslint-disable linebreak-style */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import doc from '../doc.json';
import resetPasswordRoute from './routes/resetpassword';
import routes from './routes/v1';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// api doc
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(doc));

app.use('/api/v1', routes);

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Barefoot Nomad' }));
app.use('/', resetPasswordRoute);
app.all('*', (req, res) => res.send({ message: 'route not found' }));

app.listen(port, () => {
  console.info(`Server is up and listening on port ${port}`);
});

export default app;
