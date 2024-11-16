"use client";
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Footer from '@/components/common/Footer';
import { getAuth, signOut } from 'firebase/auth';

const Verify: React.FC = () => {
  useEffect(() =>{
    const auth = getAuth();
    signOut(auth).then(() => {
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  });
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-800 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-1/4 max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl"
      >
        <div className="p-8 text-center">
          <h2 className="text-3xl font-semibold text-accent mb-6">メールを送信しました</h2>
          <h2 className="text-3xl font-semibold text-accent mb-6">リンクにアクセスしてログインしてください</h2>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}

export default Verify;
