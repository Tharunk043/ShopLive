import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Alert
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function saveSession(data) {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("customerId", data.customerId);
  localStorage.setItem("username", data.username);
  console.log(data.username);
  const decoded = jwtDecode(data.accessToken);
  const roles = decoded.roles || [];

  onLogin();

  // 🔥 Role-based redirect
  if (roles.includes("ROLE_ADMIN")) {
    navigate("/admin", { replace: true });
  } else {
    navigate("/shopping", { replace: true });
  }
}


  async function handlePasswordLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://demo-springboot-zdym.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      await saveSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(credentialResponse) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://demo-springboot-zdym.onrender.com/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      await saveSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #020024, #090979, #000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            backdropFilter: "blur(25px)",
            background: "rgba(15,15,30,0.9)",
            padding: 40,
            borderRadius: 24,
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)"
          }}
        >
          <Typography variant="h4" align="center" color="white" mb={1}>
            ShopLive Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box display="flex" justifyContent="center" mb={3}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google Sign-In Failed")}
              theme="filled_black"
              size="large"
              width="300"
            />
          </Box>

          <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }}>
            OR
          </Divider>

          <form onSubmit={handlePasswordLogin}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />

            <Button
              fullWidth
              disabled={loading}
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </motion.div>
      </Container>
    </Box>
  );
}




