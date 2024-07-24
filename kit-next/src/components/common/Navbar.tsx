"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);  // ログイン状態を管理する状態

  const handleLogout = () => {
    setIsLoggedIn(false);
    // ログアウト処理をここに追加
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              {isLoggedIn ? (
                <span className="flex items-center py-4 px-2 font-semibold text-gray-500 text-lg">
                  就活支援アプリ
                </span>
              ) : (
                <Link href="/" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">
                    就活支援アプリ
                  </span>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <span className="py-2 px-2 font-medium text-gray-500">日付: {new Date().toLocaleDateString()}</span>
                <button 
                  onClick={handleLogout} 
                  className="py-2 px-2 font-medium text-white bg-error rounded hover:bg-accent transition duration-300"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-primary hover:text-white transition duration-300">ログイン</Link>
                <Link href="/register" className="py-2 px-2 font-medium text-white bg-primary rounded hover:bg-primary-dark transition duration-300">新規登録</Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6 text-gray-500 hover:text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoggedIn ? (
              <>
                <span className="block py-2 px-4 text-sm">日付: {new Date().toLocaleDateString()}</span>
                <button 
                  onClick={handleLogout} 
                  className="block py-2 px-4 text-sm text-white bg-primary rounded hover:bg-primary-dark transition duration-300"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 px-4 text-sm hover:bg-primary hover:text-white transition duration-300">ログイン</Link>
                <Link href="/register" className="block py-2 px-4 text-sm hover:bg-primary hover:text-white transition duration-300">新規登録</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar;
