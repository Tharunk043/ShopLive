import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
<motion.div
  initial={{ y: -40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      px: 3,
      py: 2,
      position: "sticky",
      top: 0,
      zIndex: 1000,
      backdropFilter: "blur(20px)",
      background: "rgba(15,23,42,0.75)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.6)"
    }}
  >
    {/* LEFT */}
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ textShadow: "0 0 12px rgba(34,197,94,0.6)" }}
      >
        🛍️ ShopLive
      </Typography>
      <Typography color="#cbd5f5" fontSize="0.85rem">
        Welcome,{" "}
        <span style={{ color: "#22c55e" }}>{username}</span>
      </Typography>
    </Box>

    {/* DESKTOP MENU */}
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        gap: 2,
        alignItems: "center"
      }}
    >
      <TextField
        size="small"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          input: { color: "white" }
        }}
      />

      <Select
        size="small"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{
          bgcolor: "rgba(255,255,255,0.1)",
          color: "white",
          minWidth: 120
        }}
      >
        {categories.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="outlined"
        startIcon={<List />}
        onClick={() => navigate("/dashboard")}
        sx={{ borderColor: "#22c55e", color: "#22c55e" }}
      >
        My Orders
      </Button>

      <IconButton
        onClick={() => setSidebarOpen(true)}
        sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
      >
        <Badge badgeContent={totalItems} color="error">
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Button
        variant="contained"
        startIcon={<LogOut />}
        onClick={logout}
        sx={{
          background: "linear-gradient(135deg,#ef4444,#dc2626)"
        }}
      >
        Logout
      </Button>
    </Box>

    {/* MOBILE MENU BUTTON */}
    <IconButton
      onClick={() => setNavOpen((p) => !p)}
      sx={{
        display: { xs: "flex", md: "none" },
        bgcolor: "rgba(255,255,255,0.15)"
      }}
    >
      <Menu />
    </IconButton>
  </Box>

  {/* MOBILE COLLAPSIBLE PANEL */}
  {/* MOBILE COLLAPSIBLE PANEL */}
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
      py: 2,
      display: { xs: "flex", md: "none" },
      flexDirection: "column",
      gap: 2,
      background: "rgba(15,23,42,0.95)",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    }}
  >
    {/* SEARCH ICON ROW */}
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography fontWeight="bold">
        Menu
      </Typography>

      <IconButton
        onClick={() =>
          setMobileSearchOpen((p) => !p)
        }
        sx={{ color: "white" }}
      >
        <Search />
      </IconButton>
    </Box>

    {/* SEARCH INPUT */}
    <motion.div
      initial={false}
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
        placeholder="Search products..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          input: { color: "white" }
        }}
      />
    </motion.div>

    <Button
      startIcon={<List />}
      onClick={() => navigate("/dashboard")}
    >
      My Orders
    </Button>

    <Button
      startIcon={<ShoppingCart />}
      onClick={() => setSidebarOpen(true)}
    >
      Cart ({totalItems})
    </Button>

    <Button
      startIcon={<LogOut />}
      onClick={logout}
      color="error"
    >
      Logout
    </Button>
  </Box>
</motion.div>
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
        <ModernCarousel slides={slides} />
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
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >

                  <Card
                sx={{
                  borderRadius: 4,
                  height: 420, // 🔥 fixed height for all cards
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "rgba(15,23,42,0.75)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  overflow: "hidden"
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
                        mb: 2,
                        height: 180, // 🔥 fixed image area
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                        sx={{
                          ...clamp,
                          WebkitLineClamp: 2,
                          color: "#94a3b8"
                        }}
                      >
                        {product.description}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          color: "#22c55e",
                          fontWeight: "bold"
                        }}
                      >
                        ₹{product.price}
                      </Typography>
                    </CardContent>

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
                        onClick={() =>
                          toggleWishlist(id)
                        }
                        sx={{
                          color: wish
                            ? "hotpink"
                            : "white"
                        }}
                      >
                        <Heart
                          fill={
                            wish
                              ? "hotpink"
                              : "none"
                          }
                        />
                      </IconButton>
                    </CardActions>
                  </Card>
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
<Dialog
  open={successOpen}
  fullScreen
  PaperProps={{
    sx: { bgcolor: "rgba(2,6,23,0.95)" }
  }}
>
  <Confetti recycle={false} numberOfPieces={400} gravity={0.25} />

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

        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Your items are on their way.  
          Thanks for shopping with <b>ShopLive</b>!
        </Typography>

        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #22c55e, #4ade80)",
            boxShadow:
              "0 0 25px rgba(34,197,94,0.8)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #4ade80, #22c55e)"
            }
          }}
          onClick={() => {
            setSuccessOpen(false);
          }}
        >
          🛍 Continue Shopping
        </Button>
      </Card>
    </motion.div>
  </Box>
</Dialog>

      </Box>

      {/* 📦 PRODUCT MODAL */}
      {/* 🪟 MODERN PRODUCT SHEET */}
{/* 🪟 PRODUCT DIALOG WITH CHECKOUT */}
<Dialog
  open={!!selected}
  onClose={() => setSelected(null)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: "transparent",
      boxShadow: "none"
    }
  }}
>
  {selected && (() => {
  const id = getId(selected);

  // 🔥 LOAD REVIEWS ON OPEN
  if (!reviews[id]) {
    loadReviews(id);
  }

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
      >
        <Box
          sx={{
            backdropFilter: "blur(30px)",
            bgcolor: "rgba(15,23,42,0.92)",
            borderRadius: 4,
            p: 3,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
            color: "white"
          }}
        >
          {/* HEADER */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              {selected.name}
            </Typography>
            <Button onClick={() => setSelected(null)} sx={{ color: "#94a3b8" }}>
              ✕
            </Button>
          </Box>

         <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
          >

            {/* IMAGE */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={`data:image/jpeg;base64,${selected.image}`}
                alt={selected.name}
                sx={{
                  width: "100%",
                  height: 320,
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "0 20px 40px rgba(34,197,94,0.4)"
                }}
              />
            </Grid>

            {/* DETAILS */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: "#cbd5f5", mb: 2 }}>
                {selected.description || "No description available."}
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
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Button
                  variant="outlined"
                  disabled={count === 0}
                  onClick={() => removeFromCart(id)}
                  sx={{
                    minWidth: 48,
                    minHeight: 48,
                    borderRadius: "50%",
                    color: "white",
                    borderColor: "#22c55e"
                  }}
                >
                  -
                </Button>

                <Typography
                  sx={{
                    minWidth: 40,
                    textAlign: "center",
                    fontSize: "1.4rem",
                    fontWeight: "bold"
                  }}
                >
                  {count}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => addToCart(id)}
                  sx={{
                    minWidth: 48,
                    minHeight: 48,
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    "&:hover": { bgcolor: "#4ade80" }
                  }}
                >
                  +
                </Button>
              </Box>

              {/* ACTION BUTTONS */}
              <Box display="flex" gap={2} mb={3}>
                

                <Button
                  fullWidth
                  color="warning"
                  variant="contained"
                  disabled={count === 0}
                  onClick={quickCheckout}
                  sx={{
                    py: 1.5,
                    fontWeight: "bold",
                    borderRadius: 3
                  }}
                >
                  ⚡ Checkout Now
                </Button>
              </Box>

              {/* REVIEWS */}
              <Typography variant="subtitle1" mb={1}>
                <Star size={16} /> Reviews
              </Typography>

              {productReviews.map((r, i) => (
  <Box
    key={i}
    p={1.5}
    mb={1}
    sx={{
      bgcolor: "rgba(255,255,255,0.05)",
      borderRadius: 2,
      border: "1px solid rgba(255,255,255,0.08)"
    }}
  >
    {/* USER + STARS ROW */}
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={0.5}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: "#22c55e", fontWeight: "bold" }}
      >
        {r.username}
      </Typography>

      <Box display="flex" gap={0.3}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={14}
            fill={n <= r.stars ? "#facc15" : "none"}
            color="#facc15"
          />
        ))}
      </Box>
    </Box>

    {/* REVIEW TEXT */}
    <Typography
      variant="body2"
      sx={{ color: "#e5e7eb", lineHeight: 1.5 }}
    >
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
</Dialog>

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
