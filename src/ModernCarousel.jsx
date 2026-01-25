import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography } from "@mui/material";

export default function ModernCarousel({ slides = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        height: { xs: 240, md: 340 },
        mb: 4,
        boxShadow: "0 40px 100px rgba(34,197,94,0.35)"
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Box
            component="img"
            src={slides[index].image}
            alt={slides[index].title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7)"
            }}
          />

          {/* FLOATING TEXT */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              bottom: 40,
              left: 40,
              color: "white"
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                textShadow: "0 0 20px rgba(34,197,94,0.9)"
              }}
            >
              {slides[index].title}
            </Typography>
            <Typography sx={{ color: "#e5e7eb" }}>
              {slides[index].subtitle}
            </Typography>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* DOTS */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          display: "flex",
          gap: 1
        }}
      >
        {slides.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              cursor: "pointer",
              bgcolor:
                i === index
                  ? "#22c55e"
                  : "rgba(255,255,255,0.4)",
              transition: "0.3s"
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
