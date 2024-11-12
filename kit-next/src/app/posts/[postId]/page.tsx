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
}

const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { postId } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        try {
          const response = await axios.get(`/api/getPostComments/${postId}`);
          setPost(response.data.post);
          setComments(response.data.comments);
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
      const idToken = await user.getIdToken();
      const response = await axios.post(
        `/api/posts/${postId}/comments`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setComments([...comments, response.data.comment]);
      setCommentContent('');
    } catch (error) {
      console.error('コメントの投稿に失敗しました:', error);
      alert('コメントの投稿に失敗しました。');
    }
  };

  if (!post) {
    return <div>読み込み中...</div>;
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
            <p>投稿者：{post.user.name}</p>
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

        {/* コメント入力欄 */}
        <div className={styles.commentInputContainer}>
            <h2>コメントを追加</h2>
            <textarea
            className={styles.commentTextarea}
            placeholder="コメントを入力してください"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>
            <button className={styles.commentButton} onClick={handleCommentSubmit}>
            投稿
            </button>
        </div>

        {/* コメント一覧 */}
        <div className={styles.commentsContainer}>
            <h2>コメント一覧</h2>
            {comments.length > 0 ? (
            comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                <p className={styles.commentContent}>{comment.content}</p>
                <div className={styles.commentMeta}>
                    {new Date(comment.createdAt).toLocaleString()}
                </div>
                </div>
            ))
            ) : (
            <p className={styles.noComments}>まだコメントはありません。</p>
            )}
        </div>
        </div>
    </SplitPage>
  );
};

export default PostDetailPage;
