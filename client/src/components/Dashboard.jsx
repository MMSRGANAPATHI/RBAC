import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Please log in");

      try {
        const res = await axios.get("http://localhost:7001/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(res.data.role);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || "Unauthorized");
      }
    };

    fetchRole();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {message && <p>{message}</p>}
      {role === "admin" && <p>Welcome, Admin! You have full access.</p>}
      {role === "manager" && <p>Welcome, Manager! You have limited access.</p>}
      {role === "user" && <p>Welcome, User! You can view your profile.</p>}
    </div>
  );
};

export default Dashboard;
