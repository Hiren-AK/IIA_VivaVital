async function runScripts() {
    try {
      // Import and run setEnv.mjs
      await import('./setEnv.mjs');
      console.log('setEnv.mjs executed');
  
      // Import and run ETL.mjs
      await import('./ETL.mjs');
      console.log('ETL.mjs executed');
  
      // Import and run index.js
      await import('./index.js');
      console.log('index.js executed');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  runScripts();
  