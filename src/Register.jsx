import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Typewriter from "typewriter-effect";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Divider
} from "@mui/material";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://demo-springboot-zdym.onrender.com/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", bgcolor: "#0b0d10" }}>
      {/* 🌌 Particles */}
      <Particles
        init={loadSlim}
        options={{
          background: { color: "#0b0d10" },
          particles: {
            number: { value: 40 },
            size: { value: 1 },
            opacity: { value: 0.3 },
            move: { enable: true, speed: 0.2 },
            links: { enable: true, opacity: 0.15, distance: 150 }
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
          initial={{ opacity: 0, y: 25 }}
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
          {/* ⌨️ Typing heading */}
          <Typography
            variant="h4"
            align="center"
            color="white"
            fontWeight={600}
            mb={1}
          >
            <Typewriter
              options={{
                strings: ["Create account.", "Join ShopLive"],
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
            It only takes a minute
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              margin="normal"
              value={form.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* 🎯 Click animation */}
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
                {loading ? <CircularProgress size={24} /> : "Create Account"}
              </Button>
            </motion.div>
          </Box>

          <Divider sx={{ my: 3, opacity: 0.2 }} />

          <Button
            fullWidth
            variant="text"
            sx={{ color: "rgba(255,255,255,0.7)" }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{ color: "rgba(255,255,255,0.5)" }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
}
