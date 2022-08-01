import React from 'react';
import { Grid, TextField, Container, Button, } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import './styles.scss';

const ButtonGrey = styled(Button)({
  backgroundColor: grey[400],
  '&:hover': {
    backgroundColor: grey[700]
  }
});

export default function Body(){
  return (
    <Container className="main-body">
      <Grid container direction="row">
        <TextField className="text-input flex-1" label="Input" placeholder="Search by name" />
        <ButtonGrey variant="contained" className="btn-input">
          <SearchIcon />
        </ButtonGrey>
      </Grid>
    </Container>
  )
}