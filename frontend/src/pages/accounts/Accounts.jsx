import { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import { getAccounts } from '../../features/accounts/accountService'
import { Link } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import AddAccountModal from '../../components/AddAccountModal';

const Accounts = () => {

  const [data, setData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const getAllAccounts = async () => {
    try {
      const data = await getAccounts()
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("Accounts: componentDidMount");
    getAllAccounts();

    return () => {
      console.log("Accounts: componentWillUnmount");
    }
  }, [])
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Hesaplarım</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddModal}>Hesap Ekle</Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Hesap Adı</TableCell>
              <TableCell align="right">Hesap Numarası</TableCell>
              <TableCell align="right">Hesap Bakiyesi</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data) => (
              <TableRow key={data.id} hover sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#fafafa' }}}>
                <TableCell component="th" scope="row">{data.name}</TableCell>
                <TableCell align="right">{data.number}</TableCell>
                <TableCell align="right">{data.balance}</TableCell>
                <TableCell align="right"><IconButton component={Link} to={`/transaction-detail/${data.number}`} color="primary" ><VisibilityIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddAccountModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        accounts={getAllAccounts}
      />
    </>
  )
}

export default Accounts