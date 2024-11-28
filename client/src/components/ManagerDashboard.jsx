import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:7001/api/users/manager", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message);
      } catch (err) {
        setMessage("Unauthorized access. Redirecting to login.");
        localStorage.removeItem("token");
        navigate("/login");
        console.log(err);
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <p>{message}</p>
    </div>
  );
};

export default ManagerDashboard;
