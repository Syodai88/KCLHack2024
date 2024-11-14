import Avatar from '@mui/material/Avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks'; 
import styles from './UserProfile.module.css';
import React, { useState, useEffect } from 'react';
import UserProfileEdit from './UserProfileEdit';
import { useAuth } from '@/context/AuthContext';
import Loading from '../common/Loading';
import { FaEdit } from 'react-icons/fa';
import PostCard from '../common/Postcard';
import axios from 'axios';
import { Tag,Post } from '@/interface/interface';

interface Profile {
  name: string;
  year: string;
  department: string;
  other: string;
  profileImage: string;
}

const UserProfile: React.FC<{ userId: string }> = async ({ userId }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    year: '',
    department: '',
    other: '',
    profileImage: '',
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const loggedInUserId = useAuth().user?.uid || '';
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          console.error('ユーザーデータの取得に失敗しました');
        }
      } catch (error) {
        console.error('ユーザーデータの取得中にエラーが発生しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserData();
  }, [userId]);

  // ユーザーの投稿を取得、現在ログイン中のユーザーのリアクションの有無も取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/fetchPostCard', {
          params: { userId, loginUserId: loggedInUserId },
        });

        if (response.status === 200) {
          setPosts(response.data.posts);
        }else{
          console.error('投稿の取得に失敗しました');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (loggedInUserId) {
      fetchPosts();
    }
  }, [userId, loggedInUserId]);


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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
        {!isEditing && (//編集中の時はアイコンと名前を消す
            <div className={styles.profileHeader}>
                <div className={styles.leftSection}>
                    <Avatar 
                      sx={{
                        width: 100,
                        height: 100,
                        transition: 'transform 0.3s ease',
                      }}
                      src={profile.profileImage} 
                      alt="プロフィール画像" 
                    />
                    <h1 className={styles.profileName}>{profile.name}</h1>
                </div>
                {loggedInUserId === userId &&(//自分のページのみ編集可能
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                        <FaEdit /> 編集
                    </button>
                )}
            </div>
        )}
        {isEditing ? (
            <UserProfileEdit
            userId={userId}
            profile={profile}
            setProfile={setProfile}
            setIsEditing={setIsEditing}
            />
        ) : (
            <div className={styles.contentContainer}>
                <div className={styles.profileInfo}>
                    <p>
                        <strong>卒業年度:</strong> {calculateGraduationYear(profile.year)}
                        <span className={styles.separator}> | </span>
                        <strong>所属:</strong> {profile.department}
                    </p>
                    <div className={styles.otherInfo}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                            rehypePlugins={[rehypeKatex]}
                            className={styles.markdown}
                        >
                            {profile.other || '情報がありません。'}
                        </ReactMarkdown>
                    </div>
                </div>
                {/* 投稿一覧 */}
                <div className={styles.postsSection}>
                    <h2>投稿一覧</h2>
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <PostCard key={post.id} post={post} loginUserId={loggedInUserId} isLiked={post.isLiked} />
                      ))
                    ) : (
                      <p>投稿がありません。</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default UserProfile;
