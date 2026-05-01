import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "/logo.png";

export const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-32 h-32 mb-6 drop-shadow-2xl"
          >
            <img src={logo} alt="Arisan Galaxy" className="w-full h-full object-contain" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Arisan Galaxy
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm text-muted-foreground mt-2"
          >
            Kelola arisan dengan mudah
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 flex gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};