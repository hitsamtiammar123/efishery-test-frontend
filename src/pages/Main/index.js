import React, { useState, useRef, useEffect } from 'react';
import { Grid, TextField, Container, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import numbro from 'numbro';
import moment from 'moment';
import { IkanDefault, Loading } from 'Assets';
import { useAxios, usePrevious } from 'Hooks';
import { SUCCESSFULL } from 'Constant';
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
const LIMIT = 10;

export default function Index(){
  const [textValue, setTextValue] = useState('');
  const [context, setContext] = useState({
    data: [],
  });
  const [isSearchSticky, setSearchSticky] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [offset, setOffset] = useState(0);
  const textContainerRef = useRef();
  const inputRef = useRef();
  const isBottomRef = useRef(false);
  const isAppendRef = useRef(false);
  const apiStein = useAxios('/list');
  const prevStatus = usePrevious(apiStein.status);
  
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    fetchData({ search: '', offset: 0, limit: LIMIT })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, []);

  useEffect(() => {
    if(prevStatus !== undefined && prevStatus !== apiStein.status){
      switch(apiStein.status){
        case SUCCESSFULL:
          onLoadDataSuccess();
          break;
        default:
      }
    }
  }, [prevStatus, apiStein.status]);

  function onLoadDataSuccess(){
    let newData = apiStein.data;
    isBottomRef.current = false;
    if(isAppendRef.current === true){
      newData = [...context.data, ...apiStein.data,]
    }
    setContext({ isInitiate: false, data: newData });
    if(apiStein.data.length === 0){
      setEmpty(true);
    }else{
      setEmpty(false);
    }
  }

  function onScroll(e){
    const textContainerPos = textContainerRef.current.offsetTop;
    if(window.scrollY > textContainerPos){
      setSearchSticky(true);
    }else{
      setSearchSticky(false);
    }

    const posScrollY = window.scrollY + window.innerHeight;
    const bodyScrollHeight = document.body.scrollHeight;

    if(posScrollY >= bodyScrollHeight && isBottomRef.current !== true ){
      isBottomRef.current = true;
      const newOffset = offset + 10;
      fetchData({ search: inputRef.current.value, offset: newOffset, limit: LIMIT, append: true });
    }
  }

  function fetchData({ search, limit, offset, append }){
    if(apiStein.loading)
      return;
    const params = {
      limit, 
      offset
    }
    if(search){
      params.search = JSON.stringify({
        komoditas: search.toUpperCase()
      });
    }
    if(!append){
      setContext({
        ...context,
        data: []
      })
    }else if(append === true){
      isAppendRef.current = append;
    }
    apiStein.send(params);
  }

  function onChangeTextInput(e){
    setTextValue(e.target.value)
  }

  function onKeyUpTextInput(e){
    if(e.code === 'Enter'){
      // console.log('Hello ')
      fetchData({ search: textValue, limit: LIMIT, offset: 0 });
      setOffset(0);
    }
  }

  function onBtnSearchClicked(){
    fetchData({ search: textValue, limit: LIMIT, offset: 0 });
    setOffset(0);
  }

  function renderListProducts(){
    return (
      <Grid  container className="product-list" direction="column">
        {context.data.filter(item => item.uuid !== null).map((item, index) => (
          <Box to={`/detail/${item.uuid}`} component={Link} key={item.timestamp + '' + index} className="product-item">
            <img src={IkanDefault} alt="Ikan default" className="img" />
            <Grid className="text-container" container justifyContent="space-between" direction="column">
              <Grid className="flex-1" container direction="column">
                <Grid container justifyContent="space-between" direction="row">
                  <h1>{item.komoditas}</h1>
                  <h2>{index + 1}</h2>
                </Grid>
                <Grid container direction="row">
                  <div className="flex-1">
                    <div className="text-gray">Ukuran: {item.size}</div>
                    <div className="text-gray mt-1">Harga: Rp. {numbro(item.price).format({thousandSeparated: true})}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray">Provinsi: {item.area_provinsi}</div>
                    <div className="text-gray mt-1">Kota: {item.area_kota}</div>
                  </div>
                </Grid>
              </Grid>
              <Grid className="w-full" container direction="row" justifyContent="space-between">
                <span className="text-10 text-info">Timestamp: {item.timestamp}</span>
                <span className="text-10 text-info">UUID: {item.uuid}</span>
                <span className="text-10 text-info">Dibuat tanggal: {moment(item.tgl_parsed).format('DD MMMM YYYY HH:mm:ss')}</span>
              </Grid>
            </Grid>
          </Box>
        ))}
        {isEmpty && (
          <Grid container alignItems="center" direction="column">
            <TextGrey2>No result for {textValue}</TextGrey2>
        </Grid>
        )}
        {apiStein.loading && (
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
            <TextField inputProps={{ ref: inputRef }} onKeyUp={onKeyUpTextInput} onChange={onChangeTextInput} value={textValue} 
              className="text-input flex-1" label={!isSearchSticky ? 'Input' : ''} placeholder="Search by name" />
            <ButtonGrey onClick={onBtnSearchClicked} variant="contained" className="btn-input">
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
        {renderListProducts()}
      </div>
    </Container>
  )
}