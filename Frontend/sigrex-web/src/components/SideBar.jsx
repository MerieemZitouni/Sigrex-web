import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState(localStorage.getItem("role"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const authenticated = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(authenticated);
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "");
    const role = localStorage.getItem("role");
    setUserType(role);
  }, []);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [activeItem, setActiveItem] = useState(
    localStorage.getItem("activeItem") || ""
  );
  useEffect(() => {
    setActiveItem(localStorage.getItem("activeItem") || "");
  }, []);
  const handleClick = (item) => {
    setActiveItem(item);
    localStorage.setItem("activeItem", item);
  };

  useEffect(() => {
    // Determine the active item based on the current pathname
    const pathname = location.pathname;
    let activeItem = "Formations";
    if (pathname === "/locaux") {
      activeItem = "Locaux";
    } else if (pathname === "/formations") {
      activeItem = "Formations";
    } else if (pathname === "/statistiques") {
      activeItem = "Statistiques";
    } else if (pathname === "/formateurs") {
      activeItem = "Formateurs";
    } else if (pathname === "/evenements") {
      activeItem = "Evènements";
    } else if (pathname === "/partenaires") {
      activeItem = "Partenaires";
    } else if (pathname === "/domaines") {
      activeItem = "Domaines";
    } else if (pathname === "/themes") {
      activeItem = "Thèmes";
    } else if (pathname === "/attestations") {
      activeItem = "Attestations";
    }

    setActiveItem(activeItem);
    localStorage.setItem("activeItem", activeItem);
  }, [location.pathname]);

  return (
    <>
      <div className=" min-h-screen bg-[#00457E] w-fit">
        <div class="sidebar pt-5 text-white flex flex-col items-start gap-[16px] text-center w-fit border-r-5  border-black h-full ">
        <Link to="/formations">
            <div className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${activeItem === "Formations" ? "bg-white bg-opacity-25 " : ""}`}>
              <div className="flex flex-row gap-4 items-center ml-3">
              <svg
                  width={25}
                  height={24}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.738 14.798a1.75 1.75 0 11-2.476 2.476 1.75 1.75 0 012.476-2.476M18.24 10.296a1.75 1.75 0 11-2.476 2.476 1.75 1.75 0 012.476-2.476"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.504 13V5.247a2.25 2.25 0 00-2.251-2.25H5.747a2.25 2.25 0 00-2.25 2.25V13M17.502 16a4.914 4.914 0 013.001 1"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.749 11.749a1.75 1.75 0 11-3.501 0 1.75 1.75 0 013.501 0M4.497 17.002a4.832 4.832 0 012.95-.984M15.501 21.002a5.002 5.002 0 00-6.002 0"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Formations</p>
              </div>
            </div>
          </Link>
          {/* Submenus for Formations */}
          {activeItem === "Formations" && (
            <ul className="ml-6">
              <Link to="/formation-avant-promotion">
                <li className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[14px] py-2 mx-2 rounded-[4px] items-center  text-left pl-1  ${activeItem === "Formation avant promotion" ? "bg-white bg-opacity-25 " : ""}`}>
                  Formation avant promotion
                </li>
              </Link>
              <Link to="/formation-a-la-carte">
                <li className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[14px] py-2 mx-2 rounded-[4px] items-center text-left  pl-1 ${activeItem === "Formation a la carte" ? "bg-white bg-opacity-25 " : ""}`}>
                  Formation à la carte
                </li>
              </Link>
              
              <Link to="/conventions">
                <li className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[14px] py-2 mx-2 rounded-[4px] items-center text-left pl-1  ${activeItem === "Conventions" ? "bg-white bg-opacity-25 " : ""}`}>
                  Conventions
                </li>
              </Link>
              <Link to="/calendrier">
                <li className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[14px] py-2 mx-2 rounded-[4px] items-center  text-left pl-1 ${activeItem === "Calendrier" ? "bg-white bg-opacity-25 " : ""}`}>
                  Calendrier
                </li>
              </Link>
              <Link to="/demande-devis-formation">
                <li className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[14px] py-2 mx-2 rounded-[4px] items-center text-left  pl-1 ${activeItem === "Demande devis formation" ? "bg-white bg-opacity-25 " : ""}`}>
                  Demande devis formation
                </li>
              </Link>
              <Link to="/Themes">
                <li className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[14px] py-2 mx-2 rounded-[4px] items-center text-left  pl-1 ${activeItem === "Thèmes" ? "bg-white bg-opacity-25 " : ""}`}>
                  Thèmes
                </li>
              </Link>
            </ul>
          )}
          <Link to="/formateurs">
            <button
              onClick={() => handleClick("Formateurs")}
              className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${
                activeItem === "Formateurs" ? "bg-white bg-opacity-25 " : ""
              }`}
            >
              <div class="flex flex-row gap-4 items-center ml-3  ">
                <svg
                  width={25}
                  height={24}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12.5v-1.746a1.247 1.247 0 011.32-1.252c2.173.07 4.295.672 6.18 1.755a13.248 13.248 0 016.179-1.755 1.247 1.247 0 011.32 1.252V12.5M5 16.5v1.715c.004.537.428.976.964.998 2.302-.02 4.564.599 6.536 1.787a12.453 12.453 0 016.536-1.787c.536-.022.96-.461.964-.998V16.5M12.5 11.256v9.743"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx={12.5}
                    cy={4.75}
                    r={2.75}
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    clipRule="evenodd"
                    d="M4.5 12.5h1a2 2 0 012 2v0a2 2 0 01-2 2h-1a1 1 0 01-1-1v-2a1 1 0 011-1zM20.5 16.5h-1a2 2 0 01-2-2v0a2 2 0 012-2h1a1 1 0 011 1v2a1 1 0 01-1 1z"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Formateurs</p>
              </div>
            </button>
          </Link>
          <Link to="/evenements">
            <button
              onClick={() => handleClick("Evènements")}
              className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${
                activeItem === "Evènements" ? "bg-white bg-opacity-25 " : ""
              }`}
            >
              {" "}
              <div class="flex flex-row gap-4 items-center ml-3  ">
                <svg
                  width={25}
                  height={24}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M10.5 12h-5a2 2 0 01-2-2V5a2 2 0 012-2h5a2 2 0 012 2v5a2 2 0 01-2 2zM19 20h-3a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 0116 14h3a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0119 20zM20 11h-3a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 0117 5h3a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0120 11zM10 21H7a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 017 15h3a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0110 21z"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Evènements</p>
              </div>
            </button>
          </Link>
          {userType === "Administrateur" && (
            <Link to="/partenaires">
              <button
                onClick={() => handleClick("Partenaires")}
                className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${
                  activeItem === "Partenaires" ? "bg-white bg-opacity-25 " : ""
                }`}
              >
                {" "}
                <div class="flex flex-row gap-4 items-center ml-3  ">
                  <svg
                    width={25}
                    height={24}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.293 9.524a2.023 2.023 0 11-2.861 2.861 2.023 2.023 0 012.86-2.86M14.703 5.912a3.115 3.115 0 11-4.406 4.406 3.115 3.115 0 014.406-4.406M6.568 9.524a2.023 2.023 0 11-2.86 2.861 2.023 2.023 0 012.86-2.86M23.5 19v-1.096a2.5 2.5 0 00-2.5-2.5h-.801M1.5 19v-1.096a2.5 2.5 0 012.5-2.5h.801M17.839 19v-1.602a3.5 3.5 0 00-3.5-3.5h-3.68a3.5 3.5 0 00-3.5 3.5V19"
                      stroke="#fff"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>Partenaires</p>
                </div>
              </button>
            </Link>
          )}
          <Link to="/domaines">
            <button
              onClick={() => handleClick("Domaines")}
              className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${
                activeItem === "Domaines" ? "bg-white bg-opacity-25 " : ""
              }`}
            >
              {" "}
              <div class="flex flex-row gap-4 items-center ml-3  ">
                <svg
                  width={25}
                  height={24}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.883 8h1.061c.86 0 1.556.696 1.556 1.556v9.889c0 .859-.696 1.555-1.556 1.555H9.056c-.86 0-1.556-.696-1.556-1.556V18"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    clipRule="evenodd"
                    d="M4.501 18h11.312c.67 0 1.293-.334 1.664-.891l.734-1.102a4 4 0 00.672-2.219V6a2 2 0 00-2-2h-10a2 2 0 00-2 2v7.056c0 .621-.145 1.233-.422 1.789l-.854 1.708A1 1 0 004.501 18z"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.88 3v2M14.88 3v2M8.69 9h6M8.69 13h6"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Domaines</p>
              </div>
            </button>
          </Link>
          
          <Link to="/locaux">
            <button
              onClick={() => handleClick("Locaux")}
              className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${
                activeItem === "Locaux" ? "bg-white bg-opacity-25 " : ""
              }`}
            >
              <div class="flex flex-row gap-4 items-center ml-3  ">
                <svg
                  width={25}
                  height={24}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.497 10.998v10.004"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    clipRule="evenodd"
                    d="M10.5 2.996H14.5a2 2 0 012 2V11H8.5V4.997a2 2 0 012-2zM8.498 14h8.004a1 1 0 011 1v.5a1.5 1.5 0 01-1.5 1.501H8.999a1.5 1.5 0 01-1.501-1.5V15a1 1 0 011-1.001z"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 17.002v4.002M15.501 21.002H9.5M22.504 10.998H2.496M20.503 21.002V10.998"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Locaux</p>
              </div>
            </button>
          </Link>
          {isLoggedIn && (
            <Link to="/attestations">
              <button
                onClick={() => handleClick("Attestations")}
                className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${
                  activeItem === "Attestations" ? "bg-white bg-opacity-25 " : ""
                }`}
              >
                {" "}
                <div class="flex flex-row gap-4 items-center ml-3  ">
                  <svg
                    width={25}
                    height={24}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 22v-1M6.19 20.31l.62-.62M20 14h1M4 14h1M18.19 19.69l.62.62M15.447 11.055a4.167 4.167 0 11-5.894 5.893 4.167 4.167 0 015.893-5.893M16.93 6H8.07"
                      stroke="#fff"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.176 12.078L19.992 7.8c.327-.366.508-.84.508-1.331V4c0-1.1-.9-2-2-2h-12a2 2 0 00-2 2v2.469c0 .491.181.965.508 1.331l3.816 4.278M5.07 2.63l6.51 7.31M19.93 2.63l-6.51 7.31"
                      stroke="#fff"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>Attestations</p>
                </div>
              </button>
            </Link>
          )}
          {userType === "Administrateur" && (
            <Link to="/statistiques">
              <button
                onClick={() => handleClick("Utilisateurs")}
                className={`hover:bg-white hover:bg-opacity-25 hover:shadow-md w-[180px] text-[17px] py-2 mx-2 rounded-[4px] items-center   ${
                  activeItem === "Statistiques" ? "bg-white bg-opacity-25 " : ""
                }`}
              >
                {" "}
                <div class="flex flex-row gap-4 items-center ml-3  ">
                  <svg
                    width={25}
                    height={24}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M20.503 16.001H4.497a1 1 0 01-1-1V4.997a1 1 0 011-1h16.006a1 1 0 011 1V15a1 1 0 01-1 1z"
                      stroke="#fff"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5 16.002v5.002M12.5 7.998V12M8.498 8.998v3.001M16.502 9.998v2M9.499 21.004H15.5M12.5 3.903v-.907"
                      stroke="#fff"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>Statistiques</p>
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;
