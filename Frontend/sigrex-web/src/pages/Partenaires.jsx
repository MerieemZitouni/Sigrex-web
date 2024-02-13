import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Axios from "axios";
import SpeedDial from "../components/SpeedDial";
import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import { Add, AddAPhoto } from "@material-ui/icons";
import Stack from '@mui/material/Stack';

import { Button, Grid ,Popover, IconButton } from "@material-ui/core";
// Replace imports from @mui/material with @material-ui/core
import { Box, Paper, Rating, Tab, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tabs } from "@material-ui/core";

import { useLocation, useNavigate } from "react-router-dom";


function StyleData(value){return <div style={{ fontFamily: "poppins" }} >{value}</div>;}
const useStyles = makeStyles(theme => ({
    dataTable: {
      overflow: 'auto',
      borderRadius: '20px',
      
    
    },
    button:{
      backgroundColor: "#00457E",
      borderRadius: "30px",
      textTransform: "capitalize",
      fontFamily: "Poppins",
      marginRight:theme.spacing(2),
      "&:hover": {
        backgroundColor: "#3A85F4",
        },
    },
    stackButtons:{
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      justifyContent: 'flex-end',
    },
    popButton:{
      backgroundColor :"transparent",
      border: "none",
      fontFamily: "Poppins",
      fontSize: "14px",
      cursor: "pointer",
      "&:hover": {
        color: "#3A85F4",
        },
    },
    stackPopMenu:{
      padding: theme.spacing(1.5),
    },
    popover:{
      borderRadius: "20px",
      "& .MuiPopover-paper":{
        borderRadius: "20px",
      },
    },
    gridContainer:{
        margin:theme.spacing(3),
       
    },

    stackList:{
        marginLeft:theme.spacing(4),
        marginTop: theme.spacing(3),
        display: 'flex',
        alignItems:'flex-end'
    },
    cellWithMargin:{
        marginLeft: theme.spacing(3)
    }

  }))

const columns = [
    // ... (other columns)
    {name: "nom",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Nom de l'organisme</div>,
    options: {
      filter: true,
      sort: true,
      search: true, // Enable search for this column
      customBodyRender: (value, tableMeta, updateValue) => {
        return <div style={{ }}>{StyleData(value)}</div>;
      },
    },
  },
  {
    name: "email",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Email</div>,
    options: {
      filter: true,
      sort: true,
      search: true, // Enable search for this column
      customBodyRender: (value, tableMeta, updateValue) => {
        return StyleData(value);
      },
    },
  },
  {
    name: "description",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Description de l'organisme</div>,
    options: {
      filter: true,
      sort: true,
      search: true, // Enable search for this column
      customBodyRender: (value, tableMeta, updateValue) => {
        return StyleData(value);
      },
    },
  },
     
  ];


  const options = {
    download: false, // Remove download option
    print: false, // Remove print option
    selectableRows: "none", // Remove checkbox selection
    filter: true,
    search: true, // Enable global search
    rowsPerPage: [5],
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "Total items per page",
        displayRows: "of",
      },
    },
    onChangePage(currentPage) {
      console.log({ currentPage });
    },
    onChangeRowsPerPage(numberOfRows) {
      console.log({ numberOfRows });
    },
  };




const Partenaires = () => {

    
    const [filteredPart, setFilteredPart] = useState(
        []
       );
  const [partenaires, setPartenaires] = useState([]);
  const fetchPartenaire = () => {
    Axios.get("http://localhost:5000/partenaires")
      .then((response) => {
        setPartenaires(response.data);
        setFilteredPart({ data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchPartenaire();
  }, []);
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  const [userType, setUserType] = useState(localStorage.getItem("role"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const authenticated = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(authenticated);
    const role = localStorage.getItem("role");
    setUserType(role);
  }, []);
  return (
    <>
      <div className="h-screen w-screen">
        <NavBar />
        <div className="flex">
          <SideBar />
          <Stack spacing={0.25} direction="column" width="84%" className={classes.stackList}>
            
            <div>
          <Button
             variant="contained"
             color = "primary"
            startIcon={<Add />}
            className={classes.button}
           onClick={() => navigate('/addPartenaire')}
              >
                 Ajouter partenaire
           </Button>
            </div>
    
          <Grid container spacing={4} className={classes.gridContainer}>
          <Grid item xs={12} >
            <MUIDataTable
              title=<div style={{ fontFamily: "poppins", fontSize: 30, fontWeight:"bold" }}>Partenaires</div>
              data={filteredPart.data}
              columns={columns}
              options={options}
              className={classes.dataTable}
            />
          </Grid>
        </Grid>


        </Stack>


        </div>
      </div>
      <SpeedDial />
    </>
  );
};

export default Partenaires;