import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center p-6"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-7xl font-bold text-red-500"
        >
          404
        </motion.h1>

        <p className="mt-4 text-xl text-gray-300">
          Oops! Page not found
        </p>

        <p className="mt-2 text-gray-400">
          The URL <span className="text-red-400">{window.location.pathname}</span> doesn’t exist.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
        >
          Go Home
        </motion.button>
      </motion.div>
    </div>
  );
}
