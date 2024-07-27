"use client";
import Link from 'next/link';
import { useState } from 'react';


const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);  // ログイン状態を管理する状態

  const handleLogout = () => {
    setIsLoggedIn(false);
    // ログアウト処理をここに追加
  }

  return (
    <nav className="navbar-fixed">
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
                <Link href="/auth/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-primary hover:text-white transition duration-300">ログイン</Link>
                <Link href="/auth/register" className="py-2 px-2 font-medium text-white bg-primary rounded hover:bg-primary-dark transition duration-300">新規登録</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
