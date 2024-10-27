"use client";
import 'katex/dist/katex.min.css'; 
import React from 'react';
import SplitPage from '@/components/common/SplitPage';
import Sidebar from '@/components/common/Sidebar';
import { useParams } from 'next/navigation';
import UserProfile from '@/components/Mypage/UserProfile';

const Mypage: React.FC = () => {
    const params = useParams();
    let userId = params?.userId;

    if (Array.isArray(userId)) {
        userId = userId[0];
    }

    if (!userId) {
        return <div>ユーザーIDが指定されていません</div>;
    }

    return (
        <SplitPage sidebar={<Sidebar />}>
            <UserProfile userId={userId} />
        </SplitPage>
    );
};
export default Mypage;