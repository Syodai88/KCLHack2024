"use client";

import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useParams  } from 'next/navigation';
import { FaHeart, FaUserGraduate, FaCalendarCheck } from 'react-icons/fa';
import styles from './CompanyPage.module.css';
import Sidebar from '@/components/common/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import { useAuth } from '@/context/AuthContext';
import type { Company } from '@/interface/interface';
import Loading from '@/components/common/Loading';
import axios from 'axios';
import { Tag,Post } from '@/interface/interface';
import PostCard from '@/components/common/Postcard';


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

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading("Loading");
        const response = await fetch(`/api/getDbCompanyInfo?corporateNumber=${companyId}`);
        if (!response.ok) {
          setIsLoading(null);
          notFound();
          return;
        }
        const companyData: Company = await response.json();
        console.log('企業情報:', companyData);
        setCompany(companyData);
        setCurrentInterestCount(companyData.interestedCount);
        setCurrentInternCount(companyData.internCount);
        setCurrentEventJoinCount(companyData.eventJoinCount);
        setCompanyName(companyData.name); // 投稿ページに企業名を渡すため
        setIsLoading(null);
      } catch (error) {
        setIsLoading("Error");
        console.error('企業情報の取得エラー:', error);
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
    const fetchPosts = async () => {
      if (!user || !companyId) return;
      try {
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
      }
    };

    fetchPosts();
  }, [user, companyId]);



  const handleReactionClick = async (actionType: string) => {
    try {
      const response = await fetch('/api/companyReaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionType:actionType, companyId:companyId, userId:user?.uid }),
      });

      if (response.ok) {
        if (actionType === 'interest') {
          setCurrentInterestCount((prevCount) => (isInterested ? prevCount - 1 : prevCount + 1));
          setIsInterested((prev) => !prev);
        } else if (actionType === 'intern') {
          setCurrentInternCount((prevCount) => (isInterned ? prevCount - 1 : prevCount + 1));
          setIsInterned((prev) => !prev);
        } else if (actionType === 'eventJoin') {
          setCurrentEventJoinCount((prevCount) => (isEventJoined ? prevCount - 1 : prevCount + 1));
          setIsEventJoined((prev) => !prev);
        }
      } else {
        console.error('Failed to update reaction');
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  if (isLoading ==="Loading"){
    return <Loading/>
  }else if (isLoading ==="Error"){
    return <Loading type="Error" message='Company Error'/>
  }else if (!company) {
    return <div className={styles.error}>企業の詳細を読み込めませんでした</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.companyHeader}>
        <h1 className={styles.companyName}>{company.name}</h1>
      </div>
      <div className={styles.companyInfo}>
        <div className={styles.infoItem}>
          <h2>所在地</h2>
          <p>{company.location || '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>従業員数</h2>
          <p>{company.employeeNumberAi ?? '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>事業概要</h2>
          <p>{company.businessSummary || '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>事業概要（生成AIによる情報）</h2>
          <p>{company.businessSummaryAi || '情報がありません'}</p>
        </div>
        {company.companyUrl && (
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
          <p>{company.averageSalaryAi || '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>平均年齢（生成AI）</h2>
          <p>{company.averageAgeAi ?? '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>平均勤続年数（生成AI）</h2>
          <p>{company.averageContinuousServiceYearsAi ?? '情報がありません'}</p>
        </div>
      </div>

      <div className={styles.reactionButtons}>
        <button
          onClick={() => handleReactionClick('interest')}
          className={`${styles.button} ${isInterested ? styles.interested : ''}`}
        >
          <FaHeart />
          興味あり ({currentInterestCount})
        </button>
        <button
          onClick={() => handleReactionClick('intern')}
          className={`${styles.button} ${isInterned ? styles.interned : ''}`}
        >
          <FaUserGraduate />
          インターン参加者 ({currentInternCount})
        </button>
        <button
          onClick={() => handleReactionClick('eventJoin')}
          className={`${styles.button} ${isEventJoined ? styles.attendedEvent : ''}`}
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
        ) : (
          <p>この企業に関連する投稿はありません。</p>
        )}
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