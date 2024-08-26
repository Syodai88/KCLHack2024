import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box, Grid, Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox: React.FC = () => {
  return (
    <Paper
    component="form"
    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, margin: 5}}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder="Search Google Maps"
      inputProps={{ 'aria-label': 'search google maps' }}
    />
    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
      <SearchIcon />
    </IconButton>
  </Paper>
  );
};

export default SearchBox;
