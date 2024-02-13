use sigrex_db;
CREATE TABLE Users (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  prenom VARCHAR(255),
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  userRole ENUM('Administrateur', 'Partenaire', 'Formateur', 'Apprenant','Club') NOT NULL
);

CREATE TABLE Administrateurs (
  adminId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  FOREIGN KEY (userId) REFERENCES Users(userId)
);
CREATE TABLE Organismes (
  organismeId INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255)
);

CREATE TABLE Offres (
  offreId INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255)
);

CREATE TABLE Partenaires (
  partenaireId INT AUTO_INCREMENT PRIMARY KEY,
  description TEXT,
  userId INT,
  FOREIGN KEY (userId) REFERENCES Users(userId),
  organismeId INT,
  Foreign key (organismeId) references Organismes(organismeId)
);


CREATE TABLE Formateurs (
  formateurId INT AUTO_INCREMENT PRIMARY KEY,
  civilite ENUM('Monsieur', 'Madame', 'Mademoiselle'),
  sexe ENUM('Masculin', 'Feminin'),
  adresse VARCHAR(255),
  photo_path VARCHAR(255),
  diplome ENUM('Licence', 'Master', 'Doctorat', 'Ingenieur', 'TS'),
  employeur VARCHAR(255),
  fonction VARCHAR(255),
  numero_compte VARCHAR(255),
  statut ENUM('Interne', 'Externe', 'Vacataire', 'Permanent', 'Contractuel', 'Stagiaire', 'Volontaire', 'Benevole'),
  cv_path VARCHAR(255),
  notes TEXT,
  salaire_brut float,
  salaire_net float,
  specialite VARCHAR(255),
  userId INT,
  FOREIGN KEY (userId) REFERENCES Users(userId)
);



CREATE TABLE ChargesFormation (
  chargesId INT AUTO_INCREMENT PRIMARY KEY,
  tarif_unitaire float,
  quantite INT,
  taux_reduction float,
    montant float,
    montant_final float,
    taux_tva float,
    montant_tva float,
    montant_ttc float,
    notes TEXT

);


CREATE TABLE Theme (
  themeId INT AUTO_INCREMENT PRIMARY KEY,
  Designation VARCHAR(255),
  Famille VARCHAR(255),
  descrip TEXT,
  objectifs TEXT,
  spec_materielles TEXT,
    spec_logicielles TEXT,
   prerequis TEXT,
   formation_certifiante BOOLEAN,
   thm_formateur float,
   total_formateur float,
   total_general float,
   support_pedagogique BOOLEAN,
   duree_jours INT,
    duree_heures INT,
    niveau ENUM('Fondamental', 'Intermediaire', 'Avance') NOT NULL,
    tarif_participant float,
    public VARCHAR(255),
    notes TEXT

);


CREATE TABLE Formations (
  formationId INT AUTO_INCREMENT PRIMARY KEY,
  offreId INT NOT NULL,
  themeId INT NOT NULL,
  chargesId INT NOT NULL,
  partenaireId INT NOT NULL,
  FOREIGN KEY (partenaireId) REFERENCES Partenaires(partenaireId),
  FOREIGN KEY (offreId) REFERENCES Offres(offreId),
  FOREIGN KEY (themeId) REFERENCES Theme(themeId),
  FOREIGN KEY (chargesId) REFERENCES ChargesFormation(chargesId),
  exercice VARCHAR(255),
  date_ajout DATE,
  date_debut DATE,
  date_fin DATE,
  marge_prime float,
  reduction_pourcentage float,
  objet VARCHAR(255),
  notes TEXT,
  evaluation DECIMAL(2, 1),
  type_formation ENUM('A la carte', 'Avant promotion')
);


CREATE TABLE DemandeDevis (
    demandeId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    formationId INT,
    FOREIGN KEY (formationId) REFERENCES Formations(formationId)
);

create TABLE EvaluationFormation(
  eval_formationId INT AUTO_INCREMENT PRIMARY KEY,
  formationId INT,
  FOREIGN KEY (formationId) REFERENCES Formations(formationId),
  partenaireId INT,
  FOREIGN KEY (partenaireId) REFERENCES Partenaires(partenaireId),
  evaluation DECIMAL(2, 1)
);

create TABLE EvaluationFormateur(
  eval_formateurId INT AUTO_INCREMENT PRIMARY KEY,
  formateurId INT,
  FOREIGN KEY (formateurId) REFERENCES Formateurs(formateurId),
  partenaireId INT,
  FOREIGN KEY (partenaireId) REFERENCES Partenaires(partenaireId),
  evaluation DECIMAL(2, 1),
  UNIQUE KEY unique_formateur_partenaire (formateurId, partenaireId)
);



CREATE TABLE Apprenants (
  apprenantId INT AUTO_INCREMENT PRIMARY KEY,
  formationId INT NOT NULL,
  organismeId INT NOT NULL,
  userId INT,
  FOREIGN KEY (userId) REFERENCES Users(userId),
  photo_path VARCHAR(255),
  date_naissance DATE,
  sexe ENUM('Masculin', 'Feminin'),
  telephone VARCHAR(255),
  adresse VARCHAR(255),
  notes TEXT,
  FOREIGN KEY (formationId) REFERENCES Formations(formationId),
  FOREIGN KEY (organismeId) REFERENCES Organismes(organismeId)
);


CREATE TABLE Domaine(
    domaineId INT AUTO_INCREMENT PRIMARY KEY,
    formationId INT NOT NULL,
    designation VARCHAR(255),
    descrip TEXT,
    notes TEXT,
    FOREIGN KEY (formationId) REFERENCES Formations(formationId)
    );





CREATE TABLE InscriptionFormation (
  apprenantId INT,
  formationId INT,
  PRIMARY KEY (apprenantId, formationId),
  FOREIGN KEY (apprenantId) REFERENCES Apprenants(apprenantId),
  FOREIGN KEY (formationId) REFERENCES Formations(formationId)
);



CREATE TABLE Attestation (
  attestationId INT AUTO_INCREMENT PRIMARY KEY,
  apprenantId INT NOT NULL,
    formationId INT NOT NULL,
  FOREIGN KEY (apprenantId) REFERENCES Apprenants(apprenantId),
    FOREIGN KEY (formationId) REFERENCES Formations(formationId)
);


create TABLE Club(
  clubId INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  slogan TEXT,
  userId INT,
  FOREIGN KEY (userId) REFERENCES Users(userId)
);

create TABLE Evenements(
  eventId INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  date_debut DATE,
  date_fin DATE,
  lieu VARCHAR(255),
  description TEXT,
  notes TEXT,
  clubId INT,
  FOREIGN KEY (clubId) REFERENCES Club(clubId),
  espace_pedagogique VARCHAR(255)
);

create TABLE BilanAnnuel(
  bilanId INT AUTO_INCREMENT PRIMARY KEY,
  annee INT,
  clubId INT,
  FOREIGN KEY (clubId) REFERENCES Club(clubId)
);

create TABLE Adherent(
  adherentId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  clubId INT,
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (clubId) REFERENCES Club(clubId)
);


create table DemandeSponsoring(
sponsoringId INT AUTO_INCREMENT PRIMARY KEY,
partenaireId INT,
FOREIGN KEY (partenaireId) REFERENCES Partenaires(partenaireId),
eventId INT,
FOREIGN KEY (eventId) REFERENCES Evenements(eventId),
clubId INT, 
FOREIGN KEY (clubId) REFERENCES Club(clubId),
emetteur ENUM('Club', 'Partenaire'),
etat ENUM('En attente', 'Acceptee', 'Refusee')
);


create table PapierAdministratif(
  papierId INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  description TEXT,
  path VARCHAR(255)
);


create TABLE DemandeOrganisationEvenement(
  demandeOrganisationEventId INT AUTO_INCREMENT PRIMARY KEY,
  eventId INT,
  FOREIGN KEY (eventId) REFERENCES Evenements(eventId),
  clubId INT, 
  FOREIGN KEY (clubId) REFERENCES Club(clubId),
  etat ENUM('En attente', 'Acceptee', 'Refusee'),

  nom VARCHAR(255),
  date_debut DATE,
  date_fin DATE,
  lieu VARCHAR(255),
  description TEXT,
  notes TEXT,
  espace_pedagogique VARCHAR(255)
);