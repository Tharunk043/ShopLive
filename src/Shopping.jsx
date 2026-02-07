import { useEffect, useMemo, useState } from "react";
import { motion,AnimatePresence } from "framer-motion";
import ModernCarousel from "./ModernCarousel";
import slide1 from "./assets/slide1.jpg";
import slide2 from "./assets/slide2.jpg";
import slide3 from "./assets//slide3.webp";
import { Menu } from "lucide-react";
import { Search } from "lucide-react";

import {
  LogOut,
  ShoppingCart,
  Star,
  List,
  Heart
} from "lucide-react";
import Confetti from "react-confetti";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Drawer,
  IconButton,
  Badge,
  Select,
  MenuItem,
  Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_PRODUCTS = "https://demo-springboot-zdym.onrender.com/products";
const API_ORDERS = "https://demo-springboot-zdym.onrender.com/orders";

const getId = (p) => p.id || p._id;

const clamp = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden"
};

export default function Shopping() {
  const [navOpen, setNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);


  const [username] = useState(localStorage.getItem("username"));
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [selected, setSelected] = useState(null);
  const [reviews, setReviews] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const slides = [
  {
    image:
      slide1,
    title: "Next-Gen Shopping",
    subtitle: "Smooth. Fast. Beautiful."
  },
  {
    image:
      slide2,
    title: "Premium Deals",
    subtitle: "Limited-time offers just for you"
  },
  {
    image:
      slide3,
    title: "Wishlist Magic",
    subtitle: "Save what you love, buy when ready"
  }
];


  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // =============================
  // LOAD PRODUCTS
  // =============================
  useEffect(() => {
    if (!token) return;

    fetch(API_PRODUCTS, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [token]);

  // =============================
  // FILTERING
  // =============================
  const categories = useMemo(() => {
    const set = new Set(["ALL"]);
    products.forEach((p) => set.add(p.category || "GENERAL"));
    return [...set];
  }, [products]);
  
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const text =
        `${p.name} ${p.description}`.toLowerCase();
      const matchText = text.includes(search.toLowerCase());
      const matchCat =
        category === "ALL" ||
        (p.category || "GENERAL") === category;

      return matchText && matchCat;
    });
  }, [products, search, category]);

  // =============================
  // CART
  // =============================
  const addToCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 0)
    }));
  };

  const totalItems = Object.values(cart).reduce(
    (a, b) => a + b,
    0
  );

  // =============================
  // WISHLIST
  // =============================
  function toggleWishlist(id) {
    setWishlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );
      return updated;
    });
  }
  async function submitReview(productId, text, stars) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `https://demo-springboot-zdym.onrender.com/reviews/${productId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text, stars })
    }
  );

  if (!res.ok) throw new Error("Review failed");

  const saved = await res.json();

  // 🔥 INSTANTLY UPDATE UI
  setReviews((prev) => ({
    ...prev,
    [productId]: [saved, ...(prev[productId] || [])]
  }));

  return saved;
}
function DeliveryAnimation() {
  return (
    <Box
      sx={{
        position: "relative",
        width: 220,
        height: 120,
        mx: "auto",
        mb: 3
      }}
    >
      {/* ROAD */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          height: 4,
          bgcolor: "#334155",
          overflow: "hidden"
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: "200%",
            height: "100%",
            background:
              "repeating-linear-gradient(90deg, transparent 0 20px, #94a3b8 20px 40px)"
          }}
        />
      </Box>

      {/* TRUCK */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)"
        }}
      >
        <svg
          width="160"
          height="80"
          viewBox="0 0 160 80"
          fill="none"
        >
          {/* BOX */}
          <motion.rect
            x="70"
            y="10"
            width="36"
            height="24"
            rx="2"
            fill="#facc15"
            animate={{ y: [10, 8, 10] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />

          {/* TRUCK BODY */}
          <rect x="20" y="26" width="90" height="28" rx="4" fill="#22c55e" />
          <rect x="110" y="34" width="30" height="20" rx="3" fill="#16a34a" />

          {/* CAB */}
          <rect x="120" y="28" width="26" height="26" rx="4" fill="#15803d" />

          {/* WHEELS */}
          <circle cx="44" cy="60" r="8" fill="#020617" />
          <circle cx="44" cy="60" r="3" fill="#94a3b8" />

          <circle cx="96" cy="60" r="8" fill="#020617" />
          <circle cx="96" cy="60" r="3" fill="#94a3b8" />
        </svg>
      </motion.div>
    </Box>
  );
}

async function loadReviews(productId) {
  try {
    const res = await fetch(
      `https://demo-springboot-zdym.onrender.com/reviews/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );

    if (!res.ok) throw new Error("Failed to load reviews");

    const data = await res.json();

    setReviews((prev) => ({
      ...prev,
      [productId]: data
    }));
  } catch (err) {
    console.error("Review load failed", err);
  }
}

async function checkout() {
  try {
    if (placing) return;
    setPlacing(true);

    const items = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = products.find(
          (p) => getId(p) === id
        );
        return (
          product && {
            productId: getId(product),
            name: product.name,
            price: product.price,
            count: qty
          }
        );
      })
      .filter(Boolean);

    if (!items.length) {
      alert("🛒 Cart is empty");
      return;
    }

    const res = await fetch(API_ORDERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(items)
    });

    // 🚦 Rate limit handling
    if (res.status === 429) {
      const msg = await res.text();
      alert(msg || "🚫 Too many orders. Please wait 1 minute and try again.");
      return;
    }

    if (!res.ok) throw new Error();

    setCart({});
    setSuccessOpen(true);
  } catch {
    alert("❌ Session expired. Please login again.");
    logout();
  } finally {
    setPlacing(false);
  }
}

function logout() {
  localStorage.clear();
  navigate("/login", { replace: true });
}


  // =============================
  // UI
  // =============================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#020617",
        color: "white"
      }}
    >
      {/* 🌟 GLASS NAVBAR */}
      {/* 🌟 COLLAPSIBLE GLASS NAVBAR */}
<motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
  <Box
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      backdropFilter: "blur(28px) saturate(160%)",
      WebkitBackdropFilter: "blur(28px) saturate(160%)",
      background:
        "linear-gradient(180deg, rgba(15,23,42,0.75), rgba(15,23,42,0.55))",
      borderBottom: "1px solid rgba(255,255,255,0.12)",
      boxShadow:
        "0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
    }}
  >
    {/* TOP BAR */}
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 1.6,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {/* LEFT */}
      <Box>
        <Typography
          fontWeight="bold"
          fontSize="1.25rem"
          sx={{
            letterSpacing: 0.3,
            textShadow: "0 0 14px rgba(34,197,94,0.45)"
          }}
        >
          🛍️ <span style={{ color: "#22c55e" }}>ShopLive</span>
        </Typography>
        <Typography fontSize="0.78rem" color="#cbd5f5">
          Welcome,&nbsp;
          <span style={{ color: "#22c55e", fontWeight: 500 }}>
            {username}
          </span>
        </Typography>
      </Box>

      {/* DESKTOP ACTIONS */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          gap: 1.2
        }}
      >
        {/* SEARCH */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 999,
            px: searchOpen ? 1 : 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
            border: "1px solid rgba(255,255,255,0.18)",
            transition: "0.3s"
          }}
        >
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <TextField
                  size="small"
                  autoFocus
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    px: 1,
                    input: {
                      color: "white",
                      fontSize: "0.9rem"
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <IconButton sx={{ color: "white" }} onClick={() => setSearchOpen(p => !p)}>
            <Search />
          </IconButton>
        </Box>

        {/* ORDERS */}
        <Button
          startIcon={<List />}
          onClick={() => navigate("/dashboard")}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "#e5e7eb",
            "&:hover": {
              color: "#22c55e",
              background: "rgba(34,197,94,0.12)"
            }
          }}
        >
          Orders
        </Button>

        {/* CART */}
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
            border: "1px solid rgba(255,255,255,0.22)",
            "&:hover": {
              background: "rgba(255,255,255,0.25)"
            }
          }}
        >
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {/* LOGOUT */}
        <Button
          onClick={logout}
          sx={{
            ml: 0.5,
            px: 2.6,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.95))",
            boxShadow: "0 0 22px rgba(239,68,68,0.45)",
            color: "white"
          }}
        >
          Logout
        </Button>
      </Box>

      {/* MOBILE TOGGLE */}
      <IconButton
        onClick={() => setNavOpen(p => !p)}
        sx={{
          display: { xs: "flex", md: "none" },
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.25)"
        }}
      >
        <Menu />
      </IconButton>
    </Box>

    {/* MOBILE GLASS PANEL */}
    <motion.div
      initial={false}
      animate={navOpen ? "open" : "closed"}
      variants={{
        open: { height: "auto", opacity: 1 },
        closed: { height: 0, opacity: 0 }
      }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          gap: 2,
          backdropFilter: "blur(26px)",
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.8))",
          borderTop: "1px solid rgba(255,255,255,0.12)"
        }}
      >
        {/* MOBILE SEARCH */}
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight={600}>Menu</Typography>
          <IconButton onClick={() => setMobileSearchOpen(p => !p)} sx={{ color: "white" }}>
            <Search />
          </IconButton>
        </Box>

        <motion.div
          animate={{
            height: mobileSearchOpen ? "auto" : 0,
            opacity: mobileSearchOpen ? 1 : 0
          }}
          transition={{ duration: 0.25 }}
          style={{ overflow: "hidden" }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))",
              borderRadius: 2,
              input: { color: "white" }
            }}
          />
        </motion.div>

        <Button startIcon={<List />} onClick={() => navigate("/dashboard")}>
          My Orders
        </Button>

        <Button startIcon={<ShoppingCart />} onClick={() => setSidebarOpen(true)}>
          Cart ({totalItems})
        </Button>

        <Button startIcon={<LogOut />} onClick={logout} color="error">
          Logout
        </Button>
      </Box>
    </motion.div>
  </Box>
</motion.div>



      {/* 🛒 CART DRAWER */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      >
        <Box
          sx={{
            width: 320,
            p: 2,
            bgcolor: "#0f172a",
            color: "white"
          }}
        >
          <Typography variant="h6">
            🛒 My Cart
          </Typography>

          {Object.entries(cart).map(
            ([id, qty]) => {
              const product =
                products.find(
                  (p) => getId(p) === id
                );
              if (!product || qty === 0)
                return null;

              return (
                <Box
                  key={id}
                  p={2}
                  mb={1}
                  sx={{
                    bgcolor: "#1e293b",
                    borderRadius: 2
                  }}
                >
                  <Typography fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography>
                    Qty: {qty}
                  </Typography>
                </Box>
              );
            }
          )}

          <Button
            fullWidth
            sx={{ mt: 2 }}
            disabled={
              placing || totalItems === 0
            }
            onClick={checkout}
            variant="contained"
          >
            {placing
              ? "Placing..."
              : "Checkout"}
          </Button>
        </Box>
      </Drawer>

      {/* 🧱 PRODUCT GRID */}
      <Box p={4}>
        {!search.trim() && <ModernCarousel slides={slides} />}
        <Grid container spacing={3}>
          {(loading
            ? Array.from({ length: 6 })
            : filteredProducts
          ).map((product, i) => {
            if (loading)
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={i}
                >
                  <Skeleton
                    height={300}
                    variant="rounded"
                  />
                </Grid>
              );

            const id = getId(product);
            const wish =
              wishlist.includes(id);

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={id}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor:
                        "rgba(15,23,42,0.75)",
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.6)"
                    }}
                  >
                    <CardContent
                      onClick={() =>
                        setSelected(product)
                      }
                      sx={{
                        flexGrow: 1,
                        cursor: "pointer"
                      }}
                    >
                      <Box
                        sx={{
                          overflow: "hidden",
                          borderRadius: 2,
                          mb: 2
                        }}
                      >
                        <Box
                          component="img"
                          src={`data:image/jpeg;base64,${product.image}`}
                          alt={product.name}
                          sx={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                            transition: "0.4s",
                            "&:hover": {
                              transform:
                                "scale(1.08)"
                            }
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          ...clamp,
                          WebkitLineClamp: 1
                        }}
                      >
                        {product.name}
                      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "#94a3b8", my: 1 }}
      >
        {product.description}
      </Typography>

      <Typography
        fontWeight="bold"
        sx={{ color: "#22c55e" }}
      >
        ₹{product.price}
      </Typography>
    </Box>

                    <CardActions
                      sx={{
                        justifyContent:
                          "space-between"
                      }}
                    >
                      <Box
                        display="flex"
                        gap={1}
                      >
                        <Button
                          size="small"
                          onClick={() =>
                            removeFromCart(id)
                          }
                        >
                          -
                        </Button>
                        <Typography>
                          {cart[id] || 0}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() =>
                            addToCart(id)
                          }
                        >
                          +
                        </Button>
                      </Box>

      <IconButton
        onClick={() => toggleWishlist(id)}
        sx={{ color: wish ? "hotpink" : "white" }}
      >
        <Heart fill={wish ? "hotpink" : "none"} />
      </IconButton>
    </Box>
  </Box>
</motion.div>

              </Grid>
            );
          })}
        </Grid>

        {filteredProducts.length === 0 &&
          !loading && (
            <Typography
              align="center"
              sx={{ mt: 6, color: "#94a3b8" }}
            >
              No products found 🔍
            </Typography>
          )}
          {/* 🎉 SUCCESS POPUP */}
<AnimatePresence>
  {successOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.15), rgba(2,6,23,0.96))",
        backdropFilter: "blur(18px)"
      }}
    >
      <Confetti
        recycle={false}
        numberOfPieces={250}
        gravity={0.18}
      />

  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          p: 6,
          minWidth: 360,
          textAlign: "center",
          borderRadius: 5,
          bgcolor: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 40px 100px rgba(34,197,94,0.6)",
          color: "white"
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            mb: 2,
            textShadow: "0 0 20px rgba(34,197,94,0.8)"
          }}
        >
          🎉 Order Placed!
        </Typography>

<Typography variant="h4" fontWeight="bold" mb={1}>
  Order on the way!
</Typography>

<Typography sx={{ color: "#94a3b8", mb: 3 }}>
  Your package is rolling towards you 🚚
</Typography>



            {/* CTA */}
            <Button
              fullWidth
              size="large"
              onClick={() => setSuccessOpen(false)}
              sx={{
                py: 1.4,
                fontWeight: "bold",
                borderRadius: 999,
                bgcolor: "#22c55e",
                color: "#020617",
                "&:hover": {
                  bgcolor: "#4ade80"
                }
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  )}
</AnimatePresence>


      </Box>

      {/* 📦 PRODUCT MODAL */}
      {/* 🪟 MODERN PRODUCT SHEET */}
{/* 🪟 PRODUCT DIALOG WITH CHECKOUT */}
<Drawer
  anchor="bottom"
  open={!!selected}
  onClose={() => setSelected(null)}
  PaperProps={{
    sx: {
      height: { xs: "92vh", md: "85vh" },
      bgcolor: "#020617",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24
    }
  }}
>
  {selected && (() => {
    const id = getId(selected);
    if (!reviews[id]) loadReviews(id);

    const count = cart[id] || 0;
    const productReviews = reviews[id] || [];

    async function quickCheckout() {
      try {
        const res = await fetch(API_ORDERS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify([
            {
              productId: id,
              name: selected.name,
              price: selected.price,
              count: count || 1
            }
          ])
        });

        if (!res.ok) throw new Error();
        setCart({});
        setSuccessOpen(true);
        setSelected(null);
      } catch {
        alert("Checkout failed. Please login again.");
        logout();
      }
    }

    return (
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ height: "100%" }}
      >
        {/* HEADER */}
        <Box
          px={3}
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid rgba(255,255,255,0.08)"
        >
          <Typography fontWeight="bold">
            {selected.name}
          </Typography>
          <IconButton onClick={() => setSelected(null)}>
            ✕
          </IconButton>
        </Box>

          <Grid container spacing={3}>
            {/* IMAGE */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={`data:image/jpeg;base64,${selected.image}`}
                alt={selected.name}
                sx={{
                  width: "100%",
                  height: 340,
                  objectFit: "cover",
                  borderRadius: 3
                }}
              />
            </Grid>

            {/* DETAILS */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: "#cbd5f5", mb: 2 }}>
                {selected.description}
              </Typography>

              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  color: "#22c55e",
                  mb: 3
                }}
              >
                ₹{selected.price}
              </Typography>

              {/* QUANTITY */}
              <Box display="flex" gap={2} mb={3}>
                <Button
                  variant="outlined"
                  disabled={count === 0}
                  onClick={() => removeFromCart(id)}
                >
                  −
                </Button>

                <Typography fontWeight="bold">
                  {count}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => addToCart(id)}
                >
                  +
                </Button>
              </Box>

              {/* CHECKOUT */}
              <Button
                fullWidth
                disabled={count === 0}
                onClick={quickCheckout}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  fontWeight: "bold",
                  bgcolor: "#22c55e",
                  color: "#020617",
                  mb: 4
                }}
              >
                ⚡ Checkout Now
              </Button>

              {/* REVIEWS */}
              <Typography fontWeight="bold" mb={1}>
                Reviews
              </Typography>

              {productReviews.map((r, i) => (
                <Box
                  key={i}
                  p={1.5}
                  mb={1}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 2
                  }}
                >
                  <Typography
                    fontSize="0.85rem"
                    color="#22c55e"
                    fontWeight="bold"
                  >
                    {r.username}
                  </Typography>

                  <Typography fontSize="0.85rem">
                    {r.text}
                  </Typography>
                </Box>
              ))}

              <StarReviewForm
                onSubmit={(text, stars) =>
                  submitReview(id, text, stars)
                }
              />
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    );
  })()}
</Drawer>


   </Box>
  );
}

// =============================
// REVIEW FORM
// =============================
function StarReviewForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);

  return (
    <Box mt={2}>
      <Box display="flex" gap={1} mb={1}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={18}
            onClick={() => setStars(n)}
            fill={n <= stars ? "#facc15" : "none"}
            color="#facc15"
            style={{ cursor: "pointer" }}
          />
        ))}
      </Box>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            if (!text.trim()) return;
            onSubmit(text, stars);
            setText("");
            setStars(5);
          }}
        >
          Add Review
        </Button>
      </Box>
      
    </Box>
  );
}
