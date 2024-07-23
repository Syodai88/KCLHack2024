"use client";
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, href, variant = 'primary' }) => {
  const baseStyle = "px-6 py-3 rounded-full font-bold text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantStyles = {
    primary: "bg-primary hover:bg-primary-dark focus:ring-primary",
    secondary: "bg-secondary hover:bg-secondary-dark focus:ring-secondary"
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link href={href} className={`${baseStyle} ${variantStyles[variant]}`}>
        {children}
      </Link>
    </motion.div>
  )
}

export default Button