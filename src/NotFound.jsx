import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 text-white flex flex-col">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          404 — Page Not Found
        </h1>
        <p className="text-gray-400 mt-2">
          This page doesn’t exist. Play while you’re here 🦖
        </p>
      </motion.div>

      {/* Game Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex-1 flex items-center justify-center px-4"
      >
        <div
          className="
            w-full 
            max-w-5xl 
            aspect-[3/1] 
            bg-black 
            rounded-xl 
            overflow-hidden 
            border border-gray-700
            shadow-2xl
          "
        >
          <iframe
            src="https://wayou.github.io/t-rex-runner/"
            title="Dino Game"
            className="w-full h-full"
          />
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm py-4">
        Press <b>Space</b> to jump · Refresh to restart
      </div>
    </div>
  );
}
