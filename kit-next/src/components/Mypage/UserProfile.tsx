import Avatar from '@mui/material/Avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import styles from './UserProfile.module.css';
import React, { useState, useEffect } from 'react';
import UserProfileEdit from './UserProfileEdit';
import { useAuth } from '@/context/AuthContext';
import Loading from '../common/Loading';

interface Profile {
    name: string;
    year: string;
    department: string;
    other: string;
    profileImage: string;
}

const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [profile, setProfile] = useState<Profile>({
        name: "",
        year: "",
        department: "",
        other: "",
        profileImage: "",
    });
    const loggedInUserId = useAuth().user?.uid;
    const [isloading, setIsLoading] = useState<boolean>(false);

    // ユーザーデータを取得
    useEffect(() => {
        const getUserData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/getUserProfile?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    console.error("ユーザーデータの取得に失敗しました");
                }
            } catch (error) {
                console.error("ユーザーデータの取得中にエラーが発生しました:", error);
            } finally{
                setIsLoading(false);
            }
        };
        getUserData();
    }, [userId]);

    const calculateGraduationYear = (year: string): string => {
        const currentYear = new Date().getFullYear();
        switch (year) {
            case 'B1':
                return `${currentYear + 4}年卒`;
            case 'B2':
                return `${currentYear + 3}年卒`;
            case 'B3':
                return `${currentYear + 2}年卒`;
            case 'B4':
                return `${currentYear + 1}年卒`;
            case 'M1':
                return `${currentYear + 2}年卒`;
            case 'M2':
                return `${currentYear + 1}年卒`;
            case 'D1':
                return `${currentYear + 3}年卒`;
            case 'D2':
                return `${currentYear + 2}年卒`;
            case 'D3':
                return `${currentYear + 1}年卒`;
            default:
                return '卒業年度不明';
        }
    };

    if (isloading){
        return <Loading/>
    }
    return (
        <div className={styles.container}>
            <div className={styles.avatarContainer}>
                <Avatar className={styles.avatar}>
                    <img src={profile.profileImage} alt="プロフィール画像" className={styles.avatarImage} />
                </Avatar>
            </div>
            {isEditing ? (
                <UserProfileEdit userId={userId} profile={profile} setProfile={setProfile} setIsEditing={setIsEditing} />
            ) : (
                <div className={styles.profileInfo}>
                    <p className={styles.profileItem}><strong>ニックネーム:</strong> {profile.name}</p>
                    <p className={styles.profileItem}><strong>卒業年度:</strong> {calculateGraduationYear(profile.year)}</p>
                    <p className={styles.profileItem}><strong>所属:</strong> {profile.department}</p>
                    <strong className={styles.profileItem}>資格など:</strong>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        className={styles.markdown}
                    >
                        {profile.other || ""}
                    </ReactMarkdown>
                    {loggedInUserId === userId && (
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                            編集
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;