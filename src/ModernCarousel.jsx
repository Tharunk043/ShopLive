import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography } from "@mui/material";

export default function ModernGlassCarousel({ slides = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(id);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        height: { xs: 240, md: 360 },
        mb: 5,
        background: "#0b0d10"
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* IMAGE */}
          <motion.img
            src={slides[index].image}
            alt={slides[index].title}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          {/* GLASS CAPTION */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)"
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                width: "100%",
                padding: "24px 28px",
                backdropFilter: "blur(8px)",
                background: "rgba(0,0,0,0.25)"
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                color="white"
                mb={0.5}
              >
                {slides[index].title}
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 520 }}
              >
                {slides[index].subtitle}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* PROGRESS BAR */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          bgcolor: "rgba(255,255,255,0.15)"
        }}
      >
        <motion.div
          key={index}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          style={{
            height: "100%",
            background: "white"
          }}
        />
      </Box>

      {/* CLICK ZONES */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr"
        }}
      >
        <Box onClick={() =>
          setIndex((i) => (i - 1 + slides.length) % slides.length)
        } />
        <Box onClick={() =>
          setIndex((i) => (i + 1) % slides.length)
        } />
      </Box>
    </Box>
  );
}
