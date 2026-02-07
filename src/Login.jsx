import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Typewriter from "typewriter-effect";

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
    navigate(roles.includes("ROLE_ADMIN") ? "/admin" : "/shopping", {
      replace: true
    });
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
    <Box sx={{ minHeight: "100vh", position: "relative", bgcolor: "#0b0d10" }}>
      {/* 🌌 Particle Background */}
      <Particles
        init={loadSlim}
        options={{
          background: { color: "#0b0d10" },
          particles: {
            number: { value: 40 },
            size: { value: 1 },
            opacity: { value: 0.3 },
            move: { enable: true, speed: 0.2 },
            links: {
              enable: true,
              opacity: 0.15,
              distance: 150
            }
          }
        }}
        style={{ position: "absolute" }}
      />

      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            borderRadius: 20,
            padding: 40,
            width: "100%",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          {/* ⌨️ Typing animation */}
          <Typography
            variant="h4"
            color="white"
            fontWeight={600}
            align="center"
            mb={1}
          >
            <Typewriter
              options={{
                strings: ["Welcome back.", "ShopLive Login"],
                autoStart: true,
                loop: true,
                delay: 60
              }}
            />
          </Typography>

          <Typography
            align="center"
            color="rgba(255,255,255,0.6)"
            mb={3}
          >
            Continue your experience
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
            />
          </Box>

          <Divider sx={{ my: 3, opacity: 0.2 }}>OR</Divider>

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
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />

            {/* 🎯 Button click animation */}
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                fullWidth
                type="submit"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.4,
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: "white",
                  color: "black",
                  "&:hover": { bgcolor: "#e5e5e5" }
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
