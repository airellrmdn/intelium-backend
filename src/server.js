const express = require('express');
const routerPath = require('./routes/router');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log('Server is listening on port:', port);
});

app.get('/intelium', (req, res) => {
    res.json({ status: 'Intelium Server is running' });
});

app.use('/intelium', routerPath);
