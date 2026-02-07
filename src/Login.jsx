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

    const decoded = jwtDecode(data.accessToken);
    const roles = decoded.roles || [];

    onLogin();

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
      const res = await fetch(
        "https://demo-springboot-zdym.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, password })
        }
      );

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
      const res = await fetch(
        "https://demo-springboot-zdym.onrender.com/auth/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential })
        }
      );

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
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            borderRadius: 28,
            padding: 42,
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)"
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            color="white"
            mb={1}
          >
            ShopLive
          </Typography>

          <Typography
            align="center"
            color="rgba(255,255,255,0.7)"
            mb={4}
          >
            Sign in to continue shopping
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

          <Divider sx={{ my: 3, color: "rgba(255,255,255,0.3)" }}>
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
              sx={{
                input: { color: "white" },
                label: { color: "rgba(255,255,255,0.7)" }
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                input: { color: "white" },
                label: { color: "rgba(255,255,255,0.7)" }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                fullWidth
                disabled={loading}
                type="submit"
                variant="contained"
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, #00c6ff, #0072ff)",
                  boxShadow: "0 10px 30px rgba(0,114,255,0.5)"
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </Container>
    </Box>
  );
}
