"use client";

import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useParams  } from 'next/navigation';
import { FaHeart, FaUserGraduate, FaCalendarCheck } from 'react-icons/fa';
import styles from './CompanyPage.module.css';
import Sidebar from '@/components/common/Sidebar/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import { useAuth } from '@/context/AuthContext';
import type { Company } from '@/interface/interface';
import Loading from '@/components/common/Loading/Loading';
import axios from 'axios';
import { Post } from '@/interface/interface';
import PostCard from '@/components/common/PostCard/Postcard';


const Company: React.FC<{ companyId: string,setCompanyName: (name: string | null) => void  }> = ({ companyId,setCompanyName }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isInterested, setIsInterested] = useState(false);
  const [isInterned, setIsInterned] = useState(false);
  const [isEventJoined, setIsEventJoined] = useState(false);
  const [currentInterestCount, setCurrentInterestCount] = useState(0);
  const [currentInternCount, setCurrentInternCount] = useState(0);
  const [currentEventJoinCount, setCurrentEventJoinCount] = useState(0);
  const [posts ,setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isCompanyLoaded, setIsCompanyLoaded] = useState<boolean>(false);
  const [isPostsLoaded, setIsPostsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading("Loading");
        setIsCompanyLoaded(false);
        const response = await fetch(`/api/getDbCompanyInfo?corporateNumber=${companyId}`);
        if (!response.ok) {
          setIsLoading("Error");
          setTimeout(() => {
            setIsLoading(null);
          }, 3000);
          return;
        }
        const companyData: Company = await response.json();
        setCompany(companyData);
        setCurrentInterestCount(companyData.interestedCount);
        setCurrentInternCount(companyData.internCount);
        setCurrentEventJoinCount(companyData.eventJoinCount);
        setCompanyName(companyData.name);
        setIsLoading(null);
      } catch (error) {
        setIsLoading("Error");
        setTimeout(() => {
          setIsLoading(null);
        }, 3000);
        console.error('企業情報の取得エラー:', error);
      } finally {
        setIsCompanyLoaded(true);
      }
    };
    fetchCompanyData();
  }, [companyId,setCompanyName]);

  useEffect(() => {
    const userId = user?.uid;
    const fetchUserReactions = async () => {
      try {
        setIsLoading("Loading");
        const response = await fetch('/api/fetchUserReactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId:userId, companyId:companyId }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsInterested(data.isInterested);
          setIsInterned(data.isInterned);
          setIsEventJoined(data.isEventJoined);
          setIsLoading(null);
        } else {
          setIsLoading("Error");
          console.error('Failed to fetch user reactions');
          setTimeout(() => {
            setIsLoading(null);
          }, 3000);

        }
      } catch (error) {
        setIsLoading("Error");
        console.error('Error fetching user reactions:', error);
        setTimeout(() => {
          setIsLoading(null);
        }, 3000);
      } 
    };
    if (userId && companyId) {
      fetchUserReactions();
    }
  }, [user, companyId]);

  // 企業に紐づいた投稿を取得
  useEffect(() => {
    setIsPostsLoaded(false);
    const fetchPosts = async () => {
      if (!user || !companyId) return;
      try {
        setIsLoading("Loading");
        const response = await axios.get('/api/fetchPostCard', {
          params: { companyId, loginUserId: user.uid },
        });
        if (response.status === 200) {
          setPosts(response.data.posts);
        } else {
          console.error('投稿の取得に失敗しました');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsPostsLoaded(true);
        setIsLoading(null);
      }
    };

    fetchPosts();
  }, [user, companyId]);



const [isInterestButtonDisabled, setIsInterestButtonDisabled] = useState(false);
const [isInternButtonDisabled, setIsInternButtonDisabled] = useState(false);
const [isEventJoinButtonDisabled, setIsEventJoinButtonDisabled] = useState(false);

const handleReactionClick = async (actionType: string) => {
  // 連続クリック防止
  if (actionType === 'interest') {
    setIsInterestButtonDisabled(true);
  } else if (actionType === 'intern') {
    setIsInternButtonDisabled(true);
  } else if (actionType === 'eventJoin') {
    setIsEventJoinButtonDisabled(true);
  }

  if (actionType === 'interest') {
    setIsInterested((prev) => !prev);
    setCurrentInterestCount((prevCount) => (isInterested ? prevCount - 1 : prevCount + 1));
  } else if (actionType === 'intern') {
    setIsInterned((prev) => !prev);
    setCurrentInternCount((prevCount) => (isInterned ? prevCount - 1 : prevCount + 1));
  } else if (actionType === 'eventJoin') {
    setIsEventJoined((prev) => !prev);
    setCurrentEventJoinCount((prevCount) => (isEventJoined ? prevCount - 1 : prevCount + 1));
  }

  try {
    const response = await fetch('/api/companyReaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ actionType, companyId, userId: user?.uid }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    // エラーが発生した場合、状態を元に戻す
    if (actionType === 'interest') {
      setIsInterested((prev) => !prev);
      setCurrentInterestCount((prevCount) => (isInterested ? prevCount - 1 : prevCount + 1));
    } else if (actionType === 'intern') {
      setIsInterned((prev) => !prev);
      setCurrentInternCount((prevCount) => (isInterned ? prevCount - 1 : prevCount + 1));
    } else if (actionType === 'eventJoin') {
      setIsEventJoined((prev) => !prev);
      setCurrentEventJoinCount((prevCount) => (isEventJoined ? prevCount - 1 : prevCount + 1));
    }
    console.error('Error updating reaction:', error);

  } finally {
    setTimeout(() => {
      if (actionType === 'interest') {
        setIsInterestButtonDisabled(false);
      } else if (actionType === 'intern') {
        setIsInternButtonDisabled(false);
      } else if (actionType === 'eventJoin') {
        setIsEventJoinButtonDisabled(false);
      }
    }, 1500); 
  }
};

  if (isLoading ==="Loading"){
    return <Loading/>
  }else if (isLoading ==="Error"){
    return <Loading type="Error" message='Company Error'/>
  }

  if (isCompanyLoaded && !company) {
    return <div className={styles.error}>企業の詳細を読み込めませんでした</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.companyHeader}>
        <h1 className={styles.companyName}>{company?.name}</h1>
      </div>
      <div className={styles.companyInfo}>
        <div className={styles.infoItem}>
          <h2>所在地</h2>
          <p>{company?.location || '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>従業員数</h2>
          <p>{company?.employeeNumberAi ?? '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>事業概要</h2>
          <p>{company?.businessSummary || '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>事業概要（生成AIによる情報）</h2>
          <p>{company?.businessSummaryAi || '情報がありません'}</p>
        </div>
        {company?.companyUrl && (
          <div className={styles.infoItem}>
            <h2>公式サイト</h2>
            <p>
              <a href={company.companyUrl} target="_blank" rel="noopener noreferrer" className={styles.companyLink}>
                公式サイトはこちら
              </a>
            </p>
          </div>
        )}
        <div className={styles.infoItem}>
          <h2>平均収入（生成AI）</h2>
          <p>{company?.averageSalaryAi || '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>平均年齢（生成AI）</h2>
          <p>{company?.averageAgeAi ?? '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>平均勤続年数（生成AI）</h2>
          <p>{company?.averageContinuousServiceYearsAi ?? '情報がありません'}</p>
        </div>
      </div>

      <div className={styles.reactionButtons}>
        <button
          onClick={() => handleReactionClick('interest')}
          className={`${styles.button} ${isInterested ? styles.interested : ''}`}
          disabled={isInterestButtonDisabled}
        >
          <FaHeart />
          興味あり ({currentInterestCount})
        </button>
        <button
          onClick={() => handleReactionClick('intern')}
          className={`${styles.button} ${isInterned ? styles.interned : ''}`}
          disabled={isInternButtonDisabled}
        >
          <FaUserGraduate />
          インターン参加者 ({currentInternCount})
        </button>
        <button
          onClick={() => handleReactionClick('eventJoin')}
          className={`${styles.button} ${isEventJoined ? styles.attendedEvent : ''}`}
          disabled={isEventJoinButtonDisabled}
        >
          <FaCalendarCheck />
          イベント参加者 ({currentEventJoinCount})
        </button>
      </div>

      {/* 投稿部分は以下に追加 */}
      <div className={styles.postsSection}>
        <h2>投稿一覧</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} loginUserId={user?.uid || ''} isLiked={post.isLiked} />
          ))
        ) : isPostsLoaded ?(
          <p>この企業に関連する投稿はありません。</p>
        ) : null}
      </div>
    </div>
  );
};

const CompanyPage: React.FC = () => {
  const params = useParams(); // useParamsからパラメータを取得
  let companyId = params?.companyId;
  const [companyName, setCompanyName] = useState<string | null>(null);//sidebarに渡すため

  // companyIdが配列である場合、最初の要素を使用
  if (Array.isArray(companyId)) {
    companyId = companyId[0];
  }

  return (
    <SplitPage 
      sidebar={<Sidebar companyName={companyName}/>}
    >
      <Company companyId={companyId} setCompanyName={setCompanyName} /> 
    </SplitPage>
  );
};
export default CompanyPage;