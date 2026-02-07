import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-4"
      >
        404 — Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 mb-6"
      >
        No internet? No page? Play the dino 🦖
      </motion.p>

      {/* Dino Game */}
      <motion.iframe
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        src="https://wayou.github.io/t-rex-runner/"
        title="Dino Game"
        className="w-[320px] h-[200px] border border-gray-700 rounded-lg"
      />

      <p className="mt-4 text-sm text-gray-500">
        Press <b>Space</b> to jump
      </p>
    </div>
  );
}
