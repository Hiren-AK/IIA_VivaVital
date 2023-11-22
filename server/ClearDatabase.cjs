const fs = require('fs');
const mysql = require('mysql2/promise'); // Use 'mysql2' for async/await support

// Configuration for the MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Devrocks9.',
  database: 'VivaVital',
};

// Function to delete the Initialized.flag file
const deleteFlagFile = () => {
  try {
    fs.unlinkSync('./initialized.flag');
    console.log('Initialized.flag deleted successfully.');
  } catch (err) {
    console.error('Error deleting Initialized.flag:', err.message);
  }
};

// Function to execute SQL commands to drop tables
const dropTables = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Drop individual tables
    await connection.query('DROP TABLE IF EXISTS Demographics, Dietary_Information, Dietary_Preferences, Health_Metrics, Nutritional_Information, Users, Wearable_Data, VeganRecipes, PescetarianRecipes, LactoVegetarianRecipes , NonVegetarianRecipes, Recipes ;');
    console.log('Tables dropped successfully.');

    // Close the database connection
    await connection.end();
  } catch (err) {
    console.error('Error dropping tables:', err.message);
  }
};

// Main function to delete the flag file and drop tables
const main = async () => {
  // Delete the flag file
  deleteFlagFile();

  // Drop the tables
  await dropTables();
};

// Run the main function
main();
