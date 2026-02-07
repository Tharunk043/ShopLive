import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center"
      >
        <h1 className="text-7xl font-bold text-red-500">404</h1>
        <p className="mt-4 text-xl">Page Not Found</p>
      </motion.div>
    </div>
  );
}
