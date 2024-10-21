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
        year: "4年生",
        department: "知能情報工学科",
        certifications: "TOEIC 600点, 基本情報技術者試験"
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // 選択された画像

    // フォームの値変更を管理
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // 画像を選択する関数
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const imageURL = URL.createObjectURL(e.target.files[0]);
            setSelectedImage(imageURL); // 選択された画像をセット
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-5 cursor-pointer" style={{ paddingTop: '20px' }}>
                <label htmlFor="imageUpload">
                    <Avatar style={{ width: 120, height: 120 }}> 
                        {selectedImage ? (
                            <img src={selectedImage} alt="選択された画像" style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <RxAvatar size={80} />  // デフォルトアイコンの表示
                        )}
                    </Avatar>
                </label>
                <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }} // 非表示にしてクリックをアイコンに委譲
                    onChange={handleImageChange}
                />
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

