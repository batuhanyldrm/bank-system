import * as React from "react";
import { Container, Box, Avatar, Typography, TextField, Button, CssBaseline } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Giriş Yap</Typography>
        <Box component="form" onSubmit={""} sx={{ mt: 3 }}>
          <TextField autoComplete="email" autoFocus fullWidth id="email" label="E-posta Adresi" margin="normal" name="email" required />
          <TextField autoComplete="current-password" fullWidth id="password" label="Şifre" margin="normal" name="password" required type="password" />
          <Button fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">Giriş Yap</Button>
        </Box>
      </Box>
    </Container>
  );
}