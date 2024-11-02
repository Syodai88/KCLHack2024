import React from 'react';
import styles from './Loading.module.css';

const Loading: React.FC = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.ring}>
        loading 
        <span></span>
      </div>
    </div>
  );
};

export default Loading;
