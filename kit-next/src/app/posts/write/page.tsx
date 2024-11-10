"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { TextField, Box, Autocomplete, Chip, Stack, Button, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import styles from './PostWrite.module.css';
import 'katex/dist/katex.min.css';
import SplitPage from '@/components/common/SplitPage';
import Sidebar from '@/components/common/Sidebar';

interface PostEditProps {
  selectedCompanyName?: string;
}

const PostEdit: React.FC<PostEditProps> = ({ selectedCompanyName }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 入力値を管理するステート
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [isCompanyNameEditable, setIsCompanyNameEditable] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  // タグの選択肢
  const tags = [
    { name: '本選考' },
    { name: 'インターン' },
    { name: '春' },
    { name: '夏' },
    { name: '秋' },
    { name: '冬' },
    { name: 'その他' },
  ];

  // 企業のリスト（例）
  const companies = [
    { id: 'company1', name: '企業A' },
    { id: 'company2', name: '企業B' },
    { id: 'company3', name: '企業C' },
  ];

  // ログインしていない場合、ログインページにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // 企業名の初期設定
  useEffect(() => {
    if (selectedCompanyName) {
      setCompanyName(selectedCompanyName);
      setIsCompanyNameEditable(false); // 編集不可
    } else {
      setIsCompanyNameEditable(true); // 編集可能
    }
  }, [selectedCompanyName]);

  // タグ変更時の処理
  const handleTagChange = (event: any, newValue: string[]) => {
    setSelectedTags(newValue);
  };

  // 保存処理（仮）
  const handleSave = () => {
    alert('投稿が保存されました。');
  };

  return (
    <Box className={styles.container}>
      {!isPreview ? (
        <>
          {/* 企業名フィールド */}
          {isCompanyNameEditable ? (
            <Autocomplete
              freeSolo
              options={companies.map((company) => company.name)}
              value={companyName}
              onChange={(event, newValue) => setCompanyName(newValue || '')}
              onInputChange={(event, newValue) => setCompanyName(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="企業名"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
              )}
              sx={{ width: '80%', backgroundColor: 'white' }}
            />
          ) : (
            <TextField
              fullWidth
              label="企業名"
              value={companyName}
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                },
              }}
              variant="outlined"
              margin="normal"
              sx={{
                width: '80%',
                backgroundColor: 'white',
                '& .MuiInputBase-input.Mui-disabled': {
                  color: '#000', // 無効化されていても文字色が薄くならないように
                },
              }}
            />
          )}

          {/* タイトルフィールド */}
          <TextField
            fullWidth
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{ width: '80%', backgroundColor: 'white' }}
          />

          {/* タグフィールド */}
          <Autocomplete
            multiple
            freeSolo
            filterSelectedOptions
            options={tags.map((tag) => tag.name)}
            value={selectedTags}
            onChange={handleTagChange}
            sx={{ width: '80%', backgroundColor: 'white' }}
            renderInput={(params) => (
              <TextField {...params} label="タグを選択" variant="outlined" margin="normal" />
            )}
          />

          {/* 本文フィールド */}
          <TextField
            fullWidth
            label="本文"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            rows={10}
            variant="outlined"
            margin="normal"
            sx={{ width: '80%', backgroundColor: 'white' }}
          />

          {/* ボタン */}
          <Box className={styles.buttonContainer}>
            <Button variant="contained" onClick={() => setIsPreview(true)} sx={{ marginRight: 2 }}>
              プレビュー
            </Button>
          </Box>
        </>
      ) : (
        <>
          {/* プレビュー表示 */}
          <Typography variant="h6" sx={{ marginTop: 2, width: '80%' }}>
            企業名: {companyName}
          </Typography>

          <Typography variant="h4" sx={{ marginTop: 2, width: '80%' }}>
            {title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ marginTop: 2, width: '80%' }}>
            {selectedTags.map((tag, index) => (
              <Chip key={index} label={tag} />
            ))}
          </Stack>

          <Box className={styles.markdownContainer}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
              rehypePlugins={[rehypeKatex]}
              className={styles.markdown}
            >
              {body || '本文がありません。'}
            </ReactMarkdown>
          </Box>

          {/* ボタン */}
          <Box className={styles.buttonContainer}>
            <Button variant="contained" onClick={() => setIsPreview(false)} sx={{ marginRight: 2 }}>
              編集
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              保存
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const PostWrite: React.FC = () => {
  const params = useParams(); // useParamsからパラメータを取得
  let companyName = params?.companyName;

  // companyIdが配列である場合、最初の要素を使用
  if (Array.isArray(companyName)) {
    companyName = companyName[0];
  }

  return (
    <SplitPage sidebar={<Sidebar />}>
      <PostEdit selectedCompanyName={companyName} /> 
    </SplitPage>
  );
};
export default PostWrite;