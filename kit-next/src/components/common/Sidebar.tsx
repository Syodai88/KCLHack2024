'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import styled from '@emotion/styled';

const SidebarContainer = styled.div`
  width: 200px;
  padding: 10px;
  border-left: 1px solid #ccc; // サイドバーの左にボーダーを追加
  background-color: #ffffff; // サイドバーの背景色を白に設定
  position: absolute; 
  right: 0; // 右に配置
  top: 0; // 上に配置
  height: 100%; // 高さをビューポート全体に設定
  overflow-y: auto; // 縦にスクロールできるように設定
  margin-top: 60px;
`;

const StyledLink = styled(Link)`
  display: block;
  color: #007bff;
  text-decoration: none;
  margin: 10px 0;
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  margin-bottom: 20px;
`;

const MyPage: React.FC = () => {
    const router = useRouter();

    const handleAvatarClick = () => {
      router.push('/my-page');
    };

    return (
      <SidebarContainer>
        <StyledAvatar onClick={handleAvatarClick}>
          {/* ここにアイコン画像を追加します */}
          <img src="/path-to-avatar-icon.png" alt="avatar" />
        </StyledAvatar>
        <StyledLink href="/post-page">感想投稿ページ</StyledLink>
        <StyledLink href="/search-page">企業検索ページ</StyledLink>
        <StyledLink href="/register-page">企業登録ページ</StyledLink>
        <StyledLink href="/details-page">感想詳細ページ</StyledLink>
      </SidebarContainer>
    );
};

export default MyPage;
