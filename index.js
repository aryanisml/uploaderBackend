require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const fileRoute = require('./routes/file');
const api = require('./routes/auth.routes');
const cors = require ('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('./db/db'); 

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


 app.use(express.static(path.join(__dirname, '..', 'build')));
 app.use(fileRoute);
//  app.use(app);

// Serve static resources
  app.use('/public', express.static('public'));

app.use('/api', api)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(3030, () => {
  console.log('server started on port 3030');
});
