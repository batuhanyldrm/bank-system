import { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getAccounts } from '../../features/accounts/accountService'
import { Link } from 'react-router';

const Accounts = () => {

  const [data, setData] = useState([]);

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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Hesap Adı</TableCell>
            <TableCell align="right">Hesap Numarası</TableCell>
            <TableCell align="right">Hesap Bakiyesi</TableCell>
            <TableCell align="right">İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((data) => (
            <TableRow key={data.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{data.name}</TableCell>
              <TableCell align="right">{data.number}</TableCell>
              <TableCell align="right">{data.balance}</TableCell>
              <TableCell align="right"><Link to={`/transaction-detail/${data.id}`}><VisibilityIcon color="primary" /></Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Accounts