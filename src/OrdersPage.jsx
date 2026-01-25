import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

function randomImage(seed) {
  return `https://picsum.photos/seed/order-${seed}/500/300`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadOrders() {
    try {
      setLoading(true);

      // 🔐 Secure endpoint (JWT subject used server-side)
      const res = await apiFetch("/customer/my/orders");

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data = await res.json();
      setOrders(data);
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("customerId");
    navigate("/login", { replace: true });
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" color="white">
          🧾 My Orders
        </Typography>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Refresh */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 100 }}
        onDragEnd={loadOrders}
      >
        <Button variant="contained" sx={{ mb: 3 }}>
          🔄 Slide Down to Refresh Orders
        </Button>
      </motion.div>

      {loading && (
        <Typography color="gray" mb={2}>
          Loading orders...
        </Typography>
      )}

      {/* Orders Grid */}
      <Grid container spacing={3}>
        {orders.map((o, index) => (
          <Grid item xs={12} md={4} key={o.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                elevation={12}
                sx={{
                  borderRadius: 4,
                  backdropFilter: "blur(10px)",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  overflow: "hidden"
                }}
              >
                <motion.img
                  src={randomImage(index)}
                  width="100%"
                  height="180"
                  style={{ objectFit: "cover" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  alt={o.name}
                />

                <CardContent>
                  <Typography variant="h6">
                    {o.name}
                  </Typography>

                  <Typography color="gray">
                    Quantity: {o.count}
                  </Typography>

                  <Typography color="gray">
                    Price: ₹{o.price}
                  </Typography>

                  <Typography color="gray">
                    Ordered At: {formatDate(o.createdAt)}
                  </Typography>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Chip
                      label={o.status || "PLACED"}
                      color="success"
                      size="small"
                    />

                    <Typography fontWeight="bold">
                      Total: ₹{(o.price * o.count).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {!loading && orders.length === 0 && (
          <Typography color="gray">
            No orders yet. Start shopping 🛒
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
