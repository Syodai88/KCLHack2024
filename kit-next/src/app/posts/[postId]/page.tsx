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
import Loading from '@/components/common/Loading';


interface Post {
  id: number;
  userId: string;
  companyId: string;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
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

  // リプライ用のコメントIDを設定
  const handleReplyClick = (commentId: number) => {
    setReplyTo(commentId);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        try {
          const response = await axios.get('/api/getPostComments/',{
            params: { postId: postId },
          });
          setPost(response.data.post);
          setComments(response.data.comments);
          setReplyTo(null); 
        } catch (err) {
          console.error('ポストの取得に失敗しました:', err);
          router.push('/404');
        }
      }
    };
    fetchPostData();
  }, [postId,router]);

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
  
  

  if (!post) {
    return <Loading />;
  }

  return (
    <SplitPage sidebar={<Sidebar />}>
      <div className={styles.container}>
        {/* ポストの表示 */}
        <div className={styles.postContainer}>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.companyName}>企業名: {post.company.name}</p>
            <div className={styles.tagContainer}>
                {post.tags && post.tags.length > 0 ? (
                    post.tags.map((postTag) => (
                    <span key={postTag.id} className={styles.tag}>{postTag.name}</span>
                    ))
                ) : (
                    <span className={styles.noTags}>タグがありません</span>
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
