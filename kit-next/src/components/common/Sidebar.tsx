'use client';
import React, {useState,useEffect} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import { RxAvatar } from "react-icons/rx";
import { useAuth } from '@/context/AuthContext';
import Loading from './Loading';

const Sidebar: React.FC = () => {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [dataLoading, setDataLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.uid) {
                try {
                    setDataLoading("Loading");
                    const response = await fetch(`/api/getUserProfile?userId=${user.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setImageUrl(data.profileImage);
                        setDataLoading(null);
                    } else {
                        setDataLoading("Error");
                        console.error("ユーザーデータの取得に失敗しました");
                        setTimeout(() => {
                            setDataLoading(null);
                        }, 3000);
                    }
                } catch (err) {
                    setDataLoading("Error");
                    console.error("ユーザーデータの取得中にエラーが発生しました:", err);
                    setTimeout(() => {
                        setDataLoading(null);
                    }, 3000);
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
    if(loading || dataLoading==="Loading"){
        return <Loading/>
    }else if(dataLoading ==="Error"){
        return <Loading type="Error" message='User Error'/>
    }

    return (
        <div className="p-5 bg-white h-full overflow-y-auto">
            <div className="mb-5 cursor-pointer" onClick={handleAvatarClick}>
            <Avatar style={{ width: 70, height: 70 }}>
                {dataLoading ? (
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
