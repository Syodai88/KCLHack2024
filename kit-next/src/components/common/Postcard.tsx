import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './Postcard.module.css';
import axios from 'axios';

interface Tag {
    id: number;
    name: string;
}
interface Post {
    id: number;
    title: string;
    content: string;
    userId: string;
    companyId: string;
    likeCount: number;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
    company: {
      id: string;
      name: string;
    };
    tags: Tag[];
}
interface PostCardProps {
    post: Post;
    loginUserId : string;
    isLiked: boolean;
}
const PostCard: React.FC<PostCardProps> = ({ post, loginUserId, isLiked }) => {
  const router = useRouter();
  const [isLikeState, setIsLikeState] = useState<boolean>(isLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState<number>(post.likeCount);

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
        // いいね API の呼び出し
        const response = await axios.post('/api/postReaction', {
          postId: post.id,
          userId: loginUserId, // ログイン中のユーザーのIDを渡す
        });
  
        if (response.data.likeAdded) {
          setIsLikeState(true);
          setCurrentLikeCount((prev) => prev + 1);
        } else {
          setIsLikeState(false);
          setCurrentLikeCount((prev) => prev - 1);
        }
      } catch (error) {
        console.error('いいねの更新に失敗しました:', error);
      }
  };

  const contentSnippet = post.content.slice(0, 100); // 最初の100文字を表示
  const isContentTruncated = post.content.length > 100;

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      <CardContent onClick={(e) => e.stopPropagation()}>
        <Typography variant="h5" component="div" className={styles.title}>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" className={styles.subtitle}>
          企業: {post.company.name}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" className={styles.subtitle}>
          投稿者: {post.user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className={styles.postDate}>
          投稿日: {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" color="text.primary" className={styles.content}>
          {contentSnippet}
          {isContentTruncated && '...'}
        </Typography>
        {isContentTruncated && (
          <Typography variant="body2" color="primary" className={styles.readMore} onClick={handleCardClick}>
            続きを読む
          </Typography>
        )}
      </CardContent>
      <div className={styles.actionButtons}>
        <div className={styles.reactionButtons}>
          <button onClick={handleLikeClick} className={`${styles.button} ${isLikeState ? styles.liked : ''}`}>
            {isLikeState ? <FaHeart /> : <FaRegHeart />}
            いいね {currentLikeCount}
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
