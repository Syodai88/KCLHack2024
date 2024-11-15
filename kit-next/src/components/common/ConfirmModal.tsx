import React from 'react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  caution?: string;
  type: 'confirm' | 'success';
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  caution,
  type,
  onConfirm,
  onCancel,
  onClose,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.confirmModal} ${styles[type]}`}>
        <p className={styles.message}>{message}</p>
        <p className={styles.caution}>*{caution}*</p>
        <div className={styles.buttons}>
          {type === 'confirm' && (
            <>
              <button className={styles.cancelButton} onClick={onCancel}>
                {cancelText}
              </button>
              <button className={styles.confirmButton} onClick={onConfirm}>
                {confirmText}
              </button>
            </>
          )}
          {type === 'success' && (
            <button className={styles.confirmButton} onClick={onClose}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
