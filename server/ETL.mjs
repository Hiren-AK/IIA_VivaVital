import { exec } from 'child_process';

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

async function main() {
  try {
    await execPromise('python3 etl_script.py');
    console.log('ETL script execution completed.');
    // You can place further code here that should execute after the ETL script.
  } catch (error) {
    console.error('An error occurred in the ETL script execution:', error);
  }
}

main();
