"use client";
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, sendEmailVerification, applyActionCode } from 'firebase/auth';
import { auth } from './../plugins/firebase';
import firebase from 'firebase/compat/app';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (oobCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    try{
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isNotVerified = !userCredential.user.emailVerified;
      if (isNotVerified) {
        await reSendVerifyMail(userCredential.user);
        await signOut(auth);
        setUser(null);
        setAuthError('メールアドレスが認証されていません。認証メールを再送信しました。');
        console.error('Your email address has not been confirmed. A confirmation email has been sent again.')
      } else {
        router.push('/home');
      }
    } catch (error: any){
        switch (error.code){
          case 'auth/invalid-email':
            setAuthError('メールアドレスが無効です。');
            console.error('Invalid email.');
            break;
          case 'auth/user-not-found':
            setAuthError('登録されていません。ユーザー登録を行ってください。');
            console.error('user not found.');
            break;
          case 'auth/wrong-password':
            setAuthError('パスワードが間違っています。');
            console.error('Incorrect password.');
            break;
          case 'auth/too-many-requests':
            setAuthError('リクエストが多すぎます。しばらくしてから再度お試しください。');
            console.error('Too many requests. Please try again later.');
            break;
          default:
            setAuthError('ログインに失敗しました');
            console.error('Failed to log in:', error.message);
        }
        return;
    }

  };

  const reSendVerifyMail = async (user: User) => {
    setAuthError(null);
    try {
      if (user){
        await sendEmailVerification(user);
      }
      return;
    } catch (error: any){
        switch (error.code){
          case 'auth/too-many-requests':
            setAuthError('リクエストが多すぎます。しばらくしてから再度お試しください')
            console.error('Too many requests. Please try again later.');
            break;
          default:
            setAuthError('認証メールの送信に失敗しました');
            console.error('Failed to send verification email:', error.message);
        }
        return;
    }
  }

  const register = async (email: string, password: string) => {
    setAuthError(null);
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      router.push('/auth/verify');
    } catch (error: any){
        switch (error.code){
          case 'auth/email-already-in-use':
            setAuthError('既にメールアドレスが登録されています');
            console.error('The email address is already in use by another account.');
            break;
          case 'auth/invalid-email':
            setAuthError('メールアドレスが無効です');
            console.error('Invalid email.');
            break;
          case 'auth/weak-password':
            setAuthError('パスワードは6文字以上である必要があります');
            console.error('The password must be 6 characters long or more.');
            break;
          default:
            setAuthError('登録に失敗しました');
            console.error('Failed to register:', error.message);
        }
        return;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/');
  };

  const verifyEmail = async (oobCode: string) => {
    try {
      await applyActionCode(auth, oobCode);
    } catch(error: any){
      switch (error.code){
        case 'auth/invalid-action-code':
          console.error('The action code is invalid.');
          break;
        case 'auth/expired-action-code':
          console.error('The action code has expired.');
          break;
        default:
          console.error('Failed to verify email:', error.message);
      }
      return;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, register, logout, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
