const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const SSE = require('./helpers/sse');
const sse = new SSE();

const ENV = 'development';
const port = process.env.PORT || 8080;

// parse application/json
app.use(bodyParser.json());

// template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.render('index')
});

// app.get('/sse/item/:itemId/:userId', sse.route({
//   params: ['itemId', 'userId'],
//   prefix: 'items'
// }));

app.get('/sse/all', sse.route({
  prefix: 'all'
}, (req, res) => {
  const sendEvent = () => {
    sse.emitTo({
      prefix: 'all',
      event: 'user_connection',
      data: {
        prefix: 'all',
        total: sse.clientsConnected({ prefix: 'all' })
      }
    });
  }

  sendEvent();

  req.on('close', () => {
    sendEvent();
  });
}));

// setInterval(() => {
//   sse.emitTo({
//     prefix: 'all',
//     data: { message: 'eai' }
//   });

//   sse.emitTo({
//     prefix: 'al321321l',
//     data: { message: 'eai' }
//   });
// }, 2000);

app.listen(port);

console.log(`App running on port: ${port} in ${ENV} mode`);
