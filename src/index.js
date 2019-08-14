const express = require('express');
require('dotenv').config();
const bodyPrser = require('body-parser');
const userRoutes = require('./routes/api/users')
const PORT = process.env.PORT || 5000;
const app = express();
app.use(bodyPrser.json());
app.use(bodyPrser.urlencoded({ extended: false }))
app.use('/api/v1', userRoutes)
app.get('/', (req, res) => {
    return res.status(200).send({
        message: 'Welcome to barefoot nomad'
    })
})
app.listen(PORT, console.log(`server started on port ${PORT}`))
