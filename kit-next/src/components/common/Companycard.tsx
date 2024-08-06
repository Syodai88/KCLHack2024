import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';

interface CompanyCardProps {
  image: string;
  name: string;
  details: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ image, name, details }) => {
  return (
    <Card sx={{ display: 'flex', marginBottom: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 160 }}
        image={image}
        alt={name}
      />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="h5">
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {details}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button
            size="small"
            variant="outlined"
            sx={{ marginRight: 1 }}
          >
            Button 1
          </Button>
          <Button
            size="small"
            variant="outlined"
          >
            Button 2
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CompanyCard;
