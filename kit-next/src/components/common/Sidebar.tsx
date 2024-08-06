'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';

const MyPage: React.FC = () => {
    const router = useRouter();

    const handleAvatarClick = () => {
        router.push('/my-page');
    };

    return (
        <div className="w-60 p-5 border-l border-gray-300 bg-white absolute right-0 top-0 h-full overflow-y-auto mt-14">
            <div className="mb-5 cursor-pointer" onClick={handleAvatarClick}>
                {/* ここにアイコン画像を追加します */}
                <Avatar>
                    <img src="/path-to-avatar-icon.png" alt="avatar" />
                </Avatar>
            </div>
            <Link href="/post-page" className="block text-blue-500 no-underline my-2">感想投稿ページ</Link>
            <Link href="/search-page" className="block text-blue-500 no-underline my-2">企業検索ページ</Link>
            <Link href="/register-page" className="block text-blue-500 no-underline my-2">企業登録ページ</Link>
            <Link href="/details-page" className="block text-blue-500 no-underline my-2">感想詳細ページ</Link>
        </div>
    );
};

export default MyPage;
