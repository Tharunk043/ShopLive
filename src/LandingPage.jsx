import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Info, Mail, Phone, MapPin, Rocket } from "lucide-react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from "@mui/material";

const slides = [
  {
    title: "Real-Time Orders",
    subtitle: "Track every order live with instant updates",
    image:
      "https://img.businessoffashion.com/resizer/v2/RPIJFAIDLBA3FPTMZW5EAXDJTE.png?auth=2a5a3e2ac0df4995abc1ecf86c5323de3d6e1465a04ae29de1401f03b57416e2&width=1440"
  },
  {
    title: "Smart Shopping",
    subtitle: "Personalized deals powered by AI",
    image:
      "https://img.freepik.com/free-photo/two-hugging-woman-with-paper-bags_23-2147688807.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    title: "Exclusive Offers",
    subtitle: "Save more with daily flash sales",
    image:
      "https://www.beyoung.in/mobile/images/locations/Plain-tshirt-mobile-view.jpg"
  }
];

export default function LandingPage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", color: "white", bgcolor: "#020617" }}>
      {/* ===================== */}
      {/* NAVBAR */}
      {/* ===================== */}
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(2,6,23,0.8)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
        }}
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            🛍️ ShopLive
          </Typography>

          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>

          <Button color="inherit" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* ===================== */}
      {/* HERO SECTION */}
      {/* ===================== */}
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          overflow: "hidden"
        }}
      >
        {/* Background Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${slides[index].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        </AnimatePresence>

        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)"
          }}
        />

        {/* Hero Content */}
        <Container
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[index].title}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h2" gutterBottom>
                {slides[index].title}
              </Typography>
              <Typography variant="h6" mb={4}>
                {slides[index].subtitle}
              </Typography>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2, borderRadius: 3 }}
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "white",
                borderColor: "white",
                borderRadius: 3
              }}
              onClick={() => navigate("/register")}
            >
              Learn More
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* ===================== */}
      {/* 🌟 ABOUT SECTION */}
      {/* ===================== */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(180deg, #020617, #020617)",
          color: "white"
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              textAlign="center"
              mb={6}
              sx={{ fontWeight: "bold" }}
            >
              🚀 About ShopLive
            </Typography>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)"
              },
              gap: 4
            }}
          >
            {[
              {
                icon: <Rocket size={40} />,
                title: "Fast & Real-Time",
                text:
                  "Track your orders in real-time with blazing-fast updates powered by modern cloud infrastructure."
              },
              {
                icon: <Info size={40} />,
                title: "Smart Shopping",
                text:
                  "AI-powered recommendations help you discover products you’ll love — every time you visit."
              },
              {
                icon: <Mail size={40} />,
                title: "Secure Platform",
                text:
                  "We use enterprise-grade security, JWT authentication, and encrypted data storage."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -10 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 4,
                    background: "rgba(15,23,42,0.75)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow:
                      "0 20px 40px rgba(0,0,0,0.6)",
                    textAlign: "center"
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      color: "#22c55e",
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={1}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{ color: "#94a3b8" }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===================== */}
      {/* 📞 CONTACT SECTION */}
      {/* ===================== */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(180deg, #020617, #020617)",
          color: "white"
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              textAlign="center"
              mb={6}
              sx={{ fontWeight: "bold" }}
            >
              📬 Contact Us
            </Typography>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)"
              },
              gap: 4
            }}
          >
            {[
              {
                icon: <Mail size={28} />,
                title: "Email",
                value: "support@shoplive.com"
              },
              {
                icon: <Phone size={28} />,
                title: "Phone",
                value: "+91 98765 43210"
              },
              {
                icon: <MapPin size={28} />,
                title: "Location",
                value: "Bangalore, India"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -8 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    textAlign: "center",
                    background:
                      "rgba(15,23,42,0.75)",
                    backdropFilter: "blur(20px)",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    boxShadow:
                      "0 20px 40px rgba(0,0,0,0.6)"
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                      color: "#38bdf8"
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography fontWeight="bold">
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{ color: "#94a3b8" }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
