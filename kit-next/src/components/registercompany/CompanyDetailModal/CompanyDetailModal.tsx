import React, { useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './CompanyDetailModal.css';

interface CompanyDetailModalProps {
  show: boolean;
  onClose: () => void;
  corporateNumber: string | null;
  companyDetails: any | null; 
  onRegister: () => void;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ show, onClose, corporateNumber, companyDetails, onRegister }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // モーダル外クリックで閉じる
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [show, onClose]);

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose]);

  if (!show || !companyDetails || !companyDetails[0]) return null;
  const details = companyDetails[0];

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="company-detail-modal">
        
        <h1 className="modal-title">{details.name}</h1>
        
        <div className="modal-section">
          <h2 className="modal-subtitle">法人番号</h2>
          <p className="modal-content">{corporateNumber}</p>
        </div>

        <div className="modal-section">
          <h2 className="modal-subtitle">所在地</h2>
          <p className="modal-content">{details.location}</p>
        </div>

        <div className="modal-section">
          <h2 className="modal-subtitle">ホームページ</h2>
          <p className="modal-content">
            <a href={details.company_url} target="_blank" rel="noopener noreferrer">
              {details.company_url}
            </a>
          </p>
        </div>

        <div className="modal-section">
          <h2 className="modal-subtitle">業務内容</h2>
          <p className="modal-content">{details.business_summary}</p>
        </div>

        <div className="modal-footer">
          <button
            onClick={onRegister}
            className="modal-register-button"
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;
