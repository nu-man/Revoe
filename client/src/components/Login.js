import React, { useState,useEffect  } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/user/login", loginData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
      console.log(error);
    }
  };

  return (
    <Card
      className="p-4 text-center mx-auto my-5"
      style={{
        maxWidth: "500px",
        background:
          "linear-gradient(135deg, rgb(0, 0, 0), rgba(143, 143, 148, 0.59))",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 className="mb-4" style={{ fontWeight: "bold", color: "#9f9f9f" }}>
        Login
      </h3>
      <form className="d-flex flex-column" onSubmit={onSubmitHandler}>
        <label
          htmlFor="email"
          style={{
            textAlign: "left",
            fontWeight: "500",
            marginBottom: "5px",
            color: "#9f9f9f",
          }}
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          onChange={handleChange}
          className="form-control mb-3"
          style={{
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <label
          htmlFor="password"
          style={{
            textAlign: "left",
            fontWeight: "500",
            marginBottom: "5px",
            color: "#9f9f9f",
          }}
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          onChange={handleChange}
          className="form-control mb-3"
          style={{
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="submit"
          value="Login"
          className="mt-4 p-2"
          style={{
            borderRadius: "5px",
            fontWeight: "bold",
            color: "#9f9f9f",
            background: "black",
            border: "none",
          }}
        />
      </form>
      <p>
          New here?{" "}
          <Link to="/signup" className="link">
            Register
          </Link>
        </p>
    </Card>
  );
};

export default Login;
