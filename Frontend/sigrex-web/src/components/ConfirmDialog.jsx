import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, makeStyles } from '@material-ui/core'
import { NotListedLocation } from '@mui/icons-material';
import React from 'react'

const useStyles= makeStyles(theme=>({
    dialog:{
        padding: theme.spacing(2)
    },
    dialogContext:{
        textAlign: 'center'
    },
    dialogAction:{ 
        justifyContent:'center'
    },
    titleIcon:{
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.main
   ,
    '&: hover':{
        backgroundColor: theme.palette.secondary.light,
        cursor: 'default'
    },
    '& .MuiSvgIcon-root':{
        fontSize: '8rem',
    } },
    dialogTitle:{
        textAlign: 'center'
    }
}))


export default function ConfirmDialog(props){
    const { confirmDialog, setConfirmDialog} = props;
    const classes = useStyles()
    return(
        <Dialog open={confirmDialog.isOpen} classes={{paper:classes.dialog}}>
            <DialogTitle className={classes.dialogTitle}>
                   <IconButton disableRipple className={classes.titleIcon}>
                        <NotListedLocation/>
                    </IconButton>
            </DialogTitle>
            <DialogContent classesName={classes.dialogContext}>
                <Typography variant="h6">
                    
                    {confirmDialog.title}
                    
                    
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>

            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Button variant="contained" color="default"  type="button" onClick={()=>setConfirmDialog({...confirmDialog, isOpen:false })} >Annuler</Button>
                <Button variant="contained"color="secondary" type="button" onClick={confirmDialog.onConfirm}>Supprimer</Button>

            </DialogActions >
        </Dialog>
    )
}   