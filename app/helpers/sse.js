const sseConfig = {
  'Content-Type': 'text/event-stream',  // <- Important headers
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Transfer-Encoding': true,
};

function channelHandler() {
  const clients = {};
  const users = {};
  let idx = 0;

  function addClient(channel, client) {
    const id = idx++;

    if (clients[channel]) {
      clients[channel][id] = client;
    } else {
      clients[channel] = { [id]: client };
    }

    statsUsers();

    return () => {
      statsUsers();
      removeClient(channel, id);
    }
  }

  function addUser(customerId, userId, fingerprint, client) {
    const id = idx++;
    debugger

    if (!users[customerId]) {
      users[customerId] = {};
    }

    if (!users[customerId][userId]) {
      users[customerId][userId] = {};
    }

    if (!users[customerId][userId][fingerprint]) {
      users[customerId][userId][fingerprint] = {};
    }

    users[customerId][userId][fingerprint][id] = client;

    statsUsers();

    return () => {
      statsUsers();
      if (Object.keys(users[customerId][userId][fingerprint]).length > 1) {
        delete users[customerId][userId][fingerprint][id];
      } else {
        delete users[customerId][userId][fingerprint];
        if (!Object.keys(users[customerId][userId])) {
          delete users[customerId][userId];
        }
      }
    }
  }

  function statsUsers() {
    debugger;
    const payload = Object
      .keys(users)
      .map(customer => ({
        customerId: customer,
        users: Object
          .keys(users[customer])
          .map(user => ({
            userId: user,
            fingerprints: Object
              .keys(users[customer][user])
              .map(finger => ({
                fingerprintId: finger,
                clients: Object.keys(users[customer][user][finger])
              }))
          }))
      }));

    return emit('stats', { type: 'user_connection', payload });
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
    debugger;
    if (!clients[channel]) {

      console.log('no clients for this channel', channel);
      return;
    }

    const data = JSON.stringify(message);

    Object
      .keys(clients[channel])
      .forEach(id => {
        clients[channel][id].write(`data: ${data} \n\n`);
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
    addUser,
    emit,
  }
}

module.exports = {
  sse: channelHandler(),
  sseConfig,
};
