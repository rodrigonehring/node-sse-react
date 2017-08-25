const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');

const { sse, sseConfig } = require('./helpers/sse');

const ENV = 'development';
const port = process.env.PORT || 8080;
const cookieName = 'HI-FINGERPRINT';

// parse application/json
app.use(bodyParser.json());

// template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.render('index')
});

function parseCookies(cookies) {
  if (!cookies) {
    return {};
  }

  return cookies
    .split(';')
    .reduce((acc, curr) => {
      const parts = curr.split('=');
      acc[parts.shift().trim()] = decodeURI(parts.join('='));
      return acc;
    }, {});
}

function makeFingerPrint(ua) {
  return md5(`${ua}-${Date.now()}`);
}

app.get('/sse/accounts/:customerId/:userId', (req, res) => {
  let config;
  const cookies = parseCookies(req.headers.cookie);
  const fingerprint = cookies[cookieName] || makeFingerPrint(req.headers['user-agent']);

  // se ja tem cookie, retorna config padrao do sse
  // se nao, retorna setCookie
  if (cookies[cookieName]) {
    config = sseConfig;
  } else {
    config = Object.assign(sseConfig, {
      'Set-Cookie': `${cookieName}=${fingerprint}`,
    });
  }

  console.log('config------------->');
  console.log(config);
  console.log('<-------------config');

  req.socket.setTimeout(Number.MAX_VALUE);
  res.writeHead(200, config);
  res.write('\n');

  const removeClient = sse.addUser(req.params.customerId, req.params.userId, fingerprint, res);

  req.on('close', removeClient);
});

app.get('/online/:userId', (req, res) => {
  const users = sse.countClients(`accounts-${req.params.userId}`);
  res.send({ users });
});

app.get('/sse/stats', (req, res) => {
  req.socket.setTimeout(Number.MAX_VALUE);
  res.writeHead(200, sseConfig);
  res.write('\n');

  const removeClient = sse.addClient('stats', res);

  req.on('close', removeClient);
});

// app.get('/sse/all', sse.route({
//   prefix: 'all'
// }, (req, res) => {
//   const sendEvent = () => {
//     sse.emitTo({
//       prefix: 'all',
//       event: 'user_connection',
//       data: {
//         prefix: 'all',
//         total: sse.clientsConnected({ prefix: 'all' })
//       }
//     });
//   }

//   sendEvent();

//   req.on('close', () => {
//     sendEvent();
//   });
// }));

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
