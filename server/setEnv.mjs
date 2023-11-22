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
VV_HOST=localhost
VV_USER=root
VV_PASSWORD=chesahil23
VV_NAME=VivaVital
\n`;

fs.writeFileSync('final.env', envConfig);
console.log('Environment variables set:', envConfig);
