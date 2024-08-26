'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';

const Sidebar: React.FC = () => {
    const router = useRouter();

    const handleAvatarClick = () => {
        router.push('/my-page');
    };

    return (
        <div className="p-5 bg-white h-full overflow-y-auto">
            <div className="mb-5 cursor-pointer" onClick={handleAvatarClick}>
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

export default Sidebar;