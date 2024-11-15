'use client';
import React, { useEffect, useState } from 'react';
import styles from './PostDetailPage.module.css';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';
import { Divider } from '@mui/material';
import SplitPage from '@/components/common/SplitPage';
import Sidebar from '@/components/common/Sidebar';
import Link from 'next/link';
import { FiMessageCircle } from 'react-icons/fi';
import { FaHeart, FaRegHeart, FaTrash} from 'react-icons/fa';
import Loading from '@/components/common/Loading';


interface Post {
  id: number;
  userId: string;
  companyId: string;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isliked: boolean;
  user: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
}

interface Comment {
  id: number;
  postId: number;
  userId: string;
  content: string;
  createdAt: string;
  parentId: number | null;
  user: {
    id: string;
    name: string;
  };
}

const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { postId } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const { user, loading } = useAuth();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [isLikeState, setIsLikeState] = useState<boolean>(false);
  const [currentLikeCount, setCurrentLikeCount] = useState<number>(0);


  // リプライ用のコメントIDを設定
  const handleReplyClick = (commentId: number) => {
    setReplyTo(commentId);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        try {
          const response = await axios.get('/api/getPostComments/',{
            params: { 
              postId: postId, 
              loginUserId : user?.uid,
            },
          });
          setPost(response.data.post);
          setComments(response.data.comments);
          setCurrentLikeCount(response.data.post.likeCount);
          setIsLikeState(response.data.post.isliked);
          setReplyTo(null); 
        } catch (err) {
          console.error('ポストの取得に失敗しました:', err);

          
        }
      }
    };
    fetchPostData();
  }, [postId,router,user]);

  const handleCommentSubmit = async () => {
    if (commentContent.trim() === '') return;
    if (!user) {
      alert('コメントするにはログインが必要です。');
      return;
    }
    try {
      const response = await axios.post(
        `/api/comments`,{ 
          userId : user.uid,
          content: commentContent,
          postId: postId,
          parentId: replyTo,
        },
      );
      console.log('Response:', response);
      if(response.status === 201){
        setComments([...comments, response.data.comment]);
        setCommentContent('');
      } else {
        console.error('コメントの投稿に失敗しました:', response.data.error);
        alert('コメントの投稿に失敗しました。');
      }
    } catch (error) {
      console.error('コメントの投稿に失敗しました:', error);
      alert('コメントの投稿に失敗しました。');
    }
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setComments([...comments].reverse());
  };

  // 対象コメントにスクロール
  const scrollToComment = (commentId: number) => {
    const targetElement = document.getElementById(`comment-${commentId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  const handleLikeClick = async () => {
    if (!user || !post) {
      return;
    }
    try {
      const response = await axios.post('/api/postReaction', {
        postId: post.id,
        userId: user.uid,
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

  const handleDeletePost = async (postId: number) => {
    if (!user ||!post) {
      return;
    }
    if (post.userId !== user.uid) {//投稿主とログインユーザーが違う時
      return;
    }
    if (confirm('この投稿を削除しますか？')) {
      try {
        const response = await axios.delete('/api/deleteContent', {
          params: {
            contentId: postId,
            userId: user.uid,
            type : "post",
          },
        });
        if (response.status === 200) {
          alert('投稿を削除しました。');
          router.push('/home'); 
        } else {
          alert('投稿の削除に失敗しました。');
        }
      } catch (error) {
        console.error('投稿の削除に失敗しました:', error);
        alert('投稿の削除に失敗しました。');
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) {
      return;
    }
    if (confirm('このコメントを削除しますか？')) {
      try {
        const response = await axios.delete('/api/deleteContent', {
          params: {
            contentId: commentId,
            userId: user.uid,
            type : "comment",
          },
        });
  
        if (response.status === 200) {
          alert('コメントを削除しました。');
          setComments(comments.filter((comment) => comment.id !== commentId));
        } else {
          alert('コメントの削除に失敗しました。');
        }
      } catch (error) {
        console.error('コメントの削除に失敗しました:', error);
        alert('コメントの削除に失敗しました。');
      }
    }
  };

  if (!post) {
    return <Loading />;
  }

  return (
    <SplitPage sidebar={<Sidebar />}>
      <div className={styles.container}>
        <div className={styles.postContainer}>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.companyName}>企業名: {post.company.name}</p>
            <div className={styles.tagContainer}>
                {post.tags && post.tags.length > 0 ? (
                    post.tags.map((postTag) => (
                    <span key={postTag.id} className={styles.tag}>{postTag.name}</span>
                    ))
                ) : (
                    <span className={styles.noTags}>No Tags</span>
                )}
            </div>
            <div className={styles.postMeta}>
              <Link className={styles.userName} href={`/mypage/${post.user.id}`}>
                投稿者：{post.user.name}
              </Link>
              <p>{new Date(post.createdAt).toLocaleString()}</p>
            </div>
            <Divider className={styles.divider} />
            <ReactMarkdown
                className={styles.markdown}
                remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                rehypePlugins={[rehypeKatex]}
            >
                {post.content}
            </ReactMarkdown>
            <div className={styles.actionButtons}>
              <button
                onClick={handleLikeClick}
                className={`${styles.button} ${isLikeState ? styles.liked : ''}`}
              >
                {isLikeState ? <FaHeart /> : <FaRegHeart />}
                いいね {currentLikeCount}
              </button>
              {user && user.uid === post.userId && (
                <button onClick={() => handleDeletePost(post.id)} className={styles.deleteButton}>
                  <FaTrash /> 削除
                </button>
              )}
            </div>
        </div>
        <div className={styles.sortButtonContainer}>
          <button onClick={handleSortToggle}>
            {sortOrder === 'asc' ? '新しい順' : '古い順'}
          </button>
        </div>
        <div className={styles.commentsContainer}>
          <h2>コメント一覧</h2>
          {comments.length > 0 ? (
          comments.map((comment) => (
              <div key={comment.id} className={styles.comment} id={`comment-${comment.id}`}>
                <p className={styles.commentContent}>
                  {comment.parentId && (
                    <span
                      className={styles.replyTo}
                      onClick={() => scrollToComment(comment.parentId!)}
                    >
                      &lt;-{comment.parentId}
                    </span>
                  )}
                  {comment.content}
                </p>
                <div className={styles.commentMeta}>
                    <div className={styles.commentId}>
                      Comment : {comment.id}
                    </div>
                      <button
                        className={styles.replyButton}
                        onClick={() => setReplyTo(comment.id)}
                      >
                        <FiMessageCircle className={styles.replyIcon} />
                      </button>
                    {new Date(comment.createdAt).toLocaleString()} | by
                    <Link className={styles.userName} href={`/mypage/${post.user.id}`}>
                      {comment.user.name}
                    </Link>
                    {user && user.uid === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className={styles.commentDeleteButton}
                      >
                        <FaTrash /> 
                      </button>
                    )}
                </div>
              </div>
          ))
          ) : (
            <p className={styles.noComments}>まだコメントはありません。</p>
          )}
        </div>
        <div className={styles.commentInputContainer}>
          <h2>コメントを追加</h2>
          {replyTo && (
          <div className={styles.replyingTo}>
            Reply to : {replyTo}{' '}
            <button onClick={() => setReplyTo(null)}>キャンセル</button>
          </div>
          )}
          <textarea
            className={styles.commentTextarea}
            placeholder="コメントを入力してください"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button className={styles.commentButton} onClick={handleCommentSubmit}>
            投稿
          </button>
        </div>
      </div>
    </SplitPage>
  );
};

export default PostDetailPage;
