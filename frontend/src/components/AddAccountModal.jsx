import { Alert, Box, Snackbar, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { postAccount } from '../features/accounts/accountService';

const AddAccountModal = (props) => {
    const [alert, setAlert] = useState({ open: false, message: "", status: "" });
    const [name, setName] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await postAccount(name);
            setAlert({
				open: true,
				message: response.message,
				status: "success",
			});

            setName("");
            props.accounts();
            props.onClose();
        } catch (error) {
            setAlert({
				open: true,
				message: error.response?.data.message,
				status: "error",
			});
            console.log(error.response?.data.message);
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth maxWidth="sm"
        >
            <DialogTitle id="alert-dialog-title">{"Hesap Aç"}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="Hesap Adı" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                </Box>
            </DialogContent>
            <DialogActions>
            <Button onClick={props.onClose}>İptal</Button>
            <Button onClick={handleSubmit} autoFocus>Hesap Aç</Button>
            </DialogActions>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={alert.open}
                autoHideDuration={5000}
                onClose={() => setAlert({ open: false, message: "", status: "" })}
			>
                <Alert severity={alert.status || "info"}>{alert.message}</Alert>
            </Snackbar>
        </Dialog>
    )
}

export default AddAccountModal