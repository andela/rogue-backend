require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/api/users';
const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api/v1', userRoutes)
app.get('/', (req, res) => {
    return res.status(200).send({
        message: 'Welcome to barefoot nomad'
    })
})

app.listen(PORT, console.log(`server started on port ${PORT}`))
