import { useState, useEffect } from "react";
import axios from "axios";
import {useGetUserID} from "../hooks/useGetuserId"
import { useCookies } from "react-cookie";

export const Home = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes", {
          headers: { authorization: cookies.access_token },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSavedRecipes = async () => {
      if (userID) { // Make sure userID is not null or undefined
        try {
          const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`,);
          setSavedRecipes(response.data.savedRecipes);
          console.log("check check ", response);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchRecipes();
    if (cookies.access_token) fetchSavedRecipes();
  }, [userID]); // Include userID in the dependency array

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", { recipeID, userID }, {
            headers: { authorization: cookies.access_token },
          });
      setSavedRecipes(response.data.savedRecipes);
    } catch (error) {
      console.error(error);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
