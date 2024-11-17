import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import styles from './Postcard.module.css';
import axios from 'axios';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Loading from '../Loading/Loading';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLikeButtonDisabled, setIsLikeButtonDisabled] = useState<boolean>(false);

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };


const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
  setIsLikeButtonDisabled(true);

  // 現在の状態を保存（エラー時に復元するため）
  const previousIsLikeState = isLikeState;
  const previousLikeCount = currentLikeCount;

  setIsLikeState(!isLikeState);
  setCurrentLikeCount((prev) => (isLikeState ? prev - 1 : prev + 1));

  try {
    const response = await axios.post('/api/postReaction', {
      postId: post.id,
      userId: loginUserId,
    });

    if (!response.data) {
      throw new Error('Invalid response data');
    }
  } catch (error) {
    // エラーが発生した場合、状態を元に戻す
    setIsLikeState(previousIsLikeState);
    setCurrentLikeCount(previousLikeCount);
    console.error('いいねの更新に失敗しました:', error);
  } finally {
    setIsLikeButtonDisabled(false);
  }
};

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete('/api/deleteContent',{
        params: {
          contentId: post.id,
          userId: loginUserId,
          type: "post",
        },
      });
      if (response.status === 200) {
        router.refresh();
      } else {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
      }, 3000);
      }
    } catch (error) {
      console.error('投稿の削除に失敗しました:', error);
      setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
      }, 3000);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDeletePost();
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const contentSnippet = post.content.slice(0, 100); // 最初の100文字を表示
  const isContentTruncated = post.content.length > 100;

  return (
    <>
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
            <button onClick={handleLikeClick} className={`${styles.button} ${isLikeState ? styles.liked : ''}`} disabled={isLikeButtonDisabled}>
              {isLikeState ? <FaHeart /> : <FaRegHeart />}
              いいね {currentLikeCount}
            </button>
            <button onClick={handleCardClick} className={styles.detailButton}>
              詳細を見る
            </button>
            {loginUserId === post.userId && (
              <button onClick={handleDeleteClick} className={styles.deleteButton}>
                <FaTrash /> 削除
              </button>
            )}
          </div>
        </div>
      </Card>
      <ConfirmModal
        isOpen={isModalOpen}
        message="この投稿を削除しますか？"
        type="confirm"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="削除"
        cancelText="キャンセル"
      />
      {isLoading && (
        <Loading type='Error' message='Error' />
      )}
    </>
  );
};

export default PostCard;
