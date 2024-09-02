import  {useState}from  "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useGetUserID} from "../hooks/useGetuserId"
import { useCookies } from "react-cookie";


export const CreateRecipe =  () => {

  const navigate = useNavigate();
  const [cookies, _] = useCookies(["access_token"]);
  
  const UserID = useGetUserID()
  const [recipe ,setRecipe] = useState({

    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: UserID,
  })

  const handleChange = (event) => {
    const {name , value} = event.target;

    setRecipe({...recipe,[name]: value})
  }


  const handleIngredient = (event,idx) => {
    const { value} = event.target;
    

    const ingredients = recipe.ingredients;
    ingredients[idx]= value


    setRecipe({...recipe,ingredients:ingredients})
  }




    const addIngredient = () => {
      setRecipe ({...recipe,ingredients:[...recipe.ingredients,""]})
    }
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        await axios.post(
          "https://mern-recipe-backend-3.onrender.com/recipes",
          { ...recipe }, {
            headers: { authorization: cookies.access_token },
          }
         
        )
  
        alert("Recipe Created");
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    };
    

  

  
    return (
      <div className="create-recipe ">
        <h2>Create Recipe</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input 
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}

          />

          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient,idx)=>(
            <input
            key={idx}
             type="text"
             id="ingredients"
             value={ingredient}
             name="ingredients"
             onChange={(event) =>handleIngredient(event,idx)}
             />
          ))}
          <button  type="button" onClick={addIngredient}>Add Ingredients</button>
          
          <label htmlFor="instruction">Instructions</label>
          <textarea 
          type="text" 
          id="instruction"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          ></textarea>

         
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
        />
        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
          />

          <button type="submit"> Create Recipe</button>

        </form>


      </div>


    )
  }