'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { TextField, Box, Autocomplete, Button, Typography, Stack, Chip, Divider } from '@mui/material';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';
import styles from './PostWrite.module.css';
import Sidebar from '@/components/common/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import Loading from '@/components/common/Loading';

interface CompanyData {
  corporateNumber: string;
  name: string;
}

const PostWrite: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingState, setLoadingState] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [postDate, setPostDate] = useState<string>('');
  const [errors, setErrors] = useState({
    companyName: '',
    title: '',
    body: '',
  });

  const tags = ['本選考', 'インターン', '春', '夏', '秋', '冬', 'その他'];
  const initialCompanyName = searchParams.get('companyName');

  useEffect(() => {
    if (!loading && !user) {
      setLoadingState("Warning");
      setTimeout(() => {
        setLoadingState(null);
        router.push('/');
      }, 3000);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (initialCompanyName) {
      fetchCompanies(initialCompanyName);
    }
  }, [initialCompanyName]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setPostDate(today);
  }, []);

  const fetchCompanies = async (name: string) => {
    try {
      const response = await axios.get('/api/fetchDbCompanyId', { params: { name } });
      setCompanies(response.data.results);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleCompanySelect = (event: any, value: string | null) => {
    setCompanyName(value || '');
    setErrors({ ...errors, companyName: '' });
  };

  const handleInputChange = async (event: any, value: string) => {
    if (value) {
      await fetchCompanies(value);
    } else {
      setCompanies([]);
    }
  };

  const handleTagChange = (event: any, newValue: string[]) => {
    setSelectedTags(newValue);
  };

  const handleSave = () => {
    if (!companyName) setErrors((prev) => ({ ...prev, companyName: '企業名を入力してください。' }));
    if (!title) setErrors((prev) => ({ ...prev, title: 'タイトルを入力してください。' }));
    if (!body) setErrors((prev) => ({ ...prev, body: '本文を入力してください。' }));

    if (companyName && title && body) {
      alert('投稿が保存されました。');
    }
  };

  if (loadingState ==="Warning"){
    return <Loading type={loadingState} message='No Login'/>;
  }

  return (
    <SplitPage sidebar={<Sidebar />}>
      {isPreview ? (
        <Box className={styles.previewContainer}>
          <Typography variant="h2" className={styles.previewTitle}>{title || 'タイトルが設定されていません'}</Typography>
          <Typography variant="h5" className={styles.previewCompany}>企業名: {companyName || '企業名が設定されていません'}</Typography>
          <Typography variant="body2" className={styles.previewDate}>投稿日: {postDate}</Typography>
          <Divider sx={{ margin: '20px 0' }} />
          <Stack direction="row" spacing={1} className={styles.tagContainer}>
            {selectedTags.map((tag, index) => <Chip key={index} label={tag} className={styles.tag} />)}
          </Stack>
          <ReactMarkdown className={styles.markdown} remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]} rehypePlugins={[rehypeKatex]}>
            {body || '本文がありません。'}
          </ReactMarkdown>
          <Box className={styles.buttonContainer}>
            <Button variant="contained" color="success" onClick={handleSave}>保存</Button>
            <Button variant="contained" color="secondary" onClick={() => setIsPreview(false)}>編集に戻る</Button>
          </Box>
        </Box>
      ) : (
        <Box className={styles.container}>
          <Autocomplete
            options={companies.map((company) => company.name)}
            value={companyName}
            onChange={handleCompanySelect}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField {...params} label="企業" variant="outlined" fullWidth error={!!errors.companyName} helperText={errors.companyName} sx={{ marginBottom: 3 }} />
            )}
          />
          <TextField fullWidth label="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} variant="outlined" error={!!errors.title} helperText={errors.title} sx={{ marginBottom: 3 }} />
          <Autocomplete
            multiple freeSolo filterSelectedOptions options={tags} value={selectedTags}
            onChange={handleTagChange}
            renderInput={(params) => <TextField {...params} label="タグを選択" variant="outlined" />}
            sx={{ marginBottom: 3 }}
          />
          <TextField fullWidth label="本文" value={body} onChange={(e) => setBody(e.target.value)} multiline rows={10} variant="outlined" error={!!errors.body} helperText={errors.body} sx={{ marginBottom: 3 }} />
          <Box className={styles.buttonContainer}>
            <Button
              variant="contained"
              onClick={() => {
                const newErrors = {
                  companyName: companyName ? '' : '企業を選択してください。',
                  title: title ? '' : 'タイトルを入力してください。',
                  body: body ? '' : '本文を入力してください。',
                };
                setErrors(newErrors);
                if (!Object.values(newErrors).some((error) => error !== '')) {
                  setIsPreview(true);
                }
              }}
            >
              プレビュー
            </Button>
          </Box>
        </Box>
      )}
    </SplitPage>
  );
};

export default PostWrite;
