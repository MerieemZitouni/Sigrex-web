import React, { useState } from 'react';
import { makeStyles, Typography, TextField, Button } from '@material-ui/core';
import Paper, { paperClasses } from '@mui/material/Paper';

const useStyles = makeStyles(theme => ({
  formContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    borderRadius: '22px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formTitle: {
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: theme.spacing(2),
    
  },
  formInput: {
    width: '100%',
    borderRadius: '27px',

    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent', // Transparent border when not focused
      },
      '&:hover fieldset': {
        borderColor: 'transparent', // Transparent border when hovered
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent', // Transparent border when focused
      },
    },


  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%',
    height: '44px',
    backgroundColor: '#1976d2',
    borderRadius: '27px',
    marginBottom: theme.spacing(1.5),
    color: '#fff',
    '&:hover': {
      backgroundColor: '#115293',
    },
  },

  successMessage: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#4CAF50',
    marginTop: theme.spacing(2),
  },


  paperClasses: {
    borderRadius: '27px',
  
  },
}));

function AjouterPartenaire() {
  const classes = useStyles();
  const [nom, setNom] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/addPartenaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, username, description, password, email, userRole }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);

        // If the message is 'Partenaire added successfully', hide the form
        if (result.message === 'Partenaire added successfully') {
          setFormVisible(false);
        }
      } else {
        console.error('Failed to add partenaire');
      }
    } catch (error) {
      console.error('Error during the form submission:', error);
    }
  };

  return (
    <div className={classes.formContainer}>
      <Typography variant="h5" className={classes.formTitle}>Ajouter un Partenaire</Typography>
      
      {formVisible ? (
        
        <form onSubmit={handleSubmit}>
        <div className={classes.formGroup}>
          <Paper className={classes.paperClasses}>
          <TextField
            className={classes.formInput}
            label="Nom"
            variant="outlined"
            fullWidth
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          </Paper>
        </div>
        
        <div className={classes.formGroup}>
        <Paper className={classes.paperClasses}>
          <TextField
            label="Nom d'utilisateur"
            className={classes.formInput}
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          </Paper>
        </div>
        <div className={classes.formGroup}>
        <Paper className={classes.paperClasses}>
          <TextField
            className={classes.formInput}
            label="description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          </Paper>
        </div>
        <div className={classes.formGroup}>
        <Paper className={classes.paperClasses}>
          <TextField
            className={classes.formInput}
            label="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </Paper>
        </div>
        <div className={classes.formGroup}>
        <Paper className={classes.paperClasses}>
          <TextField
            className={classes.formInput}
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </Paper>
        </div>
        <div className={classes.formGroup}>
        <Paper className={classes.paperClasses}>
          <TextField
            className={classes.formInput}
            label="Role"
            variant="outlined"
            fullWidth
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          />
          </Paper>
        </div>
        
        <Button type="submit" variant="contained" className={classes.submitButton}>Ajouter Partenaire</Button>
      </form>
          
      ) : (
        <Typography className={classes.successMessage} variant="body1">{message}</Typography>
      )}
    </div>
  );
}
export default AjouterPartenaire;
