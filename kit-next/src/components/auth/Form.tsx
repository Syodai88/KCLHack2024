"use client";
import { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

interface FormProps {
  type: 'login' | 'register';
}

const Form: React.FC<FormProps> = ({ type }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ここでフォームの送信処理を実装
    console.log('Form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>
      {type === 'register' && (
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
      )}
      <div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {type === 'login' ? 'ログイン' : '登録'}
        </motion.button>
      </div>
    </form>
  )
}

export default Form