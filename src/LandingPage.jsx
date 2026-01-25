import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
    <Box sx={{ minHeight: "100vh", color: "white" }}>
      {/* Navbar */}
      <AppBar
        position="absolute"
        sx={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            ShopLive
          </Typography>

          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>

          <Button color="inherit" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
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
              sx={{ color: "white", borderColor: "white", borderRadius: 3 }}
              onClick={() => navigate("/register")}
            >
              Learn More
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
