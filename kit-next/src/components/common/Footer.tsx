const Footer: React.FC = () => {
    return (
      <footer className="footer-fixed bg-white shadow-lg mt-12">
        <div className="max-w-6xl mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-500">&copy; 2024 就活支援アプリ. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">プライバシーポリシー</a>
              <a href="#" className="text-gray-500 hover:text-primary">利用規約</a>
              <a href="#" className="text-gray-500 hover:text-primary">お問い合わせ</a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer