import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Axios from "axios";
const LoginPage = () => {
  let push = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };
  const handlePsswrdChange = (event) => {
    setPassword(event.target.value);
  };

  /** Login process */
  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:5000/login", {
      username: userName,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
        console.log(response.data.message);
      } else {
        setLoginStatus("");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", response.data[0].nom); // Store the username in localStorage
        localStorage.setItem("role", response.data[0].userRole); // store the role to use it to display components
        localStorage.setItem("userId", response.data[0].userId);
        push("/");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 h-screen w-full bg-[#00457E]">
      <div className="flex flex-col justify-center ">
        <form
          className="max-w-[450px] w-full mx-auto rounded-lg bg-[#FFFFFF] shadow-md p-8 px-8 "
          onSubmit={handleSubmit}
        >
          <div className=" flex justify-center">
            <h2 className="mb-2 font-bold text-[#000000] text-3xl bg-clip-text  text-left mt-8">
              Bienvenue !
            </h2>
          </div>
          <div className="flex justify-center text-md text-red-700">
            <p> {loginStatus} </p>
          </div>

          <div className="flex flex-col text-gray-400 py-2">
            <label className="flex flex-col font-medium text-black py-2">
              Nom d'utilisateur
            </label>
            <input
              className="rounded-lg bg-[#FAFAFA] mt-2 p-2 focus:outline-none text-black "
              type="text"
              placeholder="Exemple : ahmed_08 ...."
              required
              onChange={handleUserNameChange}
            />
          </div>
          <div className="flex flex-col text-gray-400 py-4">
            <label className="flex flex-col font-medium text-black py-2">
              Mot de passe
            </label>
            <input
              className="p-2 rounded-lg bg-[#FAFAFA] mt-2 focus:outline-none text-black"
              type="password"
              placeholder="*****************"
              required
              onChange={handlePsswrdChange}
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 bg-[#00457E]  hover:shadow-blue-500/40 text-white font-semibold rounded-lg"
          >
            Se connecter
          </button>

          <div className="flex justify-center text-[#4285F4] py-2 mt-5 underline">
            <a href="/ResetPassword">
              {" "}
              <p className="">Mot de passe oublié ?</p>{" "}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
