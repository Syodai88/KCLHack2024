"use client";
import { motion } from 'framer-motion'

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
        あなたの未来へのジャンプスタート
      </h1>
      <p className="text-xl text-white mb-12 text-center max-w-2xl">
        就活のプロセスをスムーズに。情報、ツール、サポート、すべてここにあります。
      </p>
    </motion.div>
  )
}

export default Home