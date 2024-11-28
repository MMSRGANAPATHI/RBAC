import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1]; // Extract payload
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:7001/api/auth/login",
        data
      );
      const token = res.data.token;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Decode the token to get the user's role
      const decodedToken = decodeJWT(token);
      const userRole = decodedToken?.role;

      // Set role-specific messages and navigate
      switch (userRole) {
        case "admin":
          setMessage("Welcome, Admin!");
          navigate("/admin-dashboard");
          break;
        case "manager":
          setMessage("Welcome, Manager!");
          navigate("/manager-dashboard");
          break;
        case "user":
          setMessage("Welcome, User!");
          navigate("/user-dashboard");
          break;
        default:
          setMessage("Unknown role. Please contact support.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
