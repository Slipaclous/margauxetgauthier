'use client';

import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[var(--color-white)] z-50"
    >
      <section className="section relative h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-7xl font-light mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[#171717]">Margaux</span>
            <span className="text-[#E13B70] mx-4 sm:mx-6 md:mx-8">&</span>
            <span className="text-[#171717]">Gauthier</span>
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-12 tracking-widest uppercase font-light text-[#E88032]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            5 juillet 2025
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[1px] bg-[#171717] mx-auto"
          />
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Loader; 