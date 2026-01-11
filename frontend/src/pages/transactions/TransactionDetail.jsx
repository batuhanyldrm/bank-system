import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Stack, Container, Grid, Button, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material';
import { ArrowUpward, ArrowDownward, Person, TrendingUp, TrendingDown, Assessment } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { getTransactions } from '../../features/transactions/transactionService';
import { useParams } from 'react-router';
import AddTransactionModal from '../../components/AddTransactionModal';

const limit = 10;

export default function TransactionDetail() {

  const { id } = useParams();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState({});
  const [type, setType] = useState("All");
  const [schedule, setSchedule] = useState("");
  const [page, setPage] = useState(1);

  const buildQueryParams = (page) => {
    const params = { page, limit };

    if (type && type !== "All") {
      params.filterDirection = type;
    }

    if (schedule) {
      params.period = schedule;
    }

    return params;
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const transactions = async (page = 1) => {
    try {
      const params = buildQueryParams(page);

      const response = await getTransactions(id, params);

      setData(response.data);
      setPagination(response.pagination);
      setSummary(response.summary);
      setPage(page);
    } catch (error) {
      console.log(error);
    }
  };

  const onPageChange = (event, value) => {
    setPage(value);
    transactions(value);
  }

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

  useEffect(() => {
    console.log("TransactionDetail: componentDidMount");
    setPage(1);
    transactions(1);

    return () => {
      console.log("TransactionDetail: componentWillUnmount");
    }
  }, [type, schedule])

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
                    ₺{Number(summary.totalOutgoing).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    ₺{Number(summary.totalIncoming).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  <Typography variant="h4" fontWeight="bold" color="#1976d2">{pagination.total}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}  sx={{ mb: 6 }}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <FormControl variant="filled" fullWidth sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Tip</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={type}
              onChange={handleTypeChange}
            >
              <MenuItem value={"All"}>Hepsi</MenuItem>
              <MenuItem value={"IN"}>Gelen</MenuItem>
              <MenuItem value={"OUT"}>Giden</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
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
              <MenuItem value={7}>Son 7 Gün</MenuItem>
              <MenuItem value={15}>Son 15 Gün</MenuItem>
              <MenuItem value={30}>Bu Ay</MenuItem>
              <MenuItem value={90}>Son 3 Ay</MenuItem>
              <MenuItem value={180}>Son 6 Ay</MenuItem>
              <MenuItem value={365}>Bu Yıl</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card elevation={3} sx={{ height: "100%", background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" }}>
            <CardContent sx={{ height: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}><AccountBalanceIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium" >Hesap Bakiyesi</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#1976d2">₺{Number(summary.balance).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
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
                    icon={data.filterDirection === 'OUT' ? <ArrowUpward /> : <ArrowDownward />}
                    label={data.filterDirection === 'OUT' ? 'Giden' : 'Gelen'}
                    color={data.filterDirection === 'OUT' ? 'error' : 'success'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2' }}>
                      <Person fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">{data.filterDirection === 'IN' ? data.senderUsername : data.receiverUsername}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" fontFamily="monospace">{data.filterDirection === 'IN' ? data.fromAccountNumber : data.toAccountNumber}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" fontWeight="bold" color={data.filterDirection === 'OUT' ? 'error.main' : 'success.main'}>
                    {data.filterDirection === 'OUT' ? '-' : '+'}₺{parseFloat(data.amount).toLocaleString('tr-TR')}
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
    <Stack spacing={2} useFlexGap>
        <Pagination style={{display: 'flex', justifyContent: 'space-around'}} count={Math.ceil(pagination.total / limit)} page={page} onChange={onPageChange} color="primary" />
      </Stack>
    <AddTransactionModal
      open={openAddModal}
      onClose={handleCloseAddModal}
      transactions={transactions}
    />
    </>
  );
}