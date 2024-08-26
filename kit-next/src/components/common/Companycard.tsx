import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface CompanyCardProps {
  image: string;
  name: string;
  details: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ image, name, details }) => {
  return (
    <Card sx={{ display: 'flex', marginBottom: 2 }}>
      <Grid container spacing={0}>
        <Grid xs={2}>
          <CardMedia
          component="img"
          //sx={{ width: 160 }}
          image={image}
          alt={name}
          />
        </Grid>
        <Grid xs={10}>
          <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" sx={{marginBottom: 2}}>
            {name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{marginBottom: 5}}>
            {details}
          </Typography>
          </CardContent>
          <Grid container spacing={0}>
            <Grid xs={2}>
              <CardActions sx={{marginLeft: 5, alignitems: 'center'}}>
                <Button size="medium" variant="outlined">
                  詳しく見る
                </Button>
              </CardActions>
            </Grid>
            <Grid xs={10}>
              <CardActions sx={{marginLeft: 5, alignitems: 'center'}}>
                <Button startIcon={<FavoriteIcon />} size="medium" variant="outlined" >
                  気になる
                </Button>
              </CardActions>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CompanyCard;
