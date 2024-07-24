"use client";
import Form from '../../components/auth/Form'
import { motion } from 'framer-motion'

const Login: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl"
    >
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">ログイン</h2>
        <Form type="login" />
      </div>
    </motion.div>
  )
}

export default Login