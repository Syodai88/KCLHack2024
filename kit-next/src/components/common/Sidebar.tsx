'use client';
import React, {useState,useEffect} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import { RxAvatar } from "react-icons/rx";
import { useAuth } from '@/context/AuthContext';

const Sidebar: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.uid) {
                try {
                    const response = await fetch(`/api/getUserProfile?userId=${user.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setImageUrl(data.profileImage);
                        console.log(data.profileImage);
                    } else {
                        console.error("ユーザーデータの取得に失敗しました");
                    }
                } catch (err) {
                    console.error("ユーザーデータの取得中にエラーが発生しました:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
    
        fetchUserProfile();
    }, [user]);
    

    // アイコンクリック時のハンドラー
    const handleAvatarClick = () => {
        if (user) {
            router.push(`/mypage/${user.uid}`);
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="p-5 bg-white h-full overflow-y-auto">
            <div className="mb-5 cursor-pointer" onClick={handleAvatarClick}>
            <Avatar style={{ width: 70, height: 70 }}>
                {loading ? (
                    <RxAvatar size={50} />
                ) : imageUrl ? (
                    <img src={imageUrl} alt="プロフィール画像" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                    <RxAvatar size={50} />
                )}
            </Avatar>
            </div>
            <Link href="/post-page" className="block text-blue-500 no-underline my-2">感想投稿ページ</Link>
            <Link href="/home" className="block text-blue-500 no-underline my-2">企業検索ページ</Link>
            <Link href="/registerCompany" className="block text-blue-500 no-underline my-2">企業登録ページ</Link>
            <Link href="/details-page" className="block text-blue-500 no-underline my-2">感想詳細ページ</Link>
        </div>
    );
};

export default Sidebar;
