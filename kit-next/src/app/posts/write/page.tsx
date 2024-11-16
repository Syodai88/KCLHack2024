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
import Sidebar from '@/components/common/Sidebar/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import Loading from '@/components/common/Loading/Loading';
import { headers } from 'next/headers';

interface CompanyData {
  corporateNumber: string;
  name: string;
}
interface Tag {
  id: number;
  name: string;
}

const PostWrite: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingState, setLoadingState] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [postDate, setPostDate] = useState<string>('');
  const [errors, setErrors] = useState({
    companyName: '',
    title: '',
    body: '',
  });

  const defaultTags = ['本選考', 'インターン', '春', '夏', '秋', '冬'];
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

  //初回遷移時に企業名があればセット
  useEffect(() => {
    if (initialCompanyName) {
      fetchCompanies(initialCompanyName);
      setCompanyName(initialCompanyName);
    }
  }, [initialCompanyName]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setPostDate(today);
  }, []);

  //データベースから企業名を検索
  const fetchCompanies = async (name: string) => {
    try {
      const response = await axios.get('/api/fetchDbCompanyId', { params: { name } });
      setCompanies(response.data.results);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };
  
  const fetchTags = async (query: string) => {
    try {
      const response = await axios.get('/api/searchTags', { params: { query } });
      const fetchedTags = response.data;
      const mergedTags = [
        ...defaultTags.map((tag) => ({ id: -1, name: tag })), // デフォルトタグ
        ...fetchedTags,
      ];
      // 重複削除
      const uniqueTags = Array.from(new Map(mergedTags.map(tag => [tag.name, tag])).values());
      setTags(uniqueTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCompanySelect = (event: any, value: string | null) => {
    setCompanyName(value || '');
    setErrors({ ...errors, companyName: '' });
    const selectedCompany = companies.find((company) => company.name === value);
    setSelectedCompanyId(selectedCompany ? selectedCompany.corporateNumber : null);
  };

  const handleInputChange = async (event: any, value: string) => {
    if (value) {
      await fetchCompanies(value);
    } else {
      setCompanies([]);
    }
  };

  const handleTagInputChange = async (event: any, value: string) => {
    if (value) {
      await fetchTags(value);
    } else {
      setTags(defaultTags.map(tag => ({ id: -1, name: tag })));
    }
  };

  const handleTagFocus = () => {
    setTags(defaultTags.map(tag => ({ id: -1, name: tag })));
  };
  
  
  // タグの選択処理
  const handleTagChange = (event: any, newValue: string[]) => {
    const existingTagNames = tags.map((tag) => tag.name);
    const newTagNames = newValue.filter((tag) => !existingTagNames.includes(tag));
    setSelectedTags(newValue);
    setNewTags(newTagNames);
  };

  const handlePreview = async () => {
    // バリデーションチェック
    const newErrors = {
      companyName: companyName ? '' : '企業名を選択してください。',
      title: title ? '' : 'タイトルを入力してください。',
      body: body ? '' : '本文を入力してください。',
    };
    setErrors(newErrors);
    // バリデーションエラーがある場合は処理を中断
    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }
  
    // companies内にcompanyNameが存在するかチェック
    const selectedCompany = companies.find((company) => company.name === companyName);
  
    if (selectedCompany) {
      // 正しい企業名が見つかった場合、IDをセット
      setSelectedCompanyId(selectedCompany.corporateNumber);
      setIsPreview(true); // プレビューに移動
    } else {
      // 企業名が一致しない場合はエラーを表示
      setErrors((prev) => ({ ...prev, companyName: '正しい企業名を選択してください。' }));
    }
  };
  

  const handleSave = async () => {
    //適当なバリデーションチェックをする
    if (!companyName) setErrors((prev) => ({ ...prev, companyName: '企業名を入力してください。' }));
    if (!title) setErrors((prev) => ({ ...prev, title: 'タイトルを入力してください。' }));
    if (!body) setErrors((prev) => ({ ...prev, body: '本文を入力してください。' }));

    if (selectedCompanyId && title && body) {
      const userId = user?.uid;
      const formattedTags = selectedTags.map(tag => tag);
      setLoadingState("Loading");
      try {
        const response = await axios.post('/api/savePost', {
          userId,
          companyId : selectedCompanyId,
          title,
          content: body,
          newTags,
          tags: formattedTags,
          },
        );

        if (response.status === 201) {
          setLoadingState("Success");
          setTimeout(() => {
            router.push(`/posts/${response.data.postId}`);
            setLoadingState(null);
          }, 1500);
        } else {
          setLoadingState("Error");
          setTimeout(() => {
            setLoadingState(null);
          }, 3000);
        }
      } catch (error) {
        setLoadingState("Error");
        setTimeout(() => {
          setLoadingState(null);
        }, 3000);
        console.error('Error saving post:', error);
      }
    }
  };

  if (loadingState ==="Warning"){
    return <Loading type={loadingState} message='No Login'/>;
  }else if (loadingState ==="Loading"){
    return <Loading message='Upload..'/>;
  }else if (loadingState ==="Success"){
    return <Loading message='Success'/>;
  }else if (loadingState ==="Error"){
    return <Loading type={loadingState} message='Error'/>;
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
            isOptionEqualToValue={(option, value) => option === value || value === ""}
            value={companyName}
            onChange={handleCompanySelect}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField {...params} label="企業" variant="outlined" fullWidth error={!!errors.companyName} helperText={errors.companyName} sx={{ marginBottom: 3 }} />
            )}
          />
          <TextField fullWidth label="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} variant="outlined" error={!!errors.title} helperText={errors.title} sx={{ marginBottom: 3 }} />
          <Autocomplete
            multiple
            freeSolo
            options={tags.map((tag) => tag.name)}
            value={selectedTags}
            onChange={handleTagChange}
            onInputChange={handleTagInputChange}
            onFocus={handleTagFocus}
            renderInput={(params) => (
              <TextField {...params} label="タグを選択 or 入力後に[Enter]で新規作成" variant="outlined" fullWidth />
            )}
          />
          <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
            {selectedTags.map((tag, index) => (
              <Chip key={index} label={tag} />
            ))}
          </Stack>
          <TextField fullWidth label="本文" value={body} onChange={(e) => setBody(e.target.value)} multiline rows={10} variant="outlined" error={!!errors.body} helperText={errors.body} sx={{ marginBottom: 3 }} />
          <Box className={styles.buttonContainer}>
            <Button
              variant="contained"
              onClick={handlePreview}
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
