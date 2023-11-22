import React, { useState } from 'react';
import axios from 'axios';

const RecipeSearch = () => {
  const [searchParams, setSearchParams] = useState({
    dietaryPreference: '',
    minCarbs: '',
    maxCarbs: '',
    minProtein: '',
    maxProtein: '',
    minFat: '',
    maxFat: '',
    minEnergy: '',
    maxEnergy: ''
  });
  const [recipes, setRecipes] = useState([]);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8001/recipes', { params: searchParams });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Dietary Preference:
            <select name="dietaryPreference" value={searchParams.dietaryPreference} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Vegan">Vegan</option>
              <option value="Pescetarian">Pescetarian</option>
              <option value="LactoVegetarian">Lacto-Vegetarian</option>
              <option value="NonVegetarian">Non-Vegetarian</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Min Carbs:
            <input type="number" name="minCarbs" value={searchParams.minCarbs} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Max Carbs:
            <input type="number" name="maxCarbs" value={searchParams.maxCarbs} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Min Protein:
            <input type="number" name="minProtein" value={searchParams.minProtein} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Max Protein:
            <input type="number" name="maxProtein" value={searchParams.maxProtein} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Min Fat:
            <input type="number" name="minFat" value={searchParams.minFat} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Max Fat:
            <input type="number" name="maxFat" value={searchParams.maxFat} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Min Energy (kcal):
            <input type="number" name="minEnergy" value={searchParams.minEnergy} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Max Energy (kcal):
            <input type="number" name="maxEnergy" value={searchParams.maxEnergy} onChange={handleChange} />
          </label>
        </div>

        <button type="submit">Search</button>
      </form>

      <div>
        <h2>Recipes</h2>
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <div key={recipe.RecipeID}>
              <h3>{recipe.RecipeTitle}</h3>
              <p>Carbs: {recipe.Carbohydrates} g</p>
              <p>Protein: {recipe.Protein} g</p>
              <p>Fat: {recipe.Fats} g</p>
              <p>Energy: {recipe.Energy} kcal</p>
              <p>URL: <a href={recipe.URL} target="_blank" rel="noopener noreferrer">{recipe.URL}</a></p>
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;
