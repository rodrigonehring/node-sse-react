const sseConfig = {
  'Content-Type': 'text/event-stream',  // <- Important headers
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Transfer-Encoding': true,
};

function mountWhere(prefix, params = {}) {
  if (!prefix) {
    throw new Error('Must insert prefix to mount where');
  }

  const where = Object.keys(params)
    .map(param => `[${param}]:${params[param]}`)
    .join(':');

  return where ? `${prefix}-${where}` : prefix;
}

class SSE {
  constructor() {
    this.currentIndex = 0;
    this.clients = {}; // <- Keep a map of attached clients
  }

  // pattern: arrayOf ids
  route({ params, prefix }, cb) {
    return (req, res) => {
      req.socket.setTimeout(Number.MAX_VALUE);
      res.writeHead(200, sseConfig);
      res.write('\n');

      const paramsObj = params && params.reduce((acc, curr) => {
        acc[curr] = req.params[curr];

        return acc;
      }, {});

      const where = mountWhere(prefix, paramsObj);

      const id = this.currentIndex++;

      if (this.clients[where]) {
        this.clients[where][id] = res;
      } else {
        this.clients[where] = { [id]: res };
      }

      req.on('close', () => { delete this.clients[where][id] });

      cb && cb(req, res);
    }
  }

  // config: { data: {}, params: {} }
  emitTo({ prefix, params, data, event }) {
    const where = mountWhere(prefix, params);

    if (!this.clients[where]) {
      return console.log('No clients for: ', where);
    }

    const str = `data: ${JSON.stringify({ type: event, payload: data })} \n\n`;

    Object
      .keys(this.clients[where])
      .forEach(id =>
        this.clients[where][id].write(str)
      );
  }

  clientsConnected({ prefix, params }) {
    const where = mountWhere(prefix, params);

    return this.clients[where] ? Object.keys(this.clients[where]).length : 0;
  }
}

module.exports = SSE;
