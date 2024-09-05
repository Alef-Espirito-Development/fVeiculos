import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
    >
      <Box textAlign="center">
        <CircularProgress color="primary" />
        <Typography variant="h6" color="textSecondary" marginTop="16px">
          Carregando...
        </Typography>
      </Box>
    </Box>
  );
};

export default Loading;
