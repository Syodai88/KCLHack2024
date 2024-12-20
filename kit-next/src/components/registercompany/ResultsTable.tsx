import React,{useState} from 'react';
import Pagination from './Pagination';
import CompanyDetailModal from './CompanyDetailModal/CompanyDetailModal';
import axios from 'axios';
import Loading from '../common/Loading/Loading';
import { useRouter } from 'next/navigation';
import ConfirmModal from '../common/ConfirmModal/ConfirmModal';

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
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [registerState, setRegisterState] = useState<string | null>(null); // Loading、Error、Warning

  const fetchCompanyDetails = async (corporateNumber: string) => {
    try {
      const res = await axios.get(`/api/searchCompanyDetail?corporate_number=${corporateNumber}`);
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
    setCompanyDetails(null);
    setIsModalOpen(false); 
  };

  const handleRegister = async () => {
    if (!selectedCompany) return;
    
    try {
      setRegisterState("Loading");
      const generateResponse = await axios.post('/api/generateCompanyInfo', {
        companyName: selectedCompany.name,
      });
      if (generateResponse.status !== 200) {
        setRegisterState('Error');
        setTimeout(() => {
          setRegisterState(null);
        }, 3000);
        return;
      }
      // AIで生成された企業情報
      const aiCompanyDetails = generateResponse.data;
  
      // /api/registerCompanyエンドポイントにPOSTリクエストを送信
      const response = await axios.post('/api/registerCompany', {
        corporateNumber: selectedCompany.corporate_number,
        name: selectedCompany.name,
        location: selectedCompany.location,
        representativeName: companyDetails[0].representative_name,
        employeeNumber: companyDetails[0].employee_numbe,
        employeeNumberAi: aiCompanyDetails.employeeNumber,
        businessSummary: companyDetails[0].business_summary,
        businessSummaryAi: aiCompanyDetails.businessSummary,
        keyMessageAi : aiCompanyDetails.keyMessage,
        companyUrl: companyDetails[0].company_url || aiCompanyDetails.companyUrl,
        dateOfEstablishment: companyDetails[0].date_of_establishment || aiCompanyDetails.dateOfEstablishment,
        averageContinuousServiceYearsAi: companyDetails[0].average_continuous_service_years || aiCompanyDetails.averageContinuousServiceYears,
        averageAgeAi: aiCompanyDetails.averageAge,
        averageSalaryAi: aiCompanyDetails.averageSalary,
        updateDate: selectedCompany.update_date,
      });
  
      if (response.status === 201) {
        setRegisterState('Success');
        setTimeout(() => {
          setRegisterState(null);
        }, 3000);
        setIsConfirmModalOpen(true);
      } else {
        setRegisterState('Error');
        setTimeout(() => {
          setRegisterState(null);
          setSelectedCompany(null);
        }, 3000);
      }
    } catch (error:any) {
      if (error.response) {
        if (error.response.status === 409) {
          // 既に登録されている場合
          setRegisterState('Warning');
          console.error('Company already registered:', error.response.data.error);
          setTimeout(() => {
            setRegisterState(null);
          }, 3000);
          setIsConfirmModalOpen(true);
        } else {
          // その他のエラー
          console.error('Error registering company:', error.response.data.error);
          setRegisterState('Error');
          setTimeout(() => {
            setRegisterState(null);
            setSelectedCompany(null);
          }, 3000);
        }
      } else {
        // ネットワークエラーなど
        console.error('Network error:', error);
        setRegisterState('Error');
          setTimeout(() => {
            setRegisterState(null);
            setSelectedCompany(null);
          }, 3000);
      }
    } finally {
      closeModal();
    }
  };

  const handleConfirmModalClose = () => {
    if (selectedCompany) {
      router.push(`/companies/${selectedCompany.corporate_number}`);
    }
    setIsConfirmModalOpen(false);
    setSelectedCompany(null);
  };

  if(registerState === "Loading"){
    return <Loading message='登録中...' />
  }else if(registerState === "Success"){
    return <Loading message='登録完了！' type='Success' />
  }else if(registerState === "Error"){
    return <Loading message='失敗しました' type='Error' />
  }else if(registerState === "Warning"){
    return <Loading message='登録済' type='Warning' />
  }


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
        onRegister={handleRegister}
      />
      )}
      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          message="企業ページに移動します"
          caution='環境によっては遷移できない場合があります。'
          type="success"
          onClose={handleConfirmModalClose}
          confirmText="OK！"
        />
      )}
    </div>
  );
};

export default ResultTable;
