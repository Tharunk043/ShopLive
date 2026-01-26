import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

// =============================
// DASHBOARD
// =============================
export default function Dashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [images, setImages] = useState({}); // 🔥 productId -> imageURL
  const navigate = useNavigate();

useEffect(() => {
  loadOrders();

  const onFocus = () => loadOrders();
  window.addEventListener("focus", onFocus);

  return () => window.removeEventListener("focus", onFocus);
}, []);



  // =============================
  // LOAD PRODUCT IMAGE (JWT SAFE)
  // =============================
  async function loadProductImage(productId) {
    try {
      const res = await apiFetch(`/products/${productId}/image`);
      if (!res.ok) throw new Error();

      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch {
      return "https://picsum.photos/300/200";
    }
  }

  // =============================
  // LOAD ORDERS
  // =============================
  async function loadOrders() {
  try {
    const res = await apiFetch("/customer/my/orders");
    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    setOrders(data);

    setImages((prev) => {
      const updated = { ...prev };

      for (const o of data) {
        // Only fetch image if we don't already have it
        if (!updated[o.productId]) {
          loadProductImage(o.productId).then((url) => {
            setImages((curr) => ({
              ...curr,
              [o.productId]: url
            }));
          });
        }
      }

      return updated;
    });
  } catch {
    logout();
  }
}


  // =============================
  // LOGOUT
  // =============================
  function logout() {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  }

  // =============================
  // UI
  // =============================
  return (
    <div style={styles.page}>
      <button onClick={logout} style={styles.logout}>
        Logout
      </button>

      <h1>📦 My Orders</h1>

      <div style={styles.grid}>
        {orders.map((o) => (
          <motion.div
            key={o.id}
            whileHover={{ scale: 1.05 }}
            style={styles.card}
          >
            <img
  src={`${import.meta.env.VITE_API_BASE_URL}/products/${o.productId}/image`}
  alt={o.name}
  style={styles.img}
  loading="lazy"
/>


            <h3>{o.name}</h3>
            <p>Qty: {o.count}</p>
            <p>Price: ₹{o.price}</p>
            <p>
            Status:{" "}
            <span
              style={{
                color:
                  o.status === "DELIVERED"
                    ? "#22c55e"
                    : o.status === "SHIPPED"
                    ? "#38bdf8"
                    : o.status === "CANCELLED"
                    ? "#ef4444"
                    : "#f59e0b"
              }}
            >
              {o.status || "PLACED"}
            </span>
          </p>

            <p style={styles.date}>
              {new Date(o.createdAt).toLocaleString()}
            </p>
          </motion.div>
        ))}

        {orders.length === 0 && (
          <p style={{ color: "#94a3b8" }}>
            No orders yet. Start shopping 🛒
          </p>
        )}
      </div>
    </div>
  );
}

// =============================
// STYLES
// =============================
const styles = {
  page: {
    padding: 40,
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },
  logout: {
    float: "right",
    padding: "10px 20px",
    background: "crimson",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 20,
    marginTop: 30
  },
  card: {
    background: "#1e293b",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    transition: "0.3s"
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: 15,
    marginBottom: 10
  },
  date: {
    color: "#94a3b8",
    fontSize: "0.8rem"
  }
};
