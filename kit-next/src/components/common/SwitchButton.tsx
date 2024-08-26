import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SwitchButton: React.FC = () => {
  return (
    <ToggleButtonGroup
        color="standard"
        value={null}
        exclusive={true}
        //onChange={}
        aria-label="Platform"
    >
    <ToggleButton value="test1">企業情報</ToggleButton>
    <ToggleButton value="test2">体験談</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SwitchButton;
