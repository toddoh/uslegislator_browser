const express = require('express');
const path = require('path');
const http = require('http');
var cors = require('cors');

const app = express();
const router = express.Router();
app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'dist')));

const routes = require('./routes')
app.use('/', routes);

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Server Running on port ${port}`))
