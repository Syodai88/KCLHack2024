import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps{
  message?: string;//デフォルトはLoading
}

const Loading: React.FC<LoadingProps> = ({message = "Loading"}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.ring}>
        {message}
        <span></span>
      </div>
    </div>
  );
};

export default Loading;
