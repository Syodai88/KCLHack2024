"use client";
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { TextField, Box, Autocomplete, Chip, Stack, Button} from '@mui/material';

const PostWrite: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 入力値を管理するステートを追加
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // バリデーション情報を仮のオブジェクトで設定
  const validation = { error: false, message: '' }; // バリデーションを追加する場合は適宜変更

  // 選択変更時に呼び出される関数
  const handleInputChange = (event: any, newValue: string[]) => {
    setSelectedTags(newValue);
  };

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/');
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

return (
    <Box 
      sx={{
        width: '80%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >

      <TextField
        fullWidth 
        id="filled-basic" 
        label="タイトル"
        InputLabelProps={{
          shrink: true,
          style: {
            fontWeight: 'bold', 
            fontSize: '1.3rem', 
          }
        }}
        variant="standard"
        defaultValue={""} 
        margin="normal"
        sx={{ width: '60%', backgroundColor: 'white'}}
      />
      

      <Autocomplete //importしたコンポーネントを使用
        multiple //複数選択できるようになる
        freeSolo //任意の入力値を管理できる（デフォルトはオプション選択のみ）
        filterSelectedOptions //選択されたオプションを非表示にする
        options={tags.map(tag => tag.name)} // tags配列を文字列の配列に変換
        value={selectedTags} // ステートから選択されたタグを取得
        onChange={handleInputChange} //コールバック関数（オプションを選択か「Enter」を押すとイベントが起きる）： function
        sx={{ width: '80%', backgroundColor: 'white'}}
        renderInput={params => (
          <TextField  //importしたコンポーネント
            {...params}
            variant='standard'
            placeholder='タグを選択か、入力後に「Enter」でタグを追加'
            error={validation.error} //エラー状態（trueのときはlabelやhelperTextが赤色になる）： boolean
            helperText={validation.message} //入力欄の下に表示されるテキスト： node（公式のデモ通り文字列を指定） //
          />
        )}
      />

      
      {/* <Autocomplete
        multiple
        id="tags-standard"
        options={tags}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="タグを選択してください"
          />
        )}
        sx={{ width: '80%', backgroundColor: 'white'}}
      /> */}
        
      

      <TextField
        fullWidth
        id="filled-multiline-static"
        label="本文"
        InputLabelProps={{
          shrink: true,
          style: {
            fontWeight: 'bold', 
            fontSize: '1.3rem', 
          }
        }}
        multiline
        rows={20}
        variant="standard"
        defaultValue={""} 
        margin="normal"
        sx={{ width: '80%', backgroundColor: 'white'}}
      />

      <Button
      variant='contained'
      > プレビュー </Button>
      
    </Box>
  );
};

const tags = [
  { name: '本選考'},
  { name: 'インターン'},
  { name: '春'},
  { name: '夏'},
  { name: '秋'},
  { name: '冬'},
  { name: 'その他'}
];

export default PostWrite;
