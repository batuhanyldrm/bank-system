import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Stack, Container, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ArrowUpward, ArrowDownward, Person, TrendingUp, TrendingDown, Assessment } from '@mui/icons-material';
import { getTransactions } from '../../features/transactions/transactionService';
import { useParams } from 'react-router';
import AddTransactionModal from '../../components/AddTransactionModal';

export default function TransactionDetail() {

  const { id } = useParams();
  const [data, setData] = useState([]);
  const [type, setType] = useState("All");
  const [schedule, setSchedule] = useState("");

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const transactions = async () => {
    try {
      const data = await getTransactions(id);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    console.log("TransactionDetail: componentDidMount");
    transactions();

    return () => {
      console.log("TransactionDetail: componentWillUnmount");
    }
  }, [])
  
  const totalIncoming = data
    .filter(data => data.direction === 'IN' && data.status === 'SUCCESS')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalOutgoing = data
    .filter(data => data.direction === 'OUT' && data.status === 'SUCCESS')
    .reduce((sum, data) => sum + Number(data.amount), 0);

  const getStatusColor = (status) => {
    switch(status) {
      case 'SUCCESS': 
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'SUCCESS':
        return 'Tamamlandı';
      case 'FAILED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  function isoToDate(isoDateTimeFormat) {
    let date = new Date(Date.parse(isoDateTimeFormat));
    return ('00' + date.getDate()).slice(-2) + '.' + ('00' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
  }

  function isoToTime(isoDateTimeFormat) {
    let date = new Date(Date.parse(isoDateTimeFormat));
    return ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
  }

  return (
    <>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">Transfer Geçmişi</Typography>
        <Button variant="contained" startIcon={<ArrowUpward />} onClick={handleOpenAddModal}>Yeni Transfer</Button>
      </Box>
      <Grid container spacing={3}  sx={{ mb: 4 }}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#d32f2f', width: 56, height: 56 }}>
                  <TrendingDown fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">Toplam Giden</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#d32f2f">
                    ₺{totalOutgoing.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card  elevation={3} sx={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#388e3c', width: 56, height: 56 }}>
                  <TrendingUp fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">Toplam Gelen</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#388e3c">
                    ₺{totalIncoming.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  <Assessment fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">Toplam İşlem</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#1976d2">{data.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}  sx={{ mb: 6 }}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl variant="filled" fullWidth sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Tip</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={type}
              onChange={handleTypeChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"All"}>Hepsi</MenuItem>
              <MenuItem value={"IN"}>Gelen</MenuItem>
              <MenuItem value={"OUT"}>Giden</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl variant="filled" fullWidth sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">Süre</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={schedule}
              onChange={handleScheduleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Son 7 Gün</MenuItem>
              <MenuItem value={20}>Son 15 Gün</MenuItem>
              <MenuItem value={30}>Bu Ay</MenuItem>
              <MenuItem value={30}>Son 3 Ay</MenuItem>
              <MenuItem value={30}>Son 6 Ay</MenuItem>
              <MenuItem value={30}>Bu Yıl</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><Typography fontWeight="bold">Tip</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Gönderen/Alıcı</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">IBAN</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Tutar</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Tarih/Saat</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Açıklama</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">Durum</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data) => (
              <TableRow 
                key={data.id}
                hover
                sx={{ 
                  '&:hover': { bgcolor: '#fafafa' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Chip
                    icon={data.direction === 'OUT' ? <ArrowUpward /> : <ArrowDownward />}
                    label={data.direction === 'OUT' ? 'Giden' : 'Gelen'}
                    color={data.direction === 'OUT' ? 'error' : 'success'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2' }}>
                      <Person fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">{data.direction === 'IN' ? data.senderUsername : data.receiverUsername}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" fontFamily="monospace">{data.direction === 'IN' ? data.fromAccountNumber : data.toAccountNumber}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" fontWeight="bold" color={data.direction === 'OUT' ? 'error.main' : 'success.main'}>
                    {data.direction === 'OUT' ? '-' : '+'}₺{parseFloat(data.amount).toLocaleString('tr-TR')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">{isoToDate(data.transactionDate)}</Typography>
                  <Typography variant="caption" color="text.secondary">{isoToTime(data.transactionDate)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{data.description || "-"}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip label={getStatusText(data.status)} color={getStatusColor(data.status)} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary"> Toplam {data.length} işlem gösteriliyor</Typography>
      </Box>
    </Container>
    <AddTransactionModal
      open={openAddModal}
      onClose={handleCloseAddModal}
      transactions={transactions}
    />
    </>
  );
}