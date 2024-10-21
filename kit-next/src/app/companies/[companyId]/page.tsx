"use client";

import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useParams  } from 'next/navigation';
import { FaHeart, FaUserGraduate, FaCalendarCheck } from 'react-icons/fa';
import styles from './CompanyPage.module.css';
import Sidebar from '@/components/common/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import { useAuth } from '@/context/AuthContext';

interface Company {
  corporateNumber: string;
  name: string;
  location: string | null;
  employeeNumber: number | null;
  businessSummary: string | null;
  companyUrl: string | null;
  averageIncome: string | null;
  averageAge: number | null;
  averageContinuousServiceYears: number | null;
  interestedCount: number;
  internCount: number;
  eventJoinCount: number;
}

const Company: React.FC<{ companyId: string }> = ({ companyId }) => {
  const { user } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [isInterested, setIsInterested] = useState(false);
  const [isInterned, setIsInterned] = useState(false);
  const [isEventJoined, setIsEventJoined] = useState(false);
  const [currentInterestCount, setCurrentInterestCount] = useState(0);
  const [currentInternCount, setCurrentInternCount] = useState(0);
  const [currentEventJoinCount, setCurrentEventJoinCount] = useState(0);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/getDbCompanyInfo?corporateNumber=${companyId}`);
        if (!response.ok) {
          notFound();
          return;
        }
        const companyData: Company = await response.json();
        console.log('企業情報:', companyData);
        setCompany(companyData);
        setCurrentInterestCount(companyData.interestedCount);
        setCurrentInternCount(companyData.internCount);
        setCurrentEventJoinCount(companyData.eventJoinCount);
      } catch (error) {
        console.error('企業情報の取得エラー:', error);
      }
    };
    fetchCompanyData();
  }, [companyId]);

  useEffect(() => {
    const userId = user?.uid;
    const fetchUserReactions = async () => {
      try {
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
        } else {
          console.error('Failed to fetch user reactions');
        }
      } catch (error) {
        console.error('Error fetching user reactions:', error);
      }
    };

    if (userId && companyId) {
      fetchUserReactions();
    }
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

  if (!company) {
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
          <p>{company.employeeNumber ?? '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>事業概要</h2>
          <p>{company.businessSummary || '情報がありません'}</p>
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
          <h2>平均収入</h2>
          <p>{company.averageIncome || '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>平均年齢</h2>
          <p>{company.averageAge ?? '情報がありません'}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>平均勤続年数</h2>
          <p>{company.averageContinuousServiceYears ?? '情報がありません'}</p>
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
        {/* 投稿コンポーネントをここに表示 */}
      </div>
    </div>
  );
};

const CompanyPage: React.FC = () => {
  const params = useParams(); // useParamsからパラメータを取得
  let companyId = params?.companyId;

  // companyIdが配列である場合、最初の要素を使用
  if (Array.isArray(companyId)) {
    companyId = companyId[0];
  }

  return (
    <SplitPage sidebar={<Sidebar />}>
      <Company companyId={companyId} /> 
    </SplitPage>
  );
};
export default CompanyPage;