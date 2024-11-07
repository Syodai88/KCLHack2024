"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { TextField, Box, Autocomplete, Chip, Stack} from '@mui/material';

const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

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
      

      {/* <Autocomplete //importしたコンポーネントを使用
        multiple //複数選択できるようになる --- ①
        freeSolo //任意の入力値を管理できる（デフォルトはオプション選択のみ）
        filterSelectedOptions //選択されたオプションを非表示にする --- ②
        options={top100Films.map(option => option.year)} //ドロップダウンメニューの項目：文字列の配列
        value={} //入力欄に表示される値：①のときは文字列の配列、指定しないときは文字列 --- ③
        onChange={handleInputChange} //コールバック関数（オプションを選択か「Enter」を押すとイベントが起きる）： function --- ④
        sx={{
          width: 600,
          display: 'inline-block',
        }}
        renderInput={params => (
          <TextField  //importしたコンポーネント
            {...params}
            variant='standard'
            label='離島マーカーを作る' // --- ⑤
            placeholder='離島名を選択か、入力後に「Enter」でタグが表示。「＋」でマーカーを作成'
            error={validation.error} //エラー状態（trueのときは⑤labelや⑥helperTextが赤色になる）： boolean
            helperText={validation.message} //入力欄の下に表示されるテキスト： node（公式のデモ通り文字列を指定） // --- ⑥
          />
        )}
      /> */}

      
      <Autocomplete
        multiple
        id="tags-standard"
        options={tags}
        getOptionLabel={(option) => option.name}
        //defaultValue={[top100Films[]]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            //label="Multiple values"
            // InputLabelProps={{
            //   shrink: true,
            //   style: {
            //     fontWeight: 'bold', 
            //     fontSize: '1.3rem', 
            //   }
            // }}
            placeholder="タグを選択してください"
          />
        )}
        sx={{ width: '80%', backgroundColor: 'white'}}
      />
        
      

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
        //defaultValue="Default Value"
        variant="standard"
        defaultValue={""} 
        margin="normal"
        sx={{ width: '80%', backgroundColor: 'white'}}
      />
      
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

export default Home;
