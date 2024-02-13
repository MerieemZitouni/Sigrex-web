const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3331;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'djXias715@',
  database: 'sigrex_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  res.status(500).json({ error: 'A database error occurred.' });
};

app.post('/addFormateur', (req, res) => {
  const {
    nom,
    prenom,
    username,
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
    email,
    password,
    userRole
  } = req.body;

  // Validate required fields
  if (!nom || !prenom ||  !username || !civilite || !sexe || !adresse || !photo_path || !diplome || !employeur || !fonction ||
      !numero_compte || !statut || !cv_path || !notes || !salaire_brut || !salaire_net || !specialite ||
      !email || !password || !userRole) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  // Insert into Users table
  const userInsertQuery = 'INSERT INTO Users (nom, prenom,username, email, password, userRole) VALUES (?, ?,?, ?, ?, ?)';
  const userValues = [nom, prenom,username, email, password, userRole];

  db.query(userInsertQuery, userValues, (userErr, userResult) => {
    if (userErr) {
      console.error('Error inserting user:', userErr);
      return res.status(500).json({ error: 'Error inserting user' });
    }

    const userId = userResult.insertId;

    // Insert formateur into Formateurs table
    const formateurInsertQuery = `
      INSERT INTO Formateurs (
        civilite, sexe, adresse, photo_path, diplome, employeur, fonction,
        numero_compte, statut, cv_path, notes, salaire_brut, salaire_net,
        specialite, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const formateurValues = [
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
    ];

    db.query(formateurInsertQuery, formateurValues, (formateurErr, formateurResult) => {
      if (formateurErr) {
        console.error('Error inserting formateur:', formateurErr);
        return res.status(500).json({ error: 'Error inserting formateur' });
      }

      res.status(201).json({ formateurId: formateurResult.insertId });
    });
  });
});


// Helper function to get the specific user insert query based on userRole
function getSpecificUserInsertQuery(userRole) {
  switch (userRole) {
      case 'Administrateur':
          return 'INSERT INTO Administrateurs (userId) VALUES (LAST_INSERT_ID())';
      case 'Partenaire':
          return 'INSERT INTO Partenaires (userId,description) VALUES (LAST_INSERT_ID(),?)';
      case 'Formateur':
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
      case 'Apprenant':
          return `
              INSERT INTO Apprenants ( userId,
                  formationId, organismeId, photo_path, date_naissance, sexe,
                  telephone, adresse, notes
              ) VALUES ( LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?, ?, ?)
          `;
      default:
          throw new Error('Invalid userRole');
  }
}

// Helper function to get specific user values based on userRole
function getSpecificUserValues(userRole, userId, userData) {
  switch (userRole) {
      case 'Administrateur':
        return [
           
          ];
      case 'Partenaire':
          return [
              userData.description
              ];
      case 'Formateur':
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
              userData.specialite];
      case 'Apprenant':
        return [
          userData.formationId,
          userData.organismeId,
          userData.photo_path,
          userData.date_naissance,
          userData.sexe,
          userData.telephone,
          userData.adresse,
          userData.notes,
          userData.userRole
      ];
      default:
          throw new Error('Invalid userRole');
  }
}


  app.post('/addOrganisme', (req, res) => {
    const { nom } = req.body;
  
    // Ensure 'nom' is provided
    if (!nom) {
      return res.status(400).json({ error: 'The "nom" field is required.' });
    }
  
    // SQL query to insert into Organismes table
    const insertOrganismeQuery = 'INSERT INTO Organismes (nom) VALUES (?)';
  
    // Execute the query
    db.query(insertOrganismeQuery, [nom], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Return the ID of the newly created Organisme
      res.status(201).json({ organismeId: results.insertId });
    });
  });


  // POST endpoint to create Offre
app.post('/addOffre', (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'The "nom" field is required.' });
  }

  const insertOffreQuery = 'INSERT INTO Offres (nom) VALUES (?)';

  db.query(insertOffreQuery, [nom], (err, results) => {
    if (err) {
      handleDatabaseError(res, err);
      return;
    }

    res.status(201).json({ offreId: results.insertId });
  });
});

//POST endpoint to create Theme
app.post('/addTheme', (req, res) => {
  const { designation, famille, descrip, objectifs, spec_materielles, spec_logicielles, prerequis, formation_certifiante, thm_formateur, total_formateur, total_general, support_pedagogique, duree_jours, duree_heures, niveau, tarif_participant, public, notes } = req.body;

  // Validate required fields
  if (!designation || !famille) {
    return res.status(400).json({ error: 'The "designation" and "famille" fields are required.' });
  }

  const insertThemeQuery = 'INSERT INTO Theme (Designation, Famille, descrip, objectifs, spec_materielles, spec_logicielles,prerequis,formation_certifiante,thm_formateur,total_formateur,total_general,support_pedagogique,duree_jours,duree_heures,niveau,tarif_participant,public,notes) VALUES (?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

  db.query(insertThemeQuery, [designation, famille, descrip, objectifs, spec_materielles, spec_logicielles, prerequis, formation_certifiante, thm_formateur, total_formateur, total_general, support_pedagogique, duree_jours, duree_heures, niveau, tarif_participant, public, notes], (err, results) => {
    if (err) {
      handleDatabaseError(res, err);
      return;
    }

    res.status(201).json({ themeId: results.insertId });
  });
});


app.post('/addCharges', (req, res) => {
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

  const insertChargesFormationQuery = 'INSERT INTO ChargesFormation (tarif_unitaire, quantite, taux_reduction, montant, montant_final, taux_tva, montant_tva, montant_ttc, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    insertChargesFormationQuery,
    [tarif_unitaire, quantite, taux_reduction, montant, montant_final, taux_tva, montant_tva, montant_ttc, notes],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ chargesId: results.insertId });
    }
  );
});


// POST endpoint to add Formation
app.post('/addFormation', (req, res) => {
  const {
    partenaireId,
    offreId,
    themeId,
    chargesId,
    exercice,
    date_ajout,
    date_debut,
    date_fin,
    marge_prime,
    reduction_pourcentage,
    objet,
    notes,
    evaluation,
    type_formation
  } = req.body;

  const insertFormationQuery = `
    INSERT INTO Formations (
      partenaireId, offreId, themeId, chargesId, exercice, date_ajout, date_debut,
      date_fin, marge_prime, reduction_pourcentage, objet, notes, evaluation, type_formation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  db.query(
    insertFormationQuery,
    [
      partenaireId,
      offreId,
      themeId,
      chargesId,
      exercice,
      date_ajout,
      date_debut,
      date_fin,
      marge_prime,
      reduction_pourcentage,
      objet,
      notes,
      evaluation,
      type_formation
    ],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ formationId: results.insertId });
    }
  );
});



app.post('/addPartenaire', (req, res) => {
  const { nom,username, description, password, email, userRole } = req.body;

  // Validate required fields
  if (!nom || !password || !email || !userRole ) {
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
      const userInsertQuery = 'INSERT INTO Users (nom,username, password, email, userRole) VALUES (?, ?,?, ?, ?,?)';
      const userValues = [nom,username,password, email, userRole];

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
              res.status(201).json({ partenaireId: partenaireResult.insertId });
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
          const userInsertQuery = 'INSERT INTO Users (nom,username, password, email, userRole) VALUES (?, ?, ?,?, ?,?)';
          const userValues = [nom,username, password, email, userRole];

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
                  res.status(201).json({ partenaireId: partenaireResult.insertId });
                }
              });
            }
          });
        }
      });
    }
  });
});



// POST endpoint to create DemandeDevis
app.post('/addDemandeDevis', (req, res) => {
  const { email,formationId } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'The "email" field is required.' });
  }

  const insertDemandeDevisQuery = 'INSERT INTO DemandeDevis (email, formationId) VALUES (?,?)';

  db.query(insertDemandeDevisQuery, [email,formationId], (err, results) => {
    if (err) {
      handleDatabaseError(res, err);
      return;
    }

    res.status(201).json({ demandeId: results.insertId });
  });
});



app.post('/addApprenant', (req, res) => {
  const {
    nom,
    prenom,
    username,
    email,
    password,
    userRole,
    formationId,
    organismeId,
    photo_path,
    date_naissance,
    sexe,
    telephone,
    adresse,
    notes,
  } = req.body;

  // Insert into Users table
  const userQuery = `INSERT INTO Users (nom, prenom, username, email, password, userRole) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    userQuery,
    [nom, prenom, username, email, password, userRole],
    (userError, userResults, userFields) => {
      if (userError) throw userError;

      // Insert into Apprenants table
      const apprenantQuery = `INSERT INTO Apprenants (formationId, organismeId, userId, photo_path, date_naissance, sexe, telephone, adresse, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(
        apprenantQuery,
        [formationId, organismeId, userResults.insertId, photo_path, date_naissance, sexe, telephone, adresse, notes],
        (apprenantError, apprenantResults, apprenantFields) => {
          if (apprenantError) throw apprenantError;

          res.json({ success: true, apprenantId: apprenantResults.insertId });
        }
      );
    }
  );
});


app.post('/addAdmin', (req, res) => {
  const { nom, prenom, username, email, password, userRole, userId } = req.body;

  // Insert into Users table
  const userQuery = `INSERT INTO Users (nom, prenom, username, email, password, userRole) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    userQuery,
    [nom, prenom, username, email, password, userRole],
    (userError, userResults, userFields) => {
      if (userError) throw userError;

      // Insert into Administrateurs table
      const adminQuery = `INSERT INTO Administrateurs (userId) VALUES (?)`;
      db.query(adminQuery, [userResults.insertId], (adminError, adminResults, adminFields) => {
        if (adminError) throw adminError;

        res.json({ success: true, adminId: adminResults.insertId });
      });
    }
  );
});




// POST endpoint to add Domaine
app.post('/addDomaine', (req, res) => {
  const {
    formationId,
    designation,
    descrip,
    notes,
  } = req.body;

  const insertDomaineQuery = `
    INSERT INTO Domaine (
      formationId, designation, descrip, notes
    ) VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertDomaineQuery,
    [
      formationId,
      designation,
      descrip,
      notes,
    ],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ domaineId: results.insertId });
    }
  );
});


// POST endpoint to add InscriptionFormation
app.post('/inscriptionsformations', (req, res) => {
  const { apprenantId, formationId } = req.body;

  const insertInscriptionFormationQuery = `
    INSERT INTO InscriptionFormation (apprenantId, formationId) VALUES (?, ?)
  `;

  db.query(
    insertInscriptionFormationQuery,
    [apprenantId, formationId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ success: true });
    }
  );
});

// POST endpoint to add Attestation
app.post('/addAttestation', (req, res) => {
  const { apprenantId, formationId } = req.body;

  const insertAttestationQuery = `
    INSERT INTO Attestation (apprenantId, formationId) VALUES (?, ?)
  `;

  db.query(
    insertAttestationQuery,
    [apprenantId, formationId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ attestationId: results.insertId });
    }
  );
});

// POST endpoint to add Club
app.post('/addClub', (req, res) => {
  const { nom, slogan } = req.body;

  const insertClubQuery = `
    INSERT INTO Club (nom, slogan) VALUES (?, ?)
  `;

  db.query(
    insertClubQuery,
    [nom, slogan],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ clubId: results.insertId });
    }
  );
});



// POST endpoint to add Evenement
app.post('/addEvent', (req, res) => {
  const {
    nom,
    date_debut,
    date_fin,
    lieu,
    description,
    notes,
    clubId,
    espace_pedagogique,
  } = req.body;

  const insertEvenementQuery = `
    INSERT INTO Evenements (
      nom, date_debut, date_fin, lieu, description, notes, clubId, espace_pedagogique
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertEvenementQuery,
    [nom, date_debut, date_fin, lieu, description, notes, clubId, espace_pedagogique],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ eventId: results.insertId });
    }
  );
});

// POST endpoint to add BilanAnnuel
app.post('/addBilan', (req, res) => {
  const { annee, clubId } = req.body;

  const insertBilanAnnuelQuery = `
    INSERT INTO BilanAnnuel (annee, clubId) VALUES (?, ?)
  `;

  db.query(
    insertBilanAnnuelQuery,
    [annee, clubId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ bilanId: results.insertId });
    }
  );
});

// POST endpoint to add Adherent
app.post('/addAdherent', (req, res) => {
  const { userId, clubId } = req.body;

  const insertAdherentQuery = `
    INSERT INTO Adherent (userId, clubId) VALUES (?, ?)
  `;

  db.query(
    insertAdherentQuery,
    [userId, clubId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ adherentId: results.insertId });
    }
  );
});


app.post('/addEvaluationFormation', (req, res) => {
  const { formationId, partenaireId } = req.body;

  const insertEvaluationFormationQuery = `
    INSERT INTO EvaluationFormation (formationId, partenaireId) VALUES (?, ?)
  `;

  db.query(
    insertEvaluationFormationQuery,
    [formationId, partenaireId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ eval_formationId: results.insertId });
    }
  );
});


app.post('/addEvaluationFormateur', (req, res) => {
  const { formateurId, partenaireId } = req.body;

  const insertEvaluationFormateurQuery = `
    INSERT INTO EvaluationFormateur (formateurId, partenaireId) VALUES (?, ?)
  `;

  db.query(
    insertEvaluationFormateurQuery,
    [formateurId, partenaireId],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ eval_formateurId: results.insertId });
    }
  );
});



app.post('/addDemandeSponsoring', (req, res) => {
  const { partenaireId, eventId, clubId, emetteur, etat } = req.body;

  const insertDemandeSponsoringQuery = `
    INSERT INTO DemandeSponsoring (partenaireId, eventId, clubId, emetteur, etat) VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertDemandeSponsoringQuery,
    [partenaireId, eventId, clubId, emetteur, etat],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ sponsoringId: results.insertId });
    }
  );
});




//get clubs
app.get('/clubs', (req, res) => {
  // SQL query to select all clubs
  const sql = 'SELECT * FROM Club';

  // Execute the SQL query using 'db' instead of 'connection'
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Error fetching clubs' });
      return;
    }

    // Send the results as JSON response
    res.json(results);
  });
});

// Route to fetch club details by ID
app.get('/clubs/:clubId', (req, res) => {
  const clubId = req.params.clubId;
  const query = `SELECT * FROM Club WHERE clubId = ${clubId}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching club details: ', err);
      res.status(500).json({ error: 'Error fetching club details' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Club not found' });
      return;
    }
    const club = results[0];
    res.json(club);
  });
});

app.get('/events', (req, res) => {
  const query = 'SELECT * FROM Evenements';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events: ', err);
      res.status(500).send('Error fetching events');
      return;
    }
    res.json(results);
  });
});

// Route to fetch event details by ID
app.get('/events/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const query = `SELECT * FROM Evenements WHERE eventId = ${eventId}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching event details: ', err);
      res.status(500).send('Error fetching event details');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Event not found');
      return;
    }
    const event = results[0];
    res.json(event);
  });
});


app.get('/formateurs', (req, res) => {
  // Query to retrieve formateurs data
  const query = `
    SELECT *
    FROM Formateurs
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching formateurs:', err);
      return res.status(500).json({ error: 'Error fetching formateurs' });
    }

    // Send the formateurs data as a JSON response
    res.json(results);
  });
});



app.post('/addDemandeOrganisationEvenement', (req, res) => {
  const {
    clubId,
    nom,
    date_debut,
    date_fin,
    lieu,
    description,
    notes,
    espace_pedagogique
  } = req.body;

  const insertDemandeOrganisationEvenementQuery = `
    INSERT INTO DemandeOrganisationEvenement (
      eventId, clubId, etat, nom, date_debut, date_fin, lieu, description, notes, espace_pedagogique
    ) VALUES (null, ?, 'En attente', ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertDemandeOrganisationEvenementQuery,
    [clubId, nom, date_debut, date_fin, lieu, description, notes, espace_pedagogique],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ demandeOrganisationEventId: results.insertId });
    }
  );
});



// Drop the trigger if it exists
const dropTriggerQuery = `DROP TRIGGER IF EXISTS after_update_demande_organisation_evenement`;

db.query(dropTriggerQuery, (dropErr, dropResults) => {
  if (dropErr) {
    console.error('Error dropping trigger:', dropErr);
  } else {
    console.log('Trigger dropped successfully');

    // Now create the trigger
    const eventTriggerQuery = `
    CREATE TRIGGER after_update_demande_organisation_evenement
    AFTER UPDATE ON DemandeOrganisationEvenement
    FOR EACH ROW
    BEGIN
      IF NEW.etat = 'Acceptee' AND OLD.etat != 'Acceptee' THEN
        INSERT INTO Evenements (nom, date_debut, date_fin, lieu, description, notes, clubId, espace_pedagogique)
        VALUES (NEW.nom, NEW.date_debut, NEW.date_fin, NEW.lieu, NEW.description, NEW.notes, NEW.clubId, NEW.espace_pedagogique);

        
      END IF;
    END;
    `;


    
    db.query(eventTriggerQuery, (err, results) => {
      if (err) {
        console.error('Error creating trigger:', err);
      } else {
        console.log('Trigger created successfully');
      }
    });
  }
});






// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



