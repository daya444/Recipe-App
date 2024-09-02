// SavedRecipes.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetuserId";

 export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (userID) {
        try {
          const response = await axios.get(
            `https://mern-recipe-backend-3.onrender.com/recipes/savedRecipes/${userID}`
          );
          setSavedRecipes(response.data.savedRecipes);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`https://mern-recipe-backend-3.onrender.com/recipes/${recipeId}`);
      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Saved Recipes</h1>
      <ul>
        {savedRecipes.length > 0 ? (
          savedRecipes.map((recipe) => (
            <li key={recipe._id}>
              <div>
                <h2>{recipe.name}</h2>
                <button onClick={() => handleDeleteRecipe(recipe._id)}>
                  Delete
                </button>
              </div>
              <p>{recipe.description}</p>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p>No saved recipes found.</p>
        )}
      </ul>
    </div>
  );
};


