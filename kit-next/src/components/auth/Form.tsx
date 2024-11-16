"use client";
import { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from './../../context/AuthContext'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

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

  const {login, register, authError} = useAuth();
  const [formError, setFormError] = useState< string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@mail\.kyutech\.jp$/;
    if (!emailPattern.test(formData.email)){
      setFormError('九工大メール(@kyutech.mail.jp)を入力してください');
      return;
    }
    if (type === 'login'){
      try{
        await login(formData.email, formData.password);
      }catch(error){
        setFormError('メールアドレスまたはパスワードが間違っています');
        console.error('Login Error:', error);
      }
    } else {
      try{
        if (formData.password !== formData.confirmPassword){
          setFormError('パスワードが一致しません');
          return;
        }
        await register(formData.email,formData.password);
        console.log('Registered successfully');
      }catch(error){
        setFormError('登録に失敗しました')
        console.error('Failed to register:', error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {authError && <p className='text-error'>{authError}</p>}
      {formError && <p className='text-error'>{formError}</p>}
      <div >
        <TextField
          label="メールアドレス"
          type='email'
          id='email'
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          variant='outlined'
          margin='normal'
          sx={{ input: { padding: '16px' } }}
          InputLabelProps={{className: 'text-accent'}}
          InputProps={{
            classes: {
              root: "border-primary",
              focused: "border-primary",
            },
          }}
        />
      </div>
      <div>
        <TextField
          label="パスワード"
          type={showPassword ? 'text' : 'password'}
          id='password'
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
          variant='outlined'
          margin='normal'
          sx={{ input: { padding: '16px' }}}
          InputLabelProps={{className: 'text-accent'}}
          InputProps={{
            classes: {
              root: "border-primary",
              focused: "border-primary",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {type === 'register' && (
        <div>
          <TextField
            label="パスワード（確認）"
            type={showPassword ? 'text' : 'password'}
            id='confirmPassword'
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            variant='outlined'
            margin='normal'
            sx={{ input: { padding: '16px' } }}
            InputLabelProps={{className: 'text-accent'}}
            InputProps={{
              classes: {
                root: "border-primary",
                focused: "border-primary",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      )}
      <div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {type === 'login' ? 'ログイン' : '登録'}
        </motion.button>
      </div>
    </form>
  )
}

export default Form