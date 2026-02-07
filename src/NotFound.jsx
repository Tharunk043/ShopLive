import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-black text-white relative overflow-hidden">
      
      {/* Top overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <h1 className="text-xl md:text-2xl font-semibold">
          404 — Page Not Found
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Page doesn’t exist. Press <b>Space</b> to play 🦖
        </p>
      </motion.div>

      {/* FULLSCREEN GAME */}
      <motion.iframe
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src="https://wayou.github.io/t-rex-runner/"
        title="Dino Game"
        className="absolute inset-0 w-full h-full"
      />

      {/* Bottom overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm z-10">
        Refresh to restart · ESC to leave
      </div>
    </div>
  );
}
