import React,{useState} from 'react';
import Pagination from '../common/Pagination';
import CompanyDetailModal from './CompanyDetailModal';
import axios from 'axios';

interface Company {
  corporate_number: string;
  name: string;
  location: string;
  status: string;
  update_date: string;
}

interface ResultTableProps {
  companies: Company[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const ResultTable: React.FC<ResultTableProps> = ({ companies, currentPage, itemsPerPage, onPageChange }) => {
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = companies.slice(startIdx, startIdx + itemsPerPage);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // モーダルの開閉状態を管理

  const fetchCompanyDetails = async (corporateNumber: string) => {
    try {
      const res = await axios.get(`/api/searchCompanyDetail?corporate_number=${corporateNumber}`);
      console.log(res.data['hojin-infos'])
      setCompanyDetails(res.data['hojin-infos']);
      setIsModalOpen(true); 
    } catch (error) {
      console.error('Error fetching company details:', error);
      setCompanyDetails(null);
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    fetchCompanyDetails(company.corporate_number);
  };
  const closeModal = () => {
    setSelectedCompany(null);
    setCompanyDetails(null);
    setIsModalOpen(false); 
  };

  return (
    <div className="p-6">
      <table className="min-w-full bg-white border border-gray-200 text-black">
        <thead>
          <tr>
            <th className="cursor-pointer p-4 border-b">企業名</th>
            <th className="p-4 border-b">所在地</th>
            <th className="p-4 border-b">更新日</th>
            <th className="p-4 border-b">ステータス</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((company) => (
              <tr key={company.corporate_number}>
                <td
                  className="p-4 border-b cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleCompanyClick(company)}
                >
                  {company.name}
                </td>
                <td className="p-4 border-b">{company.location}</td>
                <td className="p-4 border-b">{new Date(company.update_date).toLocaleDateString()}</td>
                <td className="p-4 border-b">{company.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4 border-b text-center" colSpan={4}>データがありません</td>
            </tr>
          )}
        </tbody>
      </table>

      {currentData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={companies.length}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
      {isModalOpen && (
      <CompanyDetailModal
        show={selectedCompany !== null}
        onClose={closeModal}
        corporateNumber={selectedCompany?.corporate_number || ''}
        companyDetails={companyDetails}
      />
      )}
    </div>
  );
};

export default ResultTable;
