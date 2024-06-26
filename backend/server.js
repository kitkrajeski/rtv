const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const {expressjwt} = require('express-jwt');
require('dotenv').config();

app.use(express.json); 
app.use(morgan('dev'));

mongoose.connect()
