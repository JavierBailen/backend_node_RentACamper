const express = require("express");
const cors = require('cors');
const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

const bodyParser = require("body-parser");
const rentACamperRouter = require("./routes/rentACamperRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

//Para testear
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api/rentACamper", rentACamperRouter);

app.listen(PORT, ()=>{
    console.log(`La api está escuchando por el puerto ${PORT}`) 
})