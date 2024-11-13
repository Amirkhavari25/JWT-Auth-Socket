require('dotenv').config();
const express = require('express');
const authRouter = require('./routes/authRoute');


const app = express();
const port = process.env.HTTP_PORT || 8080;
//middlewares
app.use(express.json());
app.use('/',authRouter);

app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(port, () => {
    console.log(`http server connected on port ${port}`);
});
