import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [cookies] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (!cookies.access_token) {
      // Redirect to login page if not authenticated
      navigate("/auth");
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://mern-recipe-backend-3.onrender.com/recipes", {
          headers: { authorization: cookies.access_token },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`https://mern-recipe-backend-3.onrender.com/recipes/savedRecipes/ids/${cookies.access_token}`);
        setSavedRecipes(response.data.savedRecipes || []); // Ensure savedRecipes is an array
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [cookies.access_token, navigate]);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("https://mern-recipe-backend-3.onrender.com/recipes", { recipeID }, {
        headers: { authorization: cookies.access_token },
      });
      setSavedRecipes(response.data.savedRecipes || []); // Ensure savedRecipes is an array
    } catch (error) {
      console.error(error);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id || ""); // Handle undefined id

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
