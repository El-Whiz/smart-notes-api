const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/error_handler');
const userRoutes = require('./routes/user.route');
const noteRoutes = require('./routes/note.route');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(logger);

app.use('/api', userRoutes);
app.use('/api', noteRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'SmartNotes API is running' });
});

app.use(errorHandler);

module.exports = app;
