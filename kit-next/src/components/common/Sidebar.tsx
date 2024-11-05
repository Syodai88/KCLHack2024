import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import { RxAvatar } from 'react-icons/rx';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css'; // CSSファイルのインポート

const Sidebar: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [nickname, setNickname] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.uid) {
                try {
                    const response = await fetch(`/api/getUserProfile?userId=${user.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setImageUrl(data.profileImage);
                        console.log(data.profileImage);
                        setNickname(data.name); // ニックネームをセット
                    } else {
                        console.error('ユーザーデータの取得に失敗しました');
                    }
                } catch (err) {
                    console.error('ユーザーデータの取得中にエラーが発生しました:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    const handleAvatarClick = () => {
        if (user) {
            router.push(`/mypage/${user.uid}`);
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="p-5 bg-white h-full overflow-y-auto">
            <div className={styles.avatarContainer} onClick={handleAvatarClick}>
                <Avatar className={styles.avatar}>
                    {loading ? (
                        <RxAvatar size={50} />
                    ) : imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="プロフィール画像"
                            className={styles.avatar}
                        />
                    ) : (
                        <RxAvatar size={50} />
                    )}
                </Avatar>
                {nickname && <span className="nickname">{nickname}</span>}
            </div>
            <div className={styles.linkList}>
                <Link href="/post-page" className={styles.link}>
                    → 感想投稿ページ
                </Link>
                <Link href="/home" className={styles.link}>
                    → 企業検索ページ
                </Link>
                <Link href="/registerCompany" className={styles.link}>
                    → 企業登録ページ
                </Link>
                <Link href="/details-page" className={styles.link}>
                    → 感想詳細ページ
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
