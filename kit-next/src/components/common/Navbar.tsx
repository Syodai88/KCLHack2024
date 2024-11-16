"use client";
import Link from 'next/link';
import { useAuth } from './../../context/AuthContext'
import ConfirmModal from './ConfirmModal/ConfirmModal';
import { useState } from 'react';
import Image from 'next/image';


const Navbar: React.FC = () => {
  const { user,logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
  }

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="navbar-fixed">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              {user ? (
                <Link href="/home" className="flex items-center py-4 px-2">
                  <Image 
                    src="/Logo.jpeg" 
                    alt="Kit Success Logo" 
                    width={200} 
                    height={50} 
                    className="object-contain"
                    priority 
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </Link>
              ) : (
                <Link href="/" className="flex items-center py-4 px-2">
                  <Image 
                  src="/Logo.jpeg" 
                  alt="Kit Success Logo" 
                  width={200} 
                  height={50} 
                  className="object-contain"
                  priority 
                  style={{ width: 'auto', height: 'auto' }}
                />
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="py-2 px-2 font-medium text-gray-500">日付: {new Date().toLocaleDateString()}</span>
                <button 
                  onClick={handleLogoutClick} 
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
      <ConfirmModal
        isOpen={isModalOpen}
        message="本当にログアウトしますか？"
        type="confirm"
        onConfirm={handleLogout}
        onCancel={handleCancel}
        confirmText="ログアウト"
        cancelText="キャンセル"
      />
    </nav>
  )
}

export default Navbar;
