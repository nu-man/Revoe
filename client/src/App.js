
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import PrivateRoutes from "./utils/PrivateRoutes.js";
import axios from "axios";


function App() {
  const [auth, setAuth] = useState(false);


  useEffect(() => {
    async function verifytoken() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.get("http://localhost:5000/api/user/auth", { headers: { "auth-token": token } });

          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    verifytoken();
  }, []);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoutes auth={auth} />}>
            <Route
              path="/dashboard"
              element={
                <Dashboard  />
              }
            />
          </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
