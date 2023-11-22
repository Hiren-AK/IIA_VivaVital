// importData.js
import csvParser from 'csv-parser';
import fs from 'fs';
import db from './db.js'; // Import db from db.js

const createTables = async () => {
  try {
    const createRecipesTable = `
      CREATE TABLE IF NOT EXISTS Recipes (
        RecipeID INT AUTO_INCREMENT PRIMARY KEY,
        RecipeTitle VARCHAR(255),
        URL VARCHAR(255),
        Carbohydrates DECIMAL(10,4),
        Energy DECIMAL(10,4),
        Protein DECIMAL(10,4),
        Fats DECIMAL(10,4))`;

    const createVeganRecipesTable = `
      CREATE TABLE IF NOT EXISTS VeganRecipes (
        RecipeID INT PRIMARY KEY,
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID)
      )`;

    const createPescetarianRecipesTable = `
      CREATE TABLE IF NOT EXISTS PescetarianRecipes (
        RecipeID INT PRIMARY KEY,
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID)
      )`;

    const createLactoVegetarianRecipesTable = `
      CREATE TABLE IF NOT EXISTS LactoVegetarianRecipes (
        RecipeID INT PRIMARY KEY,
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID)
      )`;

    const createNonVegetarianRecipesTable = `
      CREATE TABLE IF NOT EXISTS NonVegetarianRecipes (
        RecipeID INT PRIMARY KEY,
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID)
      )`;

    await db.promise().execute(createRecipesTable);
    await db.promise().execute(createVeganRecipesTable);
    await db.promise().execute(createPescetarianRecipesTable);
    await db.promise().execute(createLactoVegetarianRecipesTable);
    await db.promise().execute(createNonVegetarianRecipesTable);
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

const importData = async () => {
    await createTables();
  
    fs.createReadStream('/home/dev/Desktop/IIA_N/IIA_VivaVital/server/data/recipe_IIA.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        const {
            Recipe_title,url,Carbohydrates,Energy,Protein,Fats,vegan,pescetarian,lacto_vegetarian,non_vegetarian} = row;
        
        const recipeQuery = 'INSERT INTO Recipes (RecipeTitle, URL, Carbohydrates, Energy, Protein, Fats) VALUES (?, ?, ?, ?, ?, ?)';
        const [recipeResult] = await db.promise().query(recipeQuery, [Recipe_title,url,Carbohydrates,Energy,Protein,Fats]);
        const recipeID = recipeResult.insertId;
  
        if (vegan == 1) { // Check for numeric value instead of string
          await db.promise().query('INSERT INTO VeganRecipes (RecipeID) VALUES (?)', [recipeID]);
        }
        
        if (pescetarian == 1) {
          await db.promise().query('INSERT INTO PescetarianRecipes (RecipeID) VALUES (?)', [recipeID]);
        }
  
        if (lacto_vegetarian == 1) {
          await db.promise().query('INSERT INTO LactoVegetarianRecipes (RecipeID) VALUES (?)', [recipeID]);
        }
  
        if (non_vegetarian == 1) {
          await db.promise().query('INSERT INTO NonVegetarianRecipes (RecipeID) VALUES (?)', [recipeID]);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed and data imported');
      });
  };
  
  export default importData;
  