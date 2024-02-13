const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const e = require("connect-flash");
const { createPool } = require("mysql");
const session = require("express-session");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/** Database connection */
var db = createPool({
  host: "localhost",
  user: "root",
  password: "djXias715@",
  database: "sigrex_db",
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    key: "userId",
    resave: true,
    secret: "subscribe",
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
app.get("/api", (req, res) => {
  res.json({ users: [{ id: "userone" }, { id: "userTwo" }] });
});
// afficher les utilisateurs
app.get("/affich_users", (req, res) => {
  db.query("SELECT * FROM users;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
// afficher les formations

app.get("/formations", (req, res) => {
  db.query(
    "SELECT * FROM formations JOIN offres ON formations.offreId = offres.offreId JOIN theme ON formations.themeId = theme.themeId JOIN partenaires ON formations.partenaireId = partenaires.partenaireId;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// afficher les formateurs
app.get("/formateurs", (req, res) => {
  db.query(
    "SELECT * FROM formateurs JOIN users ON formateurs.userId = users.userId ;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// afficher les evènements
app.get("/evenements", (req, res) => {
  db.query("SELECT * FROM evenements", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
// afficher les partenaires
app.get("/partenaires", (req, res) => {
  db.query(
    "SELECT * ,  users.nom AS user_nom, organismes.nom AS organisme_nom FROM partenaires JOIN users ON partenaires.userId = users.userId JOIN organismes ON partenaires.organismeId = organismes.organismeId",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// afficher les domaines
app.get("/domaines", (req, res) => {
  db.query(
    "SELECT *  FROM domaine JOIN formations ON domaine.formationId = formations.formationId ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
        console.log("error merieemmmm");
        res.send({ err: err });
      } else {
        if (result.length > 0) {
          const user = result[0];
          if (user.password === password) {
            req.session.authenticated = true;
            req.session.user = user;
            req.session.userId = result[0].id;
            req.session.loggedIn = true;
            console.log(req.session.userId);
            res.send(result);
          } else {
            res.send({ message: "Mot de passe incorrecte" });
          }
        } else {
          res.send({ message: "Cet utilisateur n'existe pas" });
        }
      }
    }
  );
});

// Logout
app.post("/logout", (req, res) => {
  // Clear the session data to log out the user
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      res.status(500).json({ error: "An error occurred during logout." });
    } else {
      console.log("successful ! ");
    }
  });
});
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the React app
app.use(express.static(path.join(__dirname, "../client/build")));
// Serve PDF files
app.use(express.static(path.join(__dirname, "public")));
// Ajouter utilisateur

app.post("/addUser", (req, res) => {
  const { nom, prenom, username, email, password, userRole } = req.body;

  // Insert into Users table
  const userInsertQuery =
    "INSERT INTO Users (nom, prenom, username, email, password, userRole) VALUES (?, ?, ?, ?, ?, ?)";
  const userValues = [nom, prenom, username, email, password, userRole];

  db.query(userInsertQuery, userValues, (userErr, userResult) => {
    if (userErr) {
      console.error("Error inserting user:", userErr);
      res.status(500).send("Error inserting user");
    } else {
      const userId = userResult.insertId;

      // Insert into specific user table based on userRole
      const specificUserInsertQuery = getSpecificUserInsertQuery(userRole);
      const specificUserValues = getSpecificUserValues(
        userRole,
        userId,
        req.body
      );

      db.query(
        specificUserInsertQuery,
        specificUserValues,
        (specificUserErr) => {
          if (specificUserErr) {
            console.error("Error inserting specific user:", specificUserErr);
            res.status(500).send("Error inserting specific user");
          } else {
            res.status(200).send("User added successfully");
          }
        }
      );
    }
  });
});

// Helper function to get the specific user insert query based on userRole
function getSpecificUserInsertQuery(userRole) {
  switch (userRole) {
    case "Administrateur":
      return "INSERT INTO Administrateurs (userId) VALUES (LAST_INSERT_ID())";
    case "Partenaire":
      return "INSERT INTO Partenaires (userId,description) VALUES (LAST_INSERT_ID(),?)";
    case "Formateur":
      return `
            INSERT INTO Formateurs (
              civilite, 
              sexe, 
              adresse, 
              photo_path, 
              diplome, 
              employeur, 
              fonction, 
              numero_compte, 
              statut, 
              cv_path, 
              notes, 
              salaire_brut, 
              salaire_net, 
              specialite, 
              userId
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, LAST_INSERT_ID()
            );
            `;
    case "Apprenant":
      return `
                INSERT INTO Apprenants ( userId,
                    formationId, organismeId, photo_path, date_naissance, sexe,
                    telephone, adresse, notes
                ) VALUES ( LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    default:
      throw new Error("Invalid userRole");
  }
}

// Helper function to get specific user values based on userRole
function getSpecificUserValues(userRole, userId, userData) {
  switch (userRole) {
    case "Administrateur":
      return [];
    case "Partenaire":
      return [userData.description];
    case "Formateur":
      return [
        userData.civilite,
        userData.sexe,
        userData.adresse,
        userData.photo_path,
        userData.diplome,
        userData.employeur,
        userData.fonction,
        userData.numero_compte,
        userData.statut,
        userData.cv_path,
        userData.notes,
        userData.salaire_brut,
        userData.salaire_net,
        userData.specialite,
      ];
    case "Apprenant":
      return [
        userData.formationId,
        userData.organismeId,
        userData.photo_path,
        userData.date_naissance,
        userData.sexe,
        userData.telephone,
        userData.adresse,
        userData.notes,
        userData.userRole,
      ];
    default:
      throw new Error("Invalid userRole");
  }
}

app.post("/addOrganisme", (req, res) => {
  const { nom } = req.body;

  // Ensure 'nom' is provided
  if (!nom) {
    return res.status(400).json({ error: 'The "nom" field is required.' });
  }

  // SQL query to insert into Organismes table
  const insertOrganismeQuery = "INSERT INTO Organismes (nom) VALUES (?)";

  // Execute the query
  db.query(insertOrganismeQuery, [nom], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Return the ID of the newly created Organisme
    res.status(201).json({ organismeId: results.insertId });
  });
});

// POST endpoint to create Offre
app.post("/addOffre", (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'The "nom" field is required.' });
  }

  const insertOffreQuery = "INSERT INTO Offres (nom) VALUES (?)";

  db.query(insertOffreQuery, [nom], (err, results) => {
    if (err) {
      handleDatabaseError(res, err);
      return;
    }

    res.status(201).json({ offreId: results.insertId });
  });
});

//POST endpoint to create Theme
app.post("/addTheme", (req, res) => {
  const {
    designation,
    famille,
    descrip,
    objectifs,
    spec_materielles,
    spec_logicielles,
    prerequis,
    formation_certifiante,
    thm_formateur,
    total_formateur,
    total_general,
    support_pedagogique,
    duree_jours,
    duree_heures,
    niveau,
    tarif_participant,
    public,
    notes,
  } = req.body;

  // Validate required fields
  if (!designation || !famille) {
    return res
      .status(400)
      .json({ error: 'The "designation" and "famille" fields are required.' });
  }

  const insertThemeQuery =
    "INSERT INTO Theme (Designation, Famille, descrip, objectifs, spec_materielles, spec_logicielles,prerequis,formation_certifiante,thm_formateur,total_formateur,total_general,support_pedagogique,duree_jours,duree_heures,niveau,tarif_participant,public,notes) VALUES (?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

  db.query(
    insertThemeQuery,
    [
      designation,
      famille,
      descrip,
      objectifs,
      spec_materielles,
      spec_logicielles,
      prerequis,
      formation_certifiante,
      thm_formateur,
      total_formateur,
      total_general,
      support_pedagogique,
      duree_jours,
      duree_heures,
      niveau,
      tarif_participant,
      public,
      notes,
    ],
    (err, results) => {
      if (err) {
        handleDatabaseError(res, err);
        return;
      }

      res.status(201).json({ themeId: results.insertId });
    }
  );
});

// POST endpoint to create DemandeDevis
app.post("/addDemandeDevis", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'The "email" field is required.' });
  }

  const insertDemandeDevisQuery = "INSERT INTO DemandeDevis (email) VALUES (?)";

  db.query(insertDemandeDevisQuery, [email], (err, results) => {
    if (err) {
      handleDatabaseError(res, err);
      return;
    }

    res.status(201).json({ demandeId: results.insertId });
  });
});

app.post("/addCharges", (req, res) => {
  const {
    tarif_unitaire,
    quantite,
    taux_reduction,
    montant,
    montant_final,
    taux_tva,
    montant_tva,
    montant_ttc,
    notes,
  } = req.body;

  const insertChargesFormationQuery =
    "INSERT INTO ChargesFormation (tarif_unitaire, quantite, taux_reduction, montant, montant_final, taux_tva, montant_tva, montant_ttc, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    insertChargesFormationQuery,
    [
      tarif_unitaire,
      quantite,
      taux_reduction,
      montant,
      montant_final,
      taux_tva,
      montant_tva,
      montant_ttc,
      notes,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing MySQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({ chargesId: results.insertId });
    }
  );
});


app.post('/addPartenaire', (req, res) => {
  const { nom, username, description, password, email, userRole } = req.body;

  // Validate required fields
  if (!nom || !password || !email || !userRole) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  // Check if the partenaire exists in Organismes table
  const checkOrganismeQuery = 'SELECT organismeId FROM Organismes WHERE nom = ?';

  db.query(checkOrganismeQuery, [nom], (err, results) => {
    if (err) {
      console.error('Error checking organisme:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      // Partenaire exists in Organismes, retrieve organismeId
      const organismeId = results[0].organismeId;

      // Insert into Users table
      const userInsertQuery = 'INSERT INTO Users (nom, username, password, email, userRole) VALUES (?, ?, ?, ?, ?)';
      const userValues = [nom, username, password, email, userRole];

      db.query(userInsertQuery, userValues, (userErr, userResult) => {
        if (userErr) {
          console.error('Error inserting user:', userErr);
          res.status(500).json({ error: 'Error inserting user' });
        } else {
          const userId = userResult.insertId;

          // Insert partenaire into Partenaires table
          const insertPartenaireQuery = 'INSERT INTO Partenaires (description, organismeId, userId) VALUES (?, ?, ?)';
          db.query(insertPartenaireQuery, [description, organismeId, userId], (partenaireErr, partenaireResult) => {
            if (partenaireErr) {
              console.error('Error inserting partenaire:', partenaireErr);
              res.status(500).json({ error: 'Error inserting partenaire' });
            } else {
              res.status(201).json({ partenaireId: partenaireResult.insertId, message: 'Partenaire added successfully' });
            }
          });
        }
      });
    } else {
      // Partenaire doesn't exist in Organismes, create a new organisme
      const insertOrganismeQuery = 'INSERT INTO Organismes (nom) VALUES (?)';
      db.query(insertOrganismeQuery, [nom], (organismeErr, organismeResult) => {
        if (organismeErr) {
          console.error('Error inserting organisme:', organismeErr);
          res.status(500).json({ error: 'Error inserting organisme' });
        } else {
          const organismeId = organismeResult.insertId;

          // Insert into Users table
          const userInsertQuery = 'INSERT INTO Users (nom, username, password, email, userRole) VALUES (?, ?, ?, ?, ?)';
          const userValues = [nom, username, password, email, userRole];

          db.query(userInsertQuery, userValues, (userErr, userResult) => {
            if (userErr) {
              console.error('Error inserting user:', userErr);
              res.status(500).json({ error: 'Error inserting user' });
            } else {
              const userId = userResult.insertId;

              // Insert partenaire into Partenaires table
              const insertPartenaireQuery = 'INSERT INTO Partenaires (description, organismeId, userId) VALUES (?, ?, ?)';
              db.query(insertPartenaireQuery, [description, organismeId, userId], (partenaireErr, partenaireResult) => {
                if (partenaireErr) {
                  console.error('Error inserting partenaire:', partenaireErr);
                  res.status(500).json({ error: 'Error inserting partenaire' });
                } else {
                  res.status(201).json({ partenaireId: partenaireResult.insertId, message: 'Partenaire added successfully' });
                }
              });
            }
          });
        }
      });
    }
  });
});


app.post('/addEvaluationFormateur', (req, res) => {
  const { formateurId, partenaireId, evaluation } = req.body;

  const checkExistingEntryQuery = `
    SELECT eval_formateurId FROM EvaluationFormateur
    WHERE formateurId = ? AND partenaireId = ?
  `;

  db.query(checkExistingEntryQuery, [formateurId, partenaireId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error executing MySQL query:', checkErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      // If an entry already exists, update the existing entry
      const updateEvaluationQuery = `
        UPDATE EvaluationFormateur
        SET evaluation = ?
        WHERE formateurId = ? AND partenaireId = ?
      `;

      db.query(updateEvaluationQuery, [evaluation, formateurId, partenaireId], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating MySQL entry:', updateErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ eval_formateurId: checkResults[0].eval_formateurId });
      });
    } else {
      // If no entry exists, insert a new entry
      const insertEvaluationFormateurQuery = `
        INSERT INTO EvaluationFormateur (formateurId, partenaireId, evaluation)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertEvaluationFormateurQuery,
        [formateurId, partenaireId, evaluation],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error executing MySQL query:', insertErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          res.status(201).json({ eval_formateurId: insertResults.insertId });
        }
      );
    }
  });
});


// Create a new club and user
app.post('/addClub', (req, res) => {
  const { nom, slogan, username, email, password, userRole } = req.body;

  // Insert user into Users table
  const insertUserQuery = 'INSERT INTO Users (nom, prenom, username, email, password, userRole) VALUES (?, ?, ?, ?, ?, ?)';
  const userValues = [nom, '', username, email, password, userRole];

  db.query(insertUserQuery, userValues, (userErr, userResult) => {
    if (userErr) {
      console.error('Error inserting user:', userErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Insert club into Club table
    const userId = userResult.insertId;
    const insertClubQuery = 'INSERT INTO Club (nom, slogan, userId) VALUES (?, ?, ?)';
    const clubValues = [nom, slogan, userId];

    db.query(insertClubQuery, clubValues, (clubErr, clubResult) => {
      if (clubErr) {
        console.error('Error inserting club:', clubErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(201).json({ clubId: clubResult.insertId, userId });
    });
  });
});



app.get("/getPartenaireIdByUserId/:userId", (req, res) => {
  const userId = req.params.userId;

  // Query to get userId based on partenaireId
  const getPartenaireIdQuery = "SELECT partenaireId FROM Partenaires WHERE userId = ?";

  db.query(getPartenaireIdQuery, [userId], (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length > 0) {
      const partenaireId = result[0].partenaireId;
      res.status(200).json({ partenaireId });
    } else {
      res.status(404).json({ error: "Partenaire not found" });
    }
  });
});



app.listen(5000, () => {
  console.log("Nodejs server is running on port 5000");
});
