import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Axios from "axios";
import SpeedDial from "../components/SpeedDial";
import MUIDataTable from "mui-datatables";
import Stack from '@mui/material/Stack';
import { makeStyles } from "@material-ui/core/styles";
import { Add, AddAPhoto } from "@material-ui/icons";

import { Button, Grid ,Popover, IconButton } from "@material-ui/core";

import { useLocation, useNavigate } from "react-router-dom";


import {
  Box,
  Paper,
  Rating,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";

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
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Nom</div>,
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
    name: "prenom",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Prenom</div>,
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
    name: "specialite",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Specialité</div>,
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
    name: "fonction",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Fonction</div>,
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
    name: "diplome",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Diplome</div>,
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
    name: "cv_path",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>CV (PDF)</div>,
    options: {
      filter: true,
      sort: true,
      search: true, // Enable search for this column
      customBodyRender: (value, tableMeta, updateValue) => {
        const handleClick = (pdfFile) => {
            window.open(pdfFile, "_blank");
          };
        return <button
                                  className="bg-white text-[#00457E] border-[#00457E] border border-1/2 hover:bg-[#013E70] hover:text-white hover:shadow-sm  text-[12px]  hover:border-[#013E70]  uppercase  px-4 py-2 rounded shadow  outline-none focus:outline-none mr-1 mb-1"
                                  type="button"
                                  onClick={() => {
                                    handleClick(
                                      `http://localhost:5000/${value}`
                                    );
                                  }}
                                >
                                  Consulter CV
                                </button>;
      },
    },
  },
  {
    name: "evaluer",
    label: <div style={{ fontFamily: "poppins", fontSize: 19, color: 'grey'}}>Evaluation</div>,
    options: {
      filter: true,
      sort: true,
      search: true, // Enable search for this column
      customBodyRender: (value, tableMeta, updateValue) => {

        
        
        return <Rating name="half-rating" defaultValue={0} precision={0.5}
        />;
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








  const Formateurs = () => {
    const [formateurs, setFormateurs] = useState([]);
    const [ratingValues, setRatingValues] = useState({});
    const [storedRatings, setStoredRatings] = useState({});
    

    const userId = localStorage.getItem("userId"); // Step 1
    console.log(userId);
  
    const classes = useStyles();
  
    const fetchFormateurs = () => {
      Axios.get("http://localhost:5000/formateurs")
        .then((response) => {
          // Get the stored ratings from localStorage
          const storedRatings = JSON.parse(localStorage.getItem("userRatings")) || {};
    
          const initialRatingValues = {};
          response.data.forEach((formateur) => {
            // Use the stored rating if available, or default to 0
            initialRatingValues[formateur.formateurId] = storedRatings[formateur.formateurId] || 0;
          });
    
          setRatingValues(initialRatingValues);
          setFormateurs({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    useEffect(() => {
      fetchFormateurs();
    }, []);
  
    const handleRatingChange = (formateurId, newValue) => {
      // Step 2: Use getUserIdByPartenaireId endpoint to get partenaireId
      Axios.get(`http://localhost:5000/getPartenaireIdByUserId/${userId}`)
        .then((response) => {
          const partenaireId = response.data.partenaireId;
          // Step 3: Use addEvaluationFormateur endpoint to submit the rating
          Axios.post("http://localhost:5000/addEvaluationFormateur", {
            formateurId,
            partenaireId,
            evaluation: newValue,
          })
            .then((result) => {
              console.log("Rating submitted successfully");
            })
            .catch((error) => {
              console.error("Error submitting rating:", error);
            });
        })
        .catch((error) => {
          console.error("Error getting partenaireId:", error);
        });
  
      // Update the ratingValues state for the specific formateurId
      setRatingValues((prevValues) => ({
        ...prevValues,
        [formateurId]: newValue,
      }));

      // Update the local storage to persist ratings
      const updatedRatings = {
         ...JSON.parse(localStorage.getItem("userRatings")) || {},
        [formateurId]: newValue,
        };
       localStorage.setItem("userRatings", JSON.stringify(updatedRatings));
       setStoredRatings(updatedRatings);
       



    };
  
    const columnsWithRating = columns.map((column) => {
      if (column.name === 'evaluer') {
        return userId ? {  // Check if userId is not null
          ...column,
          options: {
            ...column.options,
            customBodyRender: (value, tableMeta, updateValue) => {
              const formateurId = formateurs.data[tableMeta.rowIndex].formateurId;
  
              return (
                <Rating
                  name={`rating-${formateurId}`}
                  value={ratingValues[formateurId]}
                  precision={0.5}
                  onChange={(event, newValue) => handleRatingChange(formateurId, newValue)}
                />
              );
            },
          },
        } : null;  // If userId is null, exclude the "evaluer" column
      }
      return column;
    }).filter(Boolean);  // Remove null values from the array




  return (
    <>
      <div className="h-screen w-screen">
        <NavBar />
        <div className="flex">
          <SideBar />
          
          <Stack spacing={0.25} direction="column" width="84%" className={classes.stackList}>
            
    
    
          <Grid container spacing={4} className={classes.gridContainer}>
          <Grid item xs={12} >
            <MUIDataTable
              title=<div style={{ fontFamily: "poppins", fontSize: 30, fontWeight:"bold" }}>Formateurs</div>
              data={formateurs.data}
              columns={columnsWithRating}
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

export default Formateurs;
