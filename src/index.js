import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import doc from '../doc.json';
import routes from './routes/v1';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// api doc
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(doc));

app.use('/api/v1', routes);

app.get('/', (req, res) => res.status(200).json({
  message: 'Welcome to Barefoot Nomad'
}));
app.all('*', (req, res) => res.status(404).json({
  message: 'route not found'
}));

app.listen(port, () => {
  console.info(`Server is up and listening on port ${port}`);
});

export default app;
