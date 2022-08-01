import React, { useState, useRef, useEffect } from 'react';
import { Grid, TextField, Container, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { IkanDefault, Loading } from 'Assets';
import './styles.scss';

const ButtonGrey = styled(Button)({
  backgroundColor: grey[400],
  '&:hover': {
    backgroundColor: grey[700]
  }
});

const TextGrey2 = styled('h2')({
  color: grey[500]
})

const TextGrey4 = styled('h4')({
  color: grey[500]
})

export default function Index(){
  const [textValue, setTextValue] = useState('');
  const [isSearchSticky, setSearchSticky] = useState(false);
  const [isBottom, setBottom] = useState(false);
  const textContainerRef = useRef();

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  },[])

  function onScroll(e){
    const textContainerPos = textContainerRef.current.offsetTop;
    if(window.scrollY > textContainerPos){
      setSearchSticky(true);
    }else{
      setSearchSticky(false);
    }

    if(window.scrollY + window.innerHeight >= document.body.scrollHeight ){
      setBottom(true)
    }

  }

  function onChangeTextInput(e){
    setTextValue(e.target.value)
  }

  function onKeyUpTextInput(e){
    if(e.code === 'Enter'){
      console.log('Hello ')
    }
  }

  function renderPlaceholderText(){
    return (
      <Grid container alignItems="center" direction="column">
        <TextGrey2>Please Type input above</TextGrey2>
        <TextGrey4>Press Enter or click search button to search value</TextGrey4> 
      </Grid>
    )
  }

  function renderListProducts(){
    return (
      <Grid container className="product-list" direction="column">
        {Array.from(Array(10)).map((_, index) => (
          <Box key={index} className="product-item">
            <img src={IkanDefault} alt="Ikan default" className="img" />
            <Grid className="text-container" container justifyContent="space-between" direction="column">
              <Grid className="flex-1" item>
                <h1>Ikan {index}</h1>
                <div className="text-gray">Komoditas: Bawal</div>
                <div className="text-gray mt-1">Harga: Rp. 100,000</div>
              </Grid>
              <Grid className="w-full" container direction="row" justifyContent="flex-end">
                <span className="text-10 text-info">Dibuat tanggal: 10 January 2020</span>
              </Grid>
            </Grid>
          </Box>
        ))}
        {isBottom && (
          <Grid container alignItems="center" justifyContent="center">
            <img src={Loading} alt="Loading" />
          </Grid>
        )}
      </Grid>
    )
  }

  function renderSearchContainer(){
      return ( 
        <Container className="fixed-container">
          <div ref={textContainerRef} className={`search-container ${isSearchSticky && 'translate-y'}`}>
            <TextField onKeyUp={onKeyUpTextInput} onChange={onChangeTextInput} value={textValue} 
              className="text-input flex-1" label={!isSearchSticky ? 'Input' : ''} placeholder="Search by name" />
            <ButtonGrey variant="contained" className="btn-input">
              <SearchIcon />
            </ButtonGrey>
          </div>
        </Container>
      );
  }

  return (
    <Container className="list-body">
      <Grid container direction="row">
        {renderSearchContainer()}
      </Grid>
      <div className="box-search-container">
        {textValue ? renderListProducts() : renderPlaceholderText()}
      </div>
    </Container>
  )
}