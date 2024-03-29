import { Button, makeStyles } from "@material-ui/core"
import React from "react"

const useStyles = makeStyles(theme=>({
    root: {
        minWidth:0,
        margin: theme.spacing(0.5)
    },
    secondary:{
        backgroundColor: theme.palette.secondary.light,
        '& .MuiButton-label': {
            color: theme.palette.secondary.main
        }
    },
    primary: {
        backgroundColor: theme.palette.light,
        '& .MuiButton-label': {
            color: theme.palette.secondary.main,
        }
    }
}))
export default function ActionButton(props){
    const classes= useStyles()

    const {color, children, onClick} =props
    return(
        
            <Button
            className={`${classes.root} ${classes[color]}`}
            onClick={onClick}>
                {children}

            </Button>

        


       
    )
}