import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetuserId";
import { useCookies } from "react-cookie";

export const Home = () => {
  const navigate = useNavigate();
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
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
      if (userID) { // Make sure userID is not null or undefined
        try {
          const response = await axios.get(`https://mern-recipe-backend-3.onrender.com/recipes/savedRecipes/ids/${userID}`);
          setSavedRecipes(response.data.savedRecipes);
        } catch (error) {
          console.error(error);
        }
      }
    };

    // Redirect to auth page if not logged in
    if (!cookies.access_token || !userID) {
      navigate("/auth"); // Redirect to authentication page
      return;
    }

    fetchRecipes();
    if (cookies.access_token) fetchSavedRecipes();
  }, [userID, cookies.access_token, navigate]); // Include cookies.access_token and navigate in the dependency array

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("https://mern-recipe-backend-3.onrender.com/recipes", { recipeID, userID }, {
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
