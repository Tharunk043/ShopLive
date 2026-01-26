import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

// =============================
// DASHBOARD
// =============================
export default function Dashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [images, setImages] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const STATUS_FLOW = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

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
            onClick={() => setSelectedOrder(o)}
            style={styles.card}
          >
            <img
              src={
                images[o.productId] ||
                `${import.meta.env.VITE_API_BASE_URL}/products/${o.productId}/image`
              }
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

      {/* =============================
          POPUP MODAL
      ============================== */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={styles.modal}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <button
                style={styles.close}
                onClick={() => setSelectedOrder(null)}
              >
                ✖
              </button>

              <h2>📦 Order Tracking</h2>

              {/* STATUS TRACKER */}
<div style={styles.tracker}>
  {STATUS_FLOW.map((step, i) => {
    const currentIndex = STATUS_FLOW.indexOf(
      selectedOrder.status || "PLACED"
    );

    const active = currentIndex >= i;
    const lineActive = currentIndex > i;

    return (
      <div key={step} style={styles.step}>
        {/* CIRCLE */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{
            scale: active ? 1.2 : 1,
            backgroundColor: active ? "#22c55e" : "#334155"
          }}
          transition={{ type: "spring", stiffness: 300 }}
          style={styles.circle}
        />

        <span style={{ fontSize: "0.8rem" }}>{step}</span>

        {/* LINE */}
        {i < STATUS_FLOW.length - 1 && (
          <div style={styles.lineBase}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: lineActive ? "100%" : "0%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={styles.lineFill}
            />
          </div>
        )}
      </div>
    );
  })}
</div>


              {/* ORDER DETAILS */}
              <div style={styles.details}>
                <p>
                  <b>Order ID:</b> {selectedOrder.id}
                </p>
                <p>
                  <b>Product:</b> {selectedOrder.name}
                </p>
                <p>
                  <b>Quantity:</b> {selectedOrder.count}
                </p>
                <p>
                  <b>Price:</b> ₹{selectedOrder.price}
                </p>
                <p>
                  <b>Status:</b> {selectedOrder.status || "PLACED"}
                </p>
                <p>
                  <b>Ordered On:</b>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    transition: "0.3s",
    cursor: "pointer"
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
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },
  modal: {
    background: "#020617",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    maxWidth: 500,
    boxShadow: "0 30px 80px rgba(0,0,0,0.8)"
  },
  close: {
    float: "right",
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer"
  },
  tracker: {
    display: "flex",
    justifyContent: "space-between",
    margin: "30px 0"
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    flex: 1
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    marginBottom: 5
  },
  line: {
    position: "absolute",
    top: 8,
    left: "50%",
    width: "100%",
    height: 4,
    zIndex: -1
  },
  details: {
    background: "#0f172a",
    padding: 20,
    borderRadius: 15
  },
  lineBase: {
  position: "absolute",
  top: 10,
  left: "50%",
  width: "100%",
  height: 4,
  background: "#334155",
  borderRadius: 5,
  overflow: "hidden"
},
lineFill: {
  height: "100%",
  background: "#22c55e",
  borderRadius: 5
}

};
