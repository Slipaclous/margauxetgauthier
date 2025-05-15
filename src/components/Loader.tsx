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
          className="text-center -mt-66"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-light mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[#171717]">Margaux</span>
            <span className="text-[#E13B70] mx-8">&</span>
            <span className="text-[#171717]">Gauthier</span>
          </motion.h1>
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