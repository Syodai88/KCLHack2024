import React from 'react';

interface SplitPageProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const SplitPage: React.FC<SplitPageProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen flex ">
      {/* 左側のコンテンツ部分の背景を `background` に設定 */}
      <div className="w-3/4 p-4 bg-background">
        {children}
      </div>
        {/* 右側のサイドバー部分の背景を `white` に設定 */}
      <div className="w-1/4 p-4 bg-white">
        {sidebar}
      </div>
    </div>
  );
}

export default SplitPage;
