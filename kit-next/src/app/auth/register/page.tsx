"use client";
import { useEffect } from 'react';
import Form from '../../../components/auth/Form'
import { motion } from 'framer-motion'
import Footer from '@/components/common/Footer';
import { getAuth, signOut } from 'firebase/auth';

const Register: React.FC = () => {
  useEffect(() =>{
    const auth = getAuth();
    signOut(auth).then(() => {
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  });
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl"
      >
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">新規登録</h2>
          <Form type="register" />
        </div>
      </motion.div>
      <Footer />
    </>
  )
}

export default Register