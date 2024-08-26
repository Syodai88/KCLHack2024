// Home.tsx
"use client";
import { motion } from 'framer-motion';
import Footer from '@/components/common/Footer';

const Welcome: React.FC = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]"
      >
        <div className="container max-w-screen-md text-center px-4">
          <h1 className="text-5xl md:text-5xl font-bold text-white mb-8">
            あなたの未来へのスタート！！
          </h1>
          <p className="text-2xl text-white mb-12 max-w-2xl mx-auto">
            九工大生に寄り添った情報がここに、、！
          </p>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}

export default Welcome;

