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

interface Profile {
  name: string;
  year: string;
  department: string;
  other: string;
  profileImage: string;
}

interface PostTitle {
  id: string;
  title: string;
}

const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    year: '',
    department: '',
    other: '',
    profileImage: '',
  });
  const [posts, setPosts] = useState<PostTitle[]>([]);
  const loggedInUserId = useAuth().user?.uid;
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

  // ユーザーの投稿を取得（仮のデータを使用）
  useEffect(() => {
    const fetchUserPosts = async () => {
      const placeholderPosts = [
        { id: '1', title: '最初の投稿タイトル' },
        { id: '2', title: '二番目の投稿タイトル' },
        { id: '1', title: '最初の投稿タイトル' },
        { id: '2', title: '二番目の投稿タイトル' },
        { id: '1', title: '最初の投稿タイトル' },
        { id: '2', title: '二番目の投稿タイトル' },
        { id: '1', title: '最初の投稿タイトル' },
      ];
      setPosts(placeholderPosts);
    };
    fetchUserPosts();
  }, []);

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
                    <PostCard postId={'1'} currentUserId={'1'} />
                    <PostCard postId={'2'} currentUserId={'2'} />
                    {posts.length > 0 ? (
                    <ul className={styles.postList}>
                        {posts.map((post) => (
                        <li key={post.id} className={styles.postItem}>
                            <a href={`/posts/${post.id}`} className={styles.postLink}>
                            {post.title}
                            </a>
                        </li>
                        ))}
                    </ul>
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
