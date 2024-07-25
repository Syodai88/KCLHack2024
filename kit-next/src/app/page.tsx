"use client";
import { motion } from 'framer-motion';
import { Container, Typography } from '@mui/material';

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]"
    >
      <Container maxWidth="md" className="text-center">
        <Typography variant="h1" component="h1" className="text-4xl md:text-5xl font-bold text-white mb-8">
          あなたの未来へのジャンプスタート
        </Typography>
        <Typography variant="body1" className="text-xl text-white mb-12 max-w-2xl mx-auto">
          就活のプロセスをスムーズに。情報、ツール、サポート、すべてここにあります。
        </Typography>
      </Container>
    </motion.div>
  );
}

export default Home;
