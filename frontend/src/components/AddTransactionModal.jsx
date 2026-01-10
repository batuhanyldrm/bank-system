import { Alert, Box, Snackbar, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { postTransaction } from '../features/transactions/transactionService';
import { useParams } from 'react-router';

const AddTransactionModal = (props) => {
    const { id } = useParams();

    const [alert, setAlert] = useState({ open: false, message: "", status: "" });
    const [toAccountNumber, setToAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await postTransaction(id, toAccountNumber, amount, description);
            setAlert({
				open: true,
				message: response.message,
				status: "success",
			});

            setToAccountNumber("");
            setAmount("");
            setDescription("");
            props.transactions();
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
            <DialogTitle id="alert-dialog-title">{"Para Transferi"}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="Yollanacak Hesap Numarası" variant="outlined" value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)} fullWidth />
                    <TextField id="outlined-basic" label="Tutar" variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
                    <TextField id="outlined-basic" label="Açıklama" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                </Box>
            </DialogContent>
            <DialogActions>
            <Button onClick={props.onClose}>İptal</Button>
            <Button onClick={handleSubmit} autoFocus>Transfer Et</Button>
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

export default AddTransactionModal