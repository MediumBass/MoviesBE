const express = require('express');
const app = express();
const PORT = 3000;
const moviesRouter = require('./routers/moviesRouter');
const responseWrapper = require('./middlewares/responseWrapper');
const db = require('./database/models');
app.use(express.json());
app.use(responseWrapper)

app.get('/', (req, res) => {
    res.send('Welcome to Express server!');
});
app.use('/movies', moviesRouter)

app.use((req, res) => {
    res.status(404).send('Route not found');
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});