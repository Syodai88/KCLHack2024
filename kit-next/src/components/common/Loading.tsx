import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps{
  message?: string;//デフォルトはLoading
  type?: string; //デフォルトはLoading,オプションでWarningとError
}

const Loading: React.FC<LoadingProps> = ({message = "Loading",type="Loading"}) => {
  return (
    <div className={`${styles.overlay} ${type ? styles[type] : ''}`}>
      <div className={styles.ring}>
        {message}
        <span></span>
      </div>
    </div>
  );
};

export default Loading;
