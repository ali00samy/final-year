const Joi = require('joi');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const atuhRoutes = require('./routes/auth');
const express = require('express');
const app = express();


mongoose.connect('mongodb://localhost/proj',{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.json());
require('./satrtup/prod')(app)
app.use('/users', usersRoutes);
app.use('/login', atuhRoutes);

const port = process.env.PORT || 555
app.listen(port, () => console.log(`Listening on port ${port}...`));