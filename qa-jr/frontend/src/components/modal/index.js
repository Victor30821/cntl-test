import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
    return {
        top: `50%`,
        left: `50%`,
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: `translate(-50%, -50%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 435,
        height: 200,
        borderRadius: 5,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        display: 'flex',
        justifyContent: 'center',
        fontSize: 13,
        color: '#838383',
        alignItems: 'center'
    },
}));


export default function UIModal({ header, open, setOpen, setStatusSuccess = () => { }, ...options }) {
    const classes = useStyles();
    const [modalStyle] = React.useState({ ...getModalStyle() , ...options});
    return (
        <Modal
            onBackdropClick={() => setStatusSuccess(false)}
            onEscapeKeyDown={() => setStatusSuccess(false)}
            open={open}
            disableBackdropClick={options?.disableBackdropClick || false}
            onClose={() => setOpen(open => open = false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                {header}
            </div>
        </Modal>
    )
}
