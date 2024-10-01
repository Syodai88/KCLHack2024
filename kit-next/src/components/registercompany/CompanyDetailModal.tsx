import React, { useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full transform transition-transform duration-300 scale-100 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 w-8 h-8 rounded-full flex justify-center items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Close"
        >
          <CloseIcon fontSize="small" /> 
        </button>
        
        <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4 text-gray-900">{details.name}</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">法人番号</h2>
          <p className="pl-2 break-words bg-gray-100 p-2 rounded text-gray-700">{corporateNumber}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">所在地</h2>
          <p className="pl-2 break-words bg-gray-100 p-2 rounded text-gray-700">{details.location}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">ホームページ</h2>
          <p className="pl-2 break-words bg-gray-100 p-2 rounded">
            <a href={details.company_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {details.company_url}
            </a>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">業務内容</h2>
          <p className="pl-2 break-words bg-gray-100 p-2 rounded whitespace-pre-wrap text-gray-700">{details.business_summary}</p>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={onRegister}
            className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;
