const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 7000; // Use process.env.PORT for Vercel compatibility
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.json());

const dbUrl = process.env.DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log('DB connection error:', error));
db.once('open', () => console.log('Connected to database'));

// Import and use your routes
const tokenRoutes = require('./routes/tokenRoutes');
app.use('/api', tokenRoutes); // Prefix routes with /api for better organization



// Start the server
app.listen(port, () => {
    console.log('Server is listening at port ' + port);
});
