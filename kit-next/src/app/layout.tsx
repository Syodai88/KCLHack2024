import './globals.css'
import { Metadata } from 'next'
import Navbar from './../components/common/Navbar'
import {AuthProvider } from './../context/AuthContext'


export const metadata: Metadata = {
  title: '就活支援アプリ | 大学生の未来をサポート',
  description: '大学生のための包括的な就活支援Webアプリケーション',
}

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <html lang="ja">
        <body className="bg-gradient-to-br from-primary to-secondary min-h-screen flex flex-col">
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  )
}

export default RootLayout