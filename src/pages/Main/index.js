import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Grid, TextField, Container, Button, Box, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useSearchParams } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import numbro from 'numbro';
import moment from 'moment';
import { IkanDefault, Loading } from 'Assets';
import { useAxios, usePrevious } from 'Hooks';
import { SUCCESSFULL, FISH_IMAGE_MAP } from 'Constant';
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

const SORT_MAPS = {
  price: {
    Desc: (a,b) =>  Number(a.price) - Number(b.price),
    Asc: (a,b) => Number(b.price) - Number(a.price)
  },
  uuid: {
    Desc: (a,b) =>  a.uuid?.localeCompare(b.uuid),
    Asc: (a,b) =>  b.uuid?.localeCompare(a.uuid)
  },
  komoditas: {
    Desc: (a,b) =>  a.komoditas?.localeCompare(b.uuid),
    Asc: (a,b) =>  b.komoditas?.localeCompare(a.uuid)
  },
  area_provinsi: {
    Desc: (a,b) =>  a.area_provinsi?.localeCompare(b.uuid),
    Asc: (a,b) =>  b.area_provinsi?.localeCompare(a.uuid)
  },
  area_kota: {
    Desc: (a,b) =>  a.area_kota?.localeCompare(b.uuid),
    Asc: (a,b) =>  b.area_kota?.localeCompare(a.uuid)
  },
  size: {
    Desc: (a,b) => Number(a.size) - Number(b.size),
    Asc: (a,b) =>  Number(b.size) - Number(a.size),
  },
  tgl_parsed: {
    Desc: (a,b) =>  new Date(a.tgl_parsed).getTime() - new Date(b.tgl_parsed).getTime(),
    Asc: (a,b) =>  new Date(b.tgl_parsed).getTime() - new Date(a.tgl_parsed).getTime()
  },
  timestamp: {
    Desc: (a,b) =>  Number(a.timestamp) - Number(b.timestamp),
    Asc: (a,b) =>  Number(b.timestamp) - Number(a.timestamp)
  }

}

export default function Index(){
  const [textValue, setTextValue] = useState('');
  const [listData, setListData] = useState([]);
  const [isSearchSticky, setSearchSticky] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sortDirection, setSortDirection] = useState('');
  const [sortBy, setSortBy] = useState('');
  const textContainerRef = useRef();
  const inputRef = useRef();
  const isBottomRef = useRef(false);
  const isAppendRef = useRef(false);
  const apiStein = useAxios('/list');
  const prevStatus = usePrevious(apiStein.status);
  const [searchParams, setSearchParams] = useSearchParams();
  
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

  useEffect(() => {
    console.log({ searchParams })
    if(searchParams.get('search')){
      fetchData({ search: searchParams.get('search'), limit: LIMIT, offset: 0 });
      setOffset(0);
    }
  }, [searchParams])

  const filteredData = useMemo(() => {
    const temp = [...listData];

    temp.sort((a, b) => {
      const sortByData = SORT_MAPS[sortBy];
      if(sortByData){
        const sortDirectionFunction = sortByData[sortDirection];
        if(typeof sortDirectionFunction === 'function'){
          return sortDirectionFunction(a,b)
        }
      }
      return 0;
    })

    return temp;
  }, [listData, sortDirection, sortBy]);

  function onSortDirection(e){
    setSortDirection(e.target.value)
    //const newData = doSort(listData, e.target.value, sortBy);
    //setListData(newData)
  }

  function onSortBy(e){
    setSortBy(e.target.value)
    //const newData = doSort(listData, sortDirection, e.target.value);
    //setListData(newData)
  }

  function doSort(data, sortDirection, sortBy){
    const temp = [...data];

    temp.sort((a, b) => {
      if(sortDirection === 'Desc'){
        return Number(a.price) - Number(b.price)
      }else if(sortDirection === 'Asc'){
        return Number(a.price) + Number(b.price)
      }
    })

    return temp;
  }

  function onLoadDataSuccess(){
    let newData = apiStein.data;
    isBottomRef.current = false;
    if(isAppendRef.current === true){
      newData = [...listData, ...apiStein.data,]
    }
    setListData(newData);
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
      setListData([])
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
      setSearchParams({ search: textValue })
      // fetchData({ search: textValue, limit: LIMIT, offset: 0 });
      // setOffset(0);
    }
  }

  function onBtnSearchClicked(){
    setSearchParams({ search: textValue })
    // fetchData({ search: textValue, limit: LIMIT, offset: 0 });
    // setOffset(0);
  }

  function getImageMap(name){
    const fishMap = FISH_IMAGE_MAP[name.toUpperCase()];
    if(fishMap){
      return fishMap
    }
    return IkanDefault
  }

  function renderListProducts(){
    return (
      <Grid  container className="product-list" direction="column">
        {filteredData.filter(item => item.uuid !== null).map((item, index) => (
          <Box to={`/detail/${item.uuid}`} component={Link} key={item.timestamp + '' + index} className="product-item">
            <img src={getImageMap(item.komoditas)} alt="Ikan default" className="img" />
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
        {isEmpty && !apiStein.loading &&(
          <Grid container alignItems="center" direction="column">
            <TextGrey2>Tidak ada hasil</TextGrey2>
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
      <Grid container direction="row" justifyContent="space-between">
        <FormControl className="flex-1">
          <FormLabel id="sort-by-radio">Diurutkan dari</FormLabel>
          <RadioGroup
            row
            aria-labelledby="sort-by-radio"
            name="sort-by-radio"
            value={sortDirection}
            onChange={(e) => onSortDirection(e)}
          >
            <FormControlLabel value="Desc" control={<Radio />} label="Menurun" />
            <FormControlLabel value="Asc" control={<Radio />} label="Naik" />
          </RadioGroup>
        </FormControl>
        <FormControl className="flex-1">
          <FormLabel id="sort-data-radio">Diurutkan berdasarkan</FormLabel>
          <RadioGroup
            row
            aria-labelledby="sort-data-radio"
            name="sort-data-radio"
            value={sortBy}
            onChange={(e) => onSortBy(e)}
          >
            <FormControlLabel value="uuid" control={<Radio />} label="uuid" />
            <FormControlLabel value="komoditas" control={<Radio />} label="komoditas" />
            <FormControlLabel value="area_provinsi" control={<Radio />} label="provinsi" />
            <FormControlLabel value="area_kota" control={<Radio />} label="Kota" />
            <FormControlLabel value="size" control={<Radio />} label="size" />
            <FormControlLabel value="price" control={<Radio />} label="price" />
            <FormControlLabel value="tgl_parsed" control={<Radio />} label="Tanggal" />
            <FormControlLabel value="timestamp" control={<Radio />} label="timestamp" />
          </RadioGroup>
        </FormControl>
      </Grid>
        {renderListProducts()}
      </div>
    </Container>
  )
}