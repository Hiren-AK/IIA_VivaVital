import fs from 'fs';
import os from 'os';

const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
};

const ip = getIPAddress();
const envConfig = `REACT_APP_API_URL=http://${ip}:8001
PORT=8001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=p@sswOrd123
DB_NAME=VivaVital
\n`;

fs.writeFileSync('.env', envConfig);
console.log('Environment variables set:', envConfig);
