const net = require('net');

const port = 3306;
const host = process.env.DB_HOST || 'localhost';
const retryInterval = 1000;

function waitForMySQL() {
  const socket = net.connect(port, host, () => {
    console.log('✅ MySQL ist erreichbar – fahre mit App fort');
    socket.end();
    require('./index'); // Starte Express-App
  });

  socket.on('error', () => {
    console.log(`❌ Warte auf MySQL (${host}:${port})...`);
    setTimeout(waitForMySQL, retryInterval);
  });
}

waitForMySQL();