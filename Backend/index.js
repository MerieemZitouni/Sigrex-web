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



app.post('/addUser', (req, res) => {
  const { nom, prenom, username, email, password, userRole, /* add other user attributes here */ } = req.body;

  // Insert into Users table
  const userInsertQuery = 'INSERT INTO Users (nom, prenom, username, email, password, userRole) VALUES (?, ?, ?, ?, ?, ?)';
  const userValues = [nom, prenom, username, email, password, userRole];

  db.query(userInsertQuery, userValues, (userErr, userResult) => {
      if (userErr) {
          console.error('Error inserting user:', userErr);
          res.status(500).send('Error inserting user');
      } else {
          const userId = userResult.insertId;

          // Insert into specific user table based on userRole
          const specificUserInsertQuery = getSpecificUserInsertQuery(userRole);
          const specificUserValues = getSpecificUserValues(userRole, userId, req.body);

          db.query(specificUserInsertQuery, specificUserValues, (specificUserErr) => {
              if (specificUserErr) {
                  console.error('Error inserting specific user:', specificUserErr);
                  res.status(500).send('Error inserting specific user');
              } else {
                  res.status(200).send('User added successfully');
              }
          });
      }
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

// POST endpoint to create DemandeDevis
app.post('/addDemandeDevis', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'The "email" field is required.' });
  }

  const insertDemandeDevisQuery = 'INSERT INTO DemandeDevis (email) VALUES (?)';

  db.query(insertDemandeDevisQuery, [email], (err, results) => {
    if (err) {
      handleDatabaseError(res, err);
      return;
    }

    res.status(201).json({ demandeId: results.insertId });
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
    organismeId,
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
  } = req.body;

  const insertFormationQuery = `
    INSERT INTO Formations (
      organismeId, offreId, themeId, chargesId, exercice, date_ajout, date_debut,
      date_fin, marge_prime, reduction_pourcentage, objet, notes, evaluation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertFormationQuery,
    [
      organismeId,
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









// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



