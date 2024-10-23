// Mypage.tsx
"use client";
import React, { useState, useEffect } from 'react';
import SplitPage from '@/components/common/SplitPage';
import Sidebar from '@/components/common/Sidebar';
import { useParams } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import { RxAvatar } from "react-icons/rx";
import Image from 'next/image';
import styles from './Mypage.module.css';

interface Profile {
  name: string;
  year: string;
  department: string;
  other: string;
  profileImage?: string;
}

const MypageEdit: React.FC<{ userId: string }> = ({ userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    year: "",
    department: "",
    other: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");

  // 学部/府の選択肢
  const faculties = [
    { value: '工学部', label: '工学部' },
    { value: '情報工学部', label: '情報工学部' },
    { value: '工学府', label: '工学府' },
    { value: '情報工学府', label: '情報工学府' },
    { value: '生命体工学研究科', label: '生命体工学研究科' },
  ];

  // 学部/府ごとの学科/専攻の選択肢
  const departments: { [key: string]: { value: string; label: string }[] } = {
    '工学部': [
      { value: '1類', label: '1類' },
      { value: '2類', label: '2類' },
      { value: '3類', label: '3類' },
      { value: '4類', label: '4類' },
      { value: '5類', label: '5類' },
      { value: '建設社会工学科', label: '建設社会工学科' },
      { value: '機械知能工学科', label: '機械知能工学科' },
      { value: '宇宙システム工学科', label: '宇宙システム工学科' },
      { value: '電気電子工学科', label: '電気電子工学科' },
      { value: '応用化学科', label: '応用化学科' },
      { value: 'マテリアル工学科', label: 'マテリアル工学科' },
    ],
    '情報工学部': [
      { value: '1類', label: '1類' },
      { value: '2類', label: '2類' },
      { value: '3類', label: '3類' },
      { value: '知能情報工学科', label: '知能情報工学科' },
      { value: '情報・通信工学科', label: '情報・通信工学科' },
      { value: '知的システム工学科', label: '知的システム工学科' },
      { value: '物理情報工学科', label: '物理情報工学科' },
      { value: '生命化学情報工学科', label: '生命化学情報工学科' },
    ],
    '工学府': [
      { value: '博士前期課程 工学専攻', label: '博士前期課程 工学専攻' },
      { value: '博士後期課程 工学専攻', label: '博士後期課程 工学専攻' },
    ],
    '情報工学府': [
      { value: '博士前期課程 情報創成工学専攻', label: '博士前期課程 情報創成工学専攻' },
      { value: '博士後期課程 情報創成工学専攻', label: '博士後期課程 情報創成工学専攻' },
    ],
    '生命体工学研究科': [
      { value: '博士前期課程 生体機能応用工学専攻', label: '博士前期課程 生体機能応用工学専攻' },
      { value: '博士前期課程 人間知能システム工学専攻', label: '博士前期課程 人間知能システム工学専攻' },
      { value: '博士後期課程 生命体工学専攻', label: '博士後期課程 生命体工学専攻' },
    ],
  };

  // 学年の選択肢
  const years = [
    'B1', 'B2', 'B3', 'B4',
    'M1', 'M2',
    'D1', 'D2', 'D3',
    'その他',
  ];

  // ユーザーデータを取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/getUserProfile?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.name,
            year: data.year,
            department: data.department,
            other: data.other,
          });
          setSelectedImage(data.profileImage || null);
          // departmentを学部/府と学科/専攻に分割
          if (data.department) {
            const splitIndex = data.department.indexOf(" ");
            if (splitIndex !== -1) {
              setFaculty(data.department.substring(0, splitIndex));
              setDepartment(data.department.substring(splitIndex + 1));
            } else {
              setFaculty(data.department);
              setDepartment("");
            }
          }
        } else {
          console.error("ユーザーデータの取得に失敗しました");
        }
      } catch (error) {
        console.error("ユーザーデータの取得中にエラーが発生しました:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  // フォームの値変更を管理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name" || name === "year" || name === "other") {
      setProfile(prev => ({ ...prev, [name]: value }));
    } else if (name === "faculty") {
      setFaculty(value);
      setDepartment(""); // 学部/府が変わったら学科/専攻をリセット
    } else if (name === "department") {
      setDepartment(value);
    }
  };

  // 画像を選択する関数
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      setSelectedImage(imageURL);
    }
  };

   // プロフィールを保存する関数
   const handleSave = async () => {
    // 学部/府と学科/専攻を結合してdepartmentとして保存
    const combinedDepartment = faculty && department ? `${faculty} ${department}` : faculty || department || "";
    const updatedProfile = {
      ...profile,
      department: combinedDepartment,
    };

    try {
      const response = await fetch('/api/updateUserProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profile: updatedProfile,
          profileImage: selectedImage,
        }),
      });
      if (response.ok) {
        setIsEditing(false);
        setProfile(updatedProfile);
      } else {
        console.error("プロフィールの更新に失敗しました");
      }
    } catch (error) {
      console.error("プロフィールの更新中にエラーが発生しました:", error);
    }
  };


  // 卒業年度の計算
  const calculateGraduationYear = (year: string): string => {
    const currentYear = new Date().getFullYear();
    switch (year) {
      case 'B1':
        return `${currentYear + 4}年卒`;
      case 'B2':
        return `${currentYear + 3}年卒`;
      case 'B3':
        return `${currentYear + 2}年卒`;
      case 'B4':
        return `${currentYear + 1}年卒`;
      case 'M1':
        return `${currentYear + 2}年卒`;
      case 'M2':
        return `${currentYear + 1}年卒`;
      case 'D1':
        return `${currentYear + 3}年卒`;
      case 'D2':
        return `${currentYear + 2}年卒`;
      case 'D3':
        return `${currentYear + 1}年卒`;
      default:
        return '卒業年度不明';
    }
  };
    
  // 選択された学部/府に応じて学科/専攻を取得
  const getDepartmentsByFaculty = (faculty: string) => {
    return departments[faculty] || [];
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <label htmlFor="imageUpload">
          <Avatar className={styles.avatar}>
            {selectedImage ? (
              <img src={selectedImage} alt="選択された画像" style={{ width: '100%', height: '100%' }} />
            ) : (
              <RxAvatar size={80} />
            )}
          </Avatar>
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>

      {isEditing ? (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>ニックネーム</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>学年</label>
            <select
              name="year"
              value={profile.year}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">選択してください</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>学部/府</label>
            <select
              name="faculty"
              value={faculty}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">選択してください</option>
              {faculties.map(facultyOption => (
                <option key={facultyOption.value} value={facultyOption.value}>{facultyOption.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>学科/専攻</label>
            <select
              name="department"
              value={department}
              onChange={handleInputChange}
              className={styles.select}
              disabled={!faculty}
            >
              <option value="">選択してください</option>
              {getDepartmentsByFaculty(faculty).map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>資格など</label>
            <textarea
              name="other"
              value={profile.other}
              onChange={handleInputChange}
              className={styles.textarea}
            />
          </div>
          <button className={styles.button} onClick={handleSave}>
            保存
          </button>
        </div>
      ) : (
        <div className={styles.profileInfo}>
          <p className={styles.profileItem}><strong>ニックネーム:</strong> {profile.name}</p>
          <p className={styles.profileItem}><strong>卒業年度:</strong> {calculateGraduationYear(profile.year)}</p>
          <p className={styles.profileItem}><strong>所属:</strong> {profile.department}</p>
          <p className={styles.profileItem}><strong>資格:</strong> {profile.other}</p>
          <button className={styles.editButton} onClick={() => setIsEditing(true)}>
            編集
          </button>
        </div>
      )}
    </div>
  );
};

const Mypage: React.FC = () => {
  const params = useParams();
  let userId = params?.userId;

  // userIdが配列の場合、最初の要素を使用
  if (Array.isArray(userId)) {
    userId = userId[0];
  }

  if (!userId) {
    return <div>ユーザーIDが指定されていません</div>;
  }

  return (
    <SplitPage sidebar={<Sidebar />}>
      <MypageEdit userId={userId} />
    </SplitPage>
  );
};

export default Mypage;