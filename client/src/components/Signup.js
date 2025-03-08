import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate=useNavigate()
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", signupData);
    try {
      // Use the full URL for debugging
      const { data } = await axios.post("http://localhost:5000/api/user/register", signupData);
      console.log("Response from server:", data);
      alert("User registered successfully. Redirecting to login");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Error registering user. Please try again.");
    }
  };
  
  return (
    <Card
      className="p-4 text-center mx-auto my-5"
      style={{
        maxWidth: "500px",
        background:
          "linear-gradient(135deg,rgb(0, 0, 0),rgba(143, 143, 148, 0.59))",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 className="mb-4" style={{ fontWeight: "bold", color: "#9f9f9f" }}>
        Signup
      </h3>
      <form className="d-flex flex-column" onSubmit={onSubmitHandler}>
        <label
          htmlFor="name"
          style={{
            textAlign: "left",
            fontWeight: "500",
            marginBottom: "5px",
            color: "#9f9f9f",
          }}
        >
          Name
        </label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          placeholder="Enter your name"
          required
          onChange={handleChange}
          className="form-control mb-3"
          style={{
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
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
          value="Signup"
          className="mt-4 p-2"
          style={{
            borderRadius: "5px",
            fontWeight: "bold",
            color: "#9f9f9f",
            background: "black",
          }}
        />
      </form>
    </Card>
  );
};

export default Signup;
