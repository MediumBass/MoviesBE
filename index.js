const express = require('express');
const app = express();

require('dotenv').config();

const combinedRouter = require('./routers/');
const cookieParser = require('cookie-parser');
const responseWrapper = require('./middlewares/responseWrapper');
const db = require('./database/models');
const path = require("node:path");

app.use(express.json());
app.use(responseWrapper)
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register.html'));
});

app.use('/api/v1', combinedRouter)

app.use((req, res) => {
    res.status(404).send('Route not found');
});


app.listen(process.env.APP_PORT, () => {
    console.log(`Server running at http://localhost:${process.env.APP_PORT}`);
});