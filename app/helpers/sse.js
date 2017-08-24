const sseConfig = {
  'Content-Type': 'text/event-stream',  // <- Important headers
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Transfer-Encoding': true,
};

const sse = channelHandler();

app.get('/sse/accounts/:userId', (req, res) => {
  req.socket.setTimeout(Number.MAX_VALUE);
  res.writeHead(200, sseConfig);
  res.write('\n');

  const removeClient = sse.addClient(`accounts-${req.params.userId}`);

  req.on('close', removeClient);
});

app.get('/online/:userId', (req, res) => {
  const users = sse.countClients(`accounts-${req.params.userId}`);
  res.send({ users });
});

function channelHandler() {
  const clients = {};
  let idx = 0;

  function addClient(channel, client) {
    const id = idx++;

    if (clients[channel]) {
      clients[channel][id] = client;
    } else {
      clients[channel] = { [id]: client };
    }

    return () => removeClient(channel, id);
  }

  function removeClient(channel, id) {
    if (!clients[channel]) {
      return;
    }

    if (Object.keys(clients[channel]) > 1) {
      delete clients[channel][id];
    } else {
      delete clients[channel];
    }
  }

  function emit(channel, message) {
    if (!clients[channel]) {
      console.log('no clients for this channel', channel);
      return;
    }

    const data = JSON.stringify(message);

    Object
      .keys(clients[channel])
      .forEach(id => {
        clients[channel][id].write(`data: ${data}`);
      })
  }

  function countClients(channel) {
    if (!clients[channel]) {
      console.log('no clients for this channel', channel);
      return;
    }

    return Object.keys(clients[channel]).length;
  }

  return {
    countClients,
    addClient,
    emit,
  }
}


module.exports = channelHandler;
