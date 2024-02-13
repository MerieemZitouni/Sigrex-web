import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Acceuil from "./pages/Acceuil";
import LoginPage from "./pages/LoginPage";
import Domaines from "./pages/Domaines";
import Evenements from "./pages/Evenements";
import Formateurs from "./pages/Formateurs";
import Locaux from "./pages/Locaux";
import Thèmes from "./pages/Thèmes";
import Statistiques from "./pages/Statistiques";
import Attestations from "./pages/Attestations";
import Partenaires from "./pages/Partenaires";
import AjouterPartenaire from "./pages/AddPartenaire/AjouterPartenaire";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    // Check if the user is authenticated in local storage
    const authenticated = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(authenticated);

    const role = localStorage.getItem("role");
    setUserType(role);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route path="/formations" element={<Acceuil />} />
          <Route path="/domaines" element={<Domaines />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/formateurs" element={<Formateurs />} />
          <Route path="/locaux" element={<Locaux />} />

          <Route path="/themes" element={<Thèmes />} />
          {isLoggedIn && <Route path="/attestations" element={<Attestations />} />}
          {isLoggedIn && userType === "Administrateur" && (
            <><Route path="/partenaires" element={<Partenaires />} /><Route path="/addPartenaire" element={<AjouterPartenaire />} />
            
            
            </>
          )}
          {isLoggedIn && userType === "Administrateur" && (
            <Route path="/statistiques" element={<Statistiques />} />
          )}
          {!isLoggedIn || (isLoggedIn && userType !== "Administrateur" && (
            <Route path="/statistiques" element={<LoginPage />} />
          ))}
          {!isLoggedIn && <Route path="/statistiques" element={<LoginPage />} />}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
