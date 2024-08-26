"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { TextField, Box} from '@mui/material';

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
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth 
          id="filled-basic" 
          label="タイトル" 
          variant="outlined" 
          sx={{ width: '60%', backgroundColor: 'white' }}
        />
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          id="filled-multiline-static"
          label="本文"
          multiline
          rows={25}
          defaultValue="Default Value"
          variant="outlined"
          sx={{ width: '80%', backgroundColor: 'white' }}
        />
      </div>
    </Box>
  );
};

export default Home;
