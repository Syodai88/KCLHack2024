import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './Postcard.module.css';

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
}
const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [currentLikeCount, setCurrentLikeCount] = useState<number>(post.likeCount);

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setCurrentLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
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
          <Typography variant="body2" color="primary" className={styles.readMore}>
            続きを読む
          </Typography>
        )}
      </CardContent>
      <div className={styles.actionButtons}>
        <div className={styles.reactionButtons}>
          <button onClick={handleLikeClick} className={`${styles.button} ${isLiked ? styles.liked : ''}`}>
            {isLiked ? <FaHeart /> : <FaRegHeart />}
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
