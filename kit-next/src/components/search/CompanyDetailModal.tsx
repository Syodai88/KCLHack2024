//データベースに保存する機能も作成予定
import React from 'react';

interface CompanyDetailModalProps {
  show: boolean;
  onClose: () => void;
  corporateNumber: string | null;
  companyDetails: any | null; 
}


const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ show, onClose, corporateNumber, companyDetails }) => {
  if (!show) return null;
  console.log(companyDetails);
  const details = companyDetails[0];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">企業情報</h2>
        <p>法人番号: {corporateNumber}</p>
        <p>会社名: {details.representative_name}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailModal;
