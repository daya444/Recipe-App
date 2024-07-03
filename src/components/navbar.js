import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", ""); // Clear the access token cookie
    window.localStorage.removeItem("userID"); // Remove user ID from local storage
    navigate("/auth"); // Navigate to the authentication page
  };

  return (
    <div className="navbar">
      <Link to="/">HOME</Link>
      <Link to="/create-recipe">CREATE RECIPE</Link>

      {!cookies.access_token ? (
        <Link to="/auth">LOGIN/REGISTER</Link>
      ) : (
        <>
          <Link to="/saved-recipes">SAVED RECIPES</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};
