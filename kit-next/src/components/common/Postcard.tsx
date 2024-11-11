// PostCard.tsx
import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './PostCard.module.css';

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  companyId: string;
  likeCount: number;
  postDate: string;
}

interface PostCardProps {
  postId: string;
  currentUserId: string;
}

const PostCard: React.FC<PostCardProps> = ({ postId, currentUserId }) => {
  const router = useRouter();

  // デモデータを定義
  const demoPostData: Post = {
    id: postId,
    title: 'サンプルのタイトル',
    content:
      'これはサンプルの投稿内容です。ここに投稿の一部を表示します。残りの内容は詳細ページで確認してください。ユーザーに詳細を見てもらうために、投稿の一部のみを表示しています。これはサンプルの投稿内容です。ここに投稿の一部を表示します。残りの内容は詳細ページで確認してください。ユーザーに詳細を見てもらうために、投稿の一部のみを表示しています。',
    userId: 'user123',
    companyId: 'company456',
    likeCount: 10,
    postDate: '2023-10-01',
  };

  const [postData] = useState<Post>(demoPostData);
  const [userHandleName] = useState<string>('ハンドルネーム');
  const [companyName] = useState<string>('サンプル企業名');
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [currentLikeCount, setCurrentLikeCount] = useState<number>(
    postData.likeCount || 0
  );

  const handleCardClick = () => {
    router.push(`/posts/${postId}`);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setCurrentLikeCount((prevCount) =>
      isLiked ? prevCount - 1 : prevCount + 1
    );
  };

  const contentSnippet = postData.content.slice(0, 100); // 最初の100文字を表示
  const isContentTruncated = postData.content.length > 100;

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      <CardContent onClick={(e) => e.stopPropagation()}>
        <Typography
          variant="h5"
          component="div"
          className={styles.title}
          onClick={handleCardClick}
        >
          {postData.title}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" className={styles.subtitle}>
          企業: {companyName}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" className={styles.subtitle}>
          投稿者: {userHandleName}
        </Typography>
        <Typography variant="body2" color="text.secondary" className={styles.postDate}>
          投稿日: {new Date(postData.postDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" color="text.primary" className={styles.content}>
          {contentSnippet}
          {isContentTruncated && '...'}
        </Typography>
        {isContentTruncated && (
          <Typography
            variant="body2"
            color="primary"
            className={styles.readMore}
            onClick={handleCardClick}
          >
            続きを読む
          </Typography>
        )}
      </CardContent>
      <div className={styles.actionButtons}>
        <div className={styles.reactionButtons}>
          <button
            onClick={handleLikeClick}
            className={`${styles.button} ${isLiked ? styles.liked : ''}`}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
            いいね ({currentLikeCount})
          </button>
          <button onClick={handleCardClick} className={styles.detailButton}>
            詳細を見る
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
