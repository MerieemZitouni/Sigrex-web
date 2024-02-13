import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Axios from "axios";
import { Button } from "@mui/material";

const NavBar = () => {
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
  const [isDeconnectModalOpen, setIsDeconnectModalOpen] = useState(false);
  const openDeconnectModal = () => {
    setIsDeconnectModalOpen(true);
  };

  // Function to close the modal
  const closeDeconnectModal = () => {
    setIsDeconnectModalOpen(false);
  };
  const [anchorElUser, setAnchorElUser] = useState(false);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(true);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(false);
  };
  const Logout = () => {
    Axios.post("http://localhost:5000/logout");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("activeItem");
    localStorage.removeItem("userId");
    window.location.reload();
    navigate("/");
  };

  return (
    <>
      <nav className=" items-center justify-between p-3 bg-[#00457E] text-white text-sm uppercase h-fit">
        <div className="flex flex-row items-center gap-8">
          <Link to={"/"}>
            <h1 className=" font-semibold text-lg ">SIGREX </h1>
          </Link>
          <div className="flex flex-row gap-1 absolute right-2 ">
            <div className="rounded-md flex flex-row justify-center items-center">
              <div>
                {isLoggedIn ? (
                  <>
                    <div className="shadow-md hover:shadow-xl shadow-gray-600 rounded-full">
                      <IconButton
                        onClick={handleOpenUserMenu}
                        sx={{ p: 1 / 4 }}
                      >
                        <Avatar
                          alt={username.toUpperCase()}
                          src="../assets/image2.jpg"
                        />
                      </IconButton>
                      <Menu
                        sx={{ mt: "42px" }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        <MenuItem onClick={handleCloseUserMenu}>
                          <Typography
                            style={{ fontSize: "14px" }}
                            textAlign="center"
                          >
                            Profile
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            Logout();
                          }}
                        >
                          <Typography
                            style={{ fontSize: "14px" }}
                            textAlign="center"
                          >
                            Se déconnecter
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className="text-white  bg-[#00457E] hover:bg-[#013E70] border uppercase border-white px-4 py-2 rounded shadow  outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Se connecter
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/*  <div className="flex flex-row gap-2 absolute right-2 top-4">
            <button
              className=" rounded-full hover:shadow-md hover:bg-white hover:bg-opacity-25"
              title="A propos"
              onClick={() => {
                navigate("/apropos");
              }}
            >
              <svg
                width={21}
                height={20}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 6.667a.208.208 0 10.002.416.208.208 0 00-.003-.416"
                  stroke="#fff"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  clipRule="evenodd"
                  d="M10.5 17.5v0A7.5 7.5 0 013 10v0a7.5 7.5 0 017.5-7.5v0A7.5 7.5 0 0118 10v0a7.5 7.5 0 01-7.5 7.5z"
                  stroke="#fff"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 10v4.167"
                  stroke="#fff"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className=" rounded-full hover:shadow-md hover:bg-white hover:bg-opacity-25"
              title="Aide"
              onClick={() => {
                navigate("/aide");
              }}
            >
              <svg
                width={21}
                height={20}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.333 17.453a6.774 6.774 0 01-.833.051 7.503 7.503 0 117.503-7.503c0 .279-.018.557-.052.834M17.17 14.168l-2.085 2.084-1.25-1.25"
                  stroke="#fff"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.57 8.07a1.818 1.818 0 011.846-1.405 1.78 1.78 0 011.876 1.667c0 1.254-1.792 1.668-1.792 2.501M10.604 13.126a.104.104 0 11-.208 0 .104.104 0 01.208 0"
                  stroke="#fff"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {userType === "admin" && (
              <button
                className=" rounded-full hover:shadow-md hover:bg-white hover:bg-opacity-25"
                title="Notifications"
                onClick={() => {
                  navigate("/notifications");
                }}
              >
                {unreadCount !== 0 && (
                  <span class="absolute ml-3 bg-red-500 text-white rounded-full w-4 h-4 text-[11px]  flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
                <svg
                  width={21}
                  height={20}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.936 16.67a1.654 1.654 0 01-2.873 0"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    clipRule="evenodd"
                    d="M5.915 7.5v-.417A4.584 4.584 0 0110.5 2.498v0a4.584 4.584 0 014.584 4.585V7.5c0 2.165.702 4.27 2.001 6.003v0a.417.417 0 01-.333.667H4.248a.417.417 0 01-.334-.667v0c1.3-1.732 2.001-3.838 2.001-6.003h0z"
                    stroke="#fff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div> */}
        </div>
      </nav>
      <hr></hr>
      {isDeconnectModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50  overflow-x-auto overflow-y-auto ">
          <div className="w-5/6 max-w-2xl pl-8 pr-4 mt-48 mx-auto my-auto pt-2 pb-4 bg-white rounded-lg shadow-lg text-md">
            <div className="flex flex-row  justify-end">
              <button
                className="bg-transparent border-0 float-right"
                onClick={closeDeconnectModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  {/* SVG Close icon */}
                </svg>
              </button>
            </div>
            <div className="relative p-4 flex-auto text-md ">
              Vous êtes sur que vous voulez se déconnecter ?
            </div>
            <div className="flex items-center justify-end p-6 text-sm  rounded-b">
              <button
                className="text-[#000000] bg-gray-200 px-4 py-2 outline-none focus:outline-none rounded mr-1 mb-1 hover:bg-gray-300 hover:shadow-lg "
                type="button"
                onClick={closeDeconnectModal}
              >
                Annuler
              </button>
              <button
                id="send-message"
                className="text-white  bg-[#00457E] hover:bg-[#013E70] px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={Logout}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
