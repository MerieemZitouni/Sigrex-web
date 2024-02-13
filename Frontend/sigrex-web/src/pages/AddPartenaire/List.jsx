import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, makeStyles, Snackbar } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AjouterPartenaire from './AjouterPartenaire';
import Popup from "../../components/controls/Popup";
import Notif from "../../components/controls/Notif";
import ConfirmDialog from '../../components/reusable/ConfirmDialog';
import axios from 'axios';


const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  tablehd: {
     backgroundColor: 'darkblue',
     
  },
  tablecell: {
     color: 'white',
     fontWeight: 'bold', 
  },
  cont: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '30px', // Add margin at the bottom
  },
  searchBox: {
    marginBottom: '20px', // Add margin at the bottom
    marginRight: theme.spacing(3),
  },
  newButton: {
    marginBottom: '20px', // Add margin at the bottom
    backgroundColor: 'darkblue',
    width: '150px',
    color: 'white',
    '&:hover': {
      backgroundColor: 'blue',}  
  }
}));



const ListPartenaires = () => {
  const classes = useStyles();
  const [partenaires, setPartenaires] = useState([]);
  const [editPartenaireId, setEditPartenaireId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://your-backend-api-url/partners');
      setPartenaires(response.data);
    } catch (error) {
      console.error('Error fetching partenaires:', error);
    }
  };

  const addOrEdit = async (partenaire, resetForm) => {
    try {
      if (partenaire.id === 0) {
        await axios.post('http://your-backend-api-url/partners', partenaire);
      } else {
        await axios.put(`http://your-backend-api-url/partners/${partenaire.id}`, partenaire);
      }

      resetForm();
      setEditPartenaireId(null);
      setOpenPopup(false);
      fetchData();

      setNotify({
        isOpen: true,
        message: 'Enregistré avec succès',
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding/editing partenaire:', error);
    }
  };

  const handleDeletePartenaire = async (id) => {
    try {
      await axios.delete(`http://your-backend-api-url/partners/${id}`);
      fetchData();

      setNotify({
        isOpen: true,
        message: 'Supprimé avec succès',
        type: 'error',
      });
    } catch (error) {
      console.error('Error deleting partenaire:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPartenaires = partenaires.filter((partenaire) =>
    partenaire.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.cont}>
      <div className={classes.searchBox + ' search_box'}>
        <input type="text" placeholder="Rechercher des partenaires..." onChange={handleSearch} />
        <span>
          <i className="ri-search-line"></i>
        </span>
      </div>

      <Button
        variant="outlined"
        className={classes.newButton}
        type="button"
        
        onClick={() => {
          setOpenPopup(true);
          setEditPartenaireId(null);
        }}
      >
        Nouveau
      </Button>

      <Popup
        title="Enregistrement d'un nouvel partenaire"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AjouterPartenaire addOrEdit={addOrEdit} />
      </Popup>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="Liste des partenaires">
          <TableHead className={classes.tablehd}>
            <TableRow>
              <TableCell className={classes.tablecell}>Description</TableCell>
              <TableCell className={classes.tablecell}>ID Utilisateur</TableCell>
              <TableCell className={classes.tablecell}>ID Organisme</TableCell>
              <TableCell className={classes.tablecell}>Nom</TableCell>
              <TableCell className={classes.tablecell}>Adresse</TableCell>
              <TableCell className={classes.tablecell}>Téléphone</TableCell>
              <TableCell className={classes.tablecell}>Email</TableCell>
              <TableCell className={classes.tablecell}>Site Web</TableCell>
              <TableCell className={classes.tablecell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPartenaires.map((partenaire) => (
              <TableRow key={partenaire.id}>
                <TableCell>{partenaire.description}</TableCell>
                <TableCell>{partenaire.userId}</TableCell>
                <TableCell>{partenaire.organismeId}</TableCell>
                <TableCell>{partenaire.nom}</TableCell>
                <TableCell>{partenaire.adresse}</TableCell>
                <TableCell>{partenaire.telephone}</TableCell>
                <TableCell>{partenaire.email}</TableCell>
                <TableCell>{partenaire.siteWeb}</TableCell>
                <TableCell>
                  <Button onClick={() => setEditPartenaireId(partenaire.id)}>Modifier</Button>
                  <Button onClick={() => setConfirmDialog({ isOpen: true, title: "Confirmation", subTitle: "Voulez-vous supprimer cet enregistrement ?", onConfirm: () => handleDeletePartenaire(partenaire.id) })}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Notif
        notify={notify}
        setNotify={setNotify}
      />

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
};

export default ListPartenaires;


