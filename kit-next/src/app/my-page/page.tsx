"use client";
import React, { useState } from 'react';
import SplitPage from '@/components/common/SplitPage';
import Sidebar from '@/components/common/Sidebar';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import { RxAvatar } from "react-icons/rx";

const Mypage_edit: React.FC = () => {
    // 編集モードを管理する状態
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        handleName: "九工太郎",
        year: "3年生",
        department: "情報工学科",
        certifications: "TOEIC 800点, 基本情報技術者試験"
    });

    // フォームの値変更を管理
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-5 cursor-pointer" style={{ paddingTop: '20px' }}>
                <Avatar style={{ width: 120, height: 120 }}> {/* Avatarのサイズを調整 */}
                    <RxAvatar size={80} /> {/* RxAvatarのサイズも調整 */}
                </Avatar>
            </div>

            {/* 編集モードかどうかで表示を切り替え*/}
            {isEditing ? (
                <div className="w-full max-w-md">
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">ハンドルネーム</label>
                        <input
                            type="text"
                            name="handleName"
                            value={profile.handleName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">学年</label>
                        <input
                            type="text"
                            name="year"
                            value={profile.year}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">学科</label>
                        <input
                            type="text"
                            name="department"
                            value={profile.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">資格</label>
                        <textarea
                            name="certifications"
                            value={profile.certifications}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                        onClick={() => setIsEditing(false)}
                    >
                        保存
                    </button>
                </div>
            ) : (
                <div className="text-center space-y-2">
                    <p className="text-xl font-bold">ハンドルネーム: {profile.handleName}</p>
                    <p>学年: {profile.year}</p>
                    <p>学科: {profile.department}</p>
                    <p>資格: {profile.certifications}</p>
                    <button
                        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={() => setIsEditing(true)}
                    >
                        編集
                    </button>
                </div>
            )}
        </div>
    );
}

const Mypage: React.FC = () => {
    return (
        <SplitPage sidebar={<Sidebar />}>
            <Mypage_edit />
        </SplitPage>
    );
}

export default Mypage;

