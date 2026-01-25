import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API = "https://demo-springboot-zdym.onrender.com/admin";

// =============================
// HELPERS
// =============================
function getOrderId(o) {
  return o.id;
}

function formatDate(d) {
  if (!d) return "N/A";
  const date = new Date(d);
  return isNaN(date) ? "N/A" : date.toLocaleString();
}

export default function Admin() {
  // =============================
  // STATE
  // =============================
  const [stats, setStats] = useState({ customers: 0, orders: 0, products: 0 });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ADD PRODUCT STATE
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pImage, setPImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  // =============================
  // TOKEN SYNC
  // =============================
  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("accessToken"));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // =============================
  // HELPERS
  // =============================
  function logout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  async function safeFetch(url, options = {}) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.headers || {})
        }
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        return null;
      }

      return res;
    } catch {
      alert("Server unreachable");
      return null;
    }
  }

  // =============================
  // LOAD DATA
  // =============================
  useEffect(() => {
    if (!token) return;
    loadStats();
    loadCustomers();
    loadProducts();
  }, [token]);

  async function loadStats() {
    const res = await safeFetch(`${API}/stats`);
    if (res) setStats(await res.json());
  }

  async function loadCustomers() {
    const res = await safeFetch(`${API}/customers`);
    if (res) setCustomers(await res.json());
  }

  async function loadProducts() {
    const res = await safeFetch(`${API}/products`);
    if (res) setProducts(await res.json());
  }

  // =============================
  // CUSTOMER ACTIONS
  // =============================
  async function viewOrders(customerId) {
    const res = await safeFetch(
      `${API}/customers/${customerId}/orders`
    );
    if (!res) return;

    setOrders(await res.json());
    setSelectedCustomer(customerId);
  }

  async function deleteCustomer(id) {
    if (!window.confirm("Delete customer and ALL orders?")) return;

    const res = await safeFetch(
      `${API}/customers/${id}`,
      { method: "DELETE" }
    );

    if (!res) return;

    loadCustomers();
    loadStats();
  }

  // =============================
  // ORDER ACTIONS
  // =============================
  async function updateStatus(orderId, status) {
    const res = await safeFetch(
      `${API}/orders/${orderId}/status?status=${status}`,
      { method: "PUT" }
    );

    if (!res) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    );
  }

  async function deleteOrder(orderId) {
    if (!window.confirm("Delete this order?")) return;

    const res = await safeFetch(
      `${API}/orders/${orderId}`,
      { method: "DELETE" }
    );

    if (!res) return;

    setOrders((prev) =>
      prev.filter((o) => o.id !== orderId)
    );

    loadStats();
  }

  // =============================
  // PRODUCT ACTIONS
  // =============================
  async function addProduct() {
    if (!pName || !pPrice || !pImage) {
      alert("Name, price and image required");
      return;
    }

    const form = new FormData();
    form.append("name", pName);
    form.append("description", pDesc);
    form.append("price", pPrice);
    form.append("image", pImage);

    setUploading(true);
    const res = await safeFetch(
      `${API}/products/upload`,
      { method: "POST", body: form }
    );
    setUploading(false);

    if (!res) return;

    setPName("");
    setPDesc("");
    setPPrice("");
    setPImage(null);

    loadProducts();
    loadStats();
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete product?")) return;

    const res = await safeFetch(
      `${API}/products/${id}`,
      { method: "DELETE" }
    );

    if (!res) return;

    loadProducts();
    loadStats();
  }

  // =============================
  // UI
  // =============================
  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#020617", color: "white" }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">🛠 Admin Dashboard</Typography>
        <Button color="error" variant="contained" onClick={logout}>
          Logout
        </Button>
      </Box>

      {/* STATS */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: "Customers", value: stats.customers },
          { label: "Orders", value: stats.orders },
          { label: "Products", value: stats.products }
        ].map((s) => (
          <Grid item xs={12} md={4} key={s.label}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card sx={{ bgcolor: "#0f172a", p: 3 }}>
                <Typography color="#94a3b8">{s.label}</Typography>
                <Typography variant="h3">{s.value}</Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* ADD PRODUCT */}
      <Typography variant="h5" mb={2}>➕ Add Product</Typography>
      <Card sx={{ bgcolor: "#0f172a", p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Name" value={pName}
              onChange={(e) => setPName(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Description" value={pDesc}
              onChange={(e) => setPDesc(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth type="number" label="Price" value={pPrice}
              onChange={(e) => setPPrice(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button component="label" variant="outlined">
              Upload Image
              <input hidden type="file"
                onChange={(e) => setPImage(e.target.files[0])} />
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained"
              disabled={uploading}
              onClick={addProduct}>
              {uploading ? "Uploading..." : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* CUSTOMERS */}
      <Typography variant="h5" mb={2}>👥 Customers</Typography>
      <Card sx={{ bgcolor: "#0f172a", mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell sx={{ color: "white" }}>{c.name}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => viewOrders(c.id)}>
                    Orders
                  </Button>
                  <Button size="small" color="error"
                    onClick={() => deleteCustomer(c.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* PRODUCTS */}
      <Typography variant="h5" mb={2}>📦 Products</Typography>
      <Grid container spacing={3} mb={4}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card sx={{ bgcolor: "#0f172a", p: 2 }}>
              <img
                src={`data:image/jpeg;base64,${p.image}`}
                alt={p.name}
                style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10 }}
              />
              <Typography mt={1}>{p.name}</Typography>
              <Typography color="#94a3b8">₹{p.price}</Typography>
              <Button fullWidth color="error"
                onClick={() => deleteProduct(p.id)}>
                Delete
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ORDERS MODAL */}
      <Dialog open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        fullWidth maxWidth="md">
        <DialogTitle>Customer Orders</DialogTitle>
        <DialogContent>
          {orders.map((o) => (
            <Card key={o.id}
              sx={{ mb: 2, p: 2, bgcolor: "#1e293b" }}>
              <Typography><b>Product:</b> {o.name}</Typography>
              <Typography><b>Qty:</b> {o.count}</Typography>
              <Typography><b>Price:</b> ₹{o.price}</Typography>
              <Typography><b>Date:</b> {formatDate(o.createdAt)}</Typography>

              <Box mt={2} display="flex" gap={2}>
                <Select value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  sx={{ minWidth: 160 }}>
                  <MenuItem value="PLACED">PLACED</MenuItem>
                  <MenuItem value="SHIPPED">SHIPPED</MenuItem>
                  <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                </Select>

                <Button color="error" variant="contained"
                  onClick={() => deleteOrder(o.id)}>
                  Delete Order
                </Button>
              </Box>
            </Card>
          ))}

          {orders.length === 0 && (
            <Typography color="#94a3b8">
              No orders found for this customer
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
