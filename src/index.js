/* eslint-disable import/no-cycle */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';
import socketIo from 'socket.io';
<<<<<<< HEAD
=======
import http from 'http';
import path from 'path';
>>>>>>> feature(userNotification): user(requester) should get notified of his edited request.
import doc from '../doc.json';
import { HelperMethods } from './utils';
import routes from './routes';
import setUpPassport from './config/passport';

const publicPath = path.join(__dirname, '../public');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const server = http.Server(app);

export const io = socketIo(server);

io.on('connection', () => {
  console.info('user connected');
});

// Don't log to the console when running integration tests
if (app.get('env') !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  setUpPassport();
}

app.use(passport.initialize());
app.use(passport.session());

const server = app.listen(port, () => {
  console.info(`Server is up and listening on port ${port}`);
});

const io = socketIo(server);
io.on('connection', socket => { console.info(`${socket.id} connected`); });

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(doc));
app.set('x-powered-by', false);

routes(app);

app.all('*', (req, res) => res.status(404).json({
  success: false,
  message: 'The page you are looking for does not exist'
}));

app.use(HelperMethods.checkExpressErrors);
<<<<<<< HEAD
=======

app.all('*', (req, res) => res.send({
  message: 'route not found'
}));

server.listen(port, () => {
  console.info(`Server is up and listening on port ${port}`);
});
>>>>>>> feature(userNotification): user(requester) should get notified of his edited request.

export default app;
