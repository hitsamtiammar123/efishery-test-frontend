import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import uuid from 'react-uuid';
import Swal from 'sweetalert2';
import { Container, Grid, TextField, FormHelperText, FormControl, Select, InputLabel, MenuItem, Button } from '@mui/material';
import { IkanDefault, Loading } from 'Assets';
import { useAxios, usePrevious } from 'Hooks';
import { FISH_IMAGE_MAP } from 'Constant';
import './styles.scss';

export default function Detail(){
  const { id } = useParams();
  const navigation = useNavigate();
  const [data, setData] = useState({
    komoditas: '',
    price: '',
    size: '',
    area_kota: '',
  });
  const [cityList, setCityList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const apiStein = useAxios('/list');
  const apiSteinPost = useAxios('/list', 'post');
  const apiSteinPut = useAxios('/list', 'put');
  const apiSteinDelete = useAxios('/list', 'delete');
  const apiSteinCityList = useAxios('/option_area');
  const apiSteinSizeList = useAxios('/option_size');
  const prevStatus = usePrevious(apiStein.status);
  const [errorList, setErrorList] = useState({ ...data })
  const prevCityStatus = usePrevious(apiSteinCityList.status);
  const prevSizeStatus = usePrevious(apiSteinSizeList.status);
  const prevPostStatus = usePrevious(apiSteinPost.status);
  const prevPutStatus = usePrevious(apiSteinPut.status);
  const prevDeleteStatus = usePrevious(apiSteinDelete.status);

  useEffect(() => {
    if(id){
      apiStein.send({
        search: JSON.stringify({
          uuid: id
        })
      })
    }
    apiSteinCityList.send();
    apiSteinSizeList.send();
  },[]);

  useEffect(() => {
    onAfterDataSubmit(prevPostStatus, apiSteinPost.status, 'Terdapat error saat menambah data baru, coba beberapa saat lagi');
  }, [prevPostStatus, apiSteinPost.status]);

  useEffect(() => {
    onAfterDataSubmit(prevPutStatus, apiSteinPut.status, 'Terdapat error saat mengubah data, coba beberapa saat lagi');
  }, [prevPutStatus, apiSteinPut.status]);

  useEffect(() => {
    onAfterDataSubmit(prevDeleteStatus, apiSteinDelete.status, 'Terdapat error saat menghapus data, coba beberapa saat lagi');
  }, [prevDeleteStatus, apiSteinDelete.status]);

  useEffect(() => {
    onAfterDataSubmit(prevPutStatus, apiSteinPut.status, 'Terdapat error saat mengubah data, coba beberapa saat lagi');
  }, [prevPutStatus, apiSteinPut.status]);

  useEffect(() => {
    if(prevSizeStatus !== undefined && prevSizeStatus !== apiSteinSizeList.status){
      switch(apiSteinSizeList.status){
        case 1:
          onSizeStatusSuccess();
          break;
        case 0:
            setErrorList({ ...errorList, size: 'Terdapat error saat memuat data Ukuran, mohon muat ulang halaman' })
            break;
        default:
      }
    }
  }, [prevSizeStatus, apiSteinSizeList.status]);

  useEffect(() => {
    if(prevCityStatus !== undefined && prevCityStatus !== apiSteinCityList.status){
      switch(apiSteinCityList.status){
        case 1:
          onLoadCitySucess();
          break;
        case 0:
          setErrorList({ ...errorList, area_kota: 'Terdapat error saat memuat data kota, mohon muat ulang halaman' })
          break;
        default:
      }
    }
  }, [prevCityStatus, apiSteinCityList.status]);

  useEffect(() => {
    if(prevStatus !== undefined && prevStatus !== apiStein.status){
      switch(apiStein.status){
        case 1:
          onLoadDataSuccess();
          break;
        default:
      }
    }
  }, [prevStatus, apiStein.status]);

  function onAfterDataSubmit(prevStatus, status, errMessage){
    if(prevStatus !== undefined && prevStatus !== status){
      switch(status){
        case 1:
          navigation('/')
          break;
        case 0:
          Swal.fire('Error', errMessage, 'error')
          break;
        default:
      }
  }
}

  function validateInput(){
    const newErrorList = { };

    if(!data.area_kota){
      newErrorList.area_kota = 'Silahkan pilih kota'
    }

    if(!data.komoditas){
      newErrorList.komoditas = 'Komoditas tidak boleh kosong'
    }

    if(!data.price){
      newErrorList.price = 'Harga tidak boleh kosong';
    }

    if(!data.size){
      newErrorList.size = 'Silahkan pilih ukuran'
    }

    if(Object.keys(newErrorList).length !== 0){
      setErrorList({ ...errorList, ...newErrorList});
      return true;
    }
    return false

  }

  function onButtonSubmitClick(){
    const today = new Date();
    if(validateInput()){
      console.log({ errorList });
      return;
    }
    const message = id ? 'Data akan beruhab': 'Data yang baru akan ditambahnkan'
    Swal.fire({
      title: 'Apa anda yakin?',
      text: message,
      icon: 'warning',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if(!id){
          const cityData = cityList.find(d => d.city === data.city);
          const d = {
            ...data,
            uuid: uuid(),
            timestamp: today.getTime(),
            tgl_parsed: today.toISOString(),
            area_provinsi: cityData ? cityData.province : ''
          }
          apiSteinPost.send([ d ]);
        }else{
          apiSteinPut.send({
            condition: { uuid: id },
            set: {...data },
            LIMIT: 1
          })
        }
      }
    })
  }

  function onSizeStatusSuccess(){
    setSizeList(apiSteinSizeList.data);
  }

  function onLoadCitySucess(){
    setCityList(apiSteinCityList.data);
  }

  function onLoadDataSuccess(){
    setData(apiStein.data[0]);
  }

  function onDataChange(key, value){
    setData({
      ...data,
      [key]: value
    })
    setErrorList({
      ...errorList,
      [key]: ''
    })
  }

  function deleteData(){
    Swal.fire({
      title: 'Apa anda yakin?',
      text: 'Data yang dipilih akan terhapus',
      icon: 'warning',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya',
      showCancelButton: true,
    }).then((result) => {
      if(result.isConfirmed && id){
        apiSteinDelete.send({
          condition: { uuid: id },
          LIMIT: 1
        })
      }
    })
  }

  function getImageMap(name){
    const fishMap = FISH_IMAGE_MAP[name.toUpperCase()];
    if(fishMap){
      return fishMap
    }
    return IkanDefault
  }

  function renderContent(){
    if(apiStein.loading || apiSteinPost.loading || apiSteinPut.loading || apiSteinDelete.loading){
      return (
        <Grid container justifyContent="center">
          <img src={Loading} alt="Loading" />
        </Grid>
      )
    }
    return (
      <Grid spacing={4} container direction="row">
        <Grid item className="image-container">
          <img className="fish-img" alt="Fish" src={getImageMap(data.komoditas)} />
        </Grid>
        <Grid item className="flex-1 ml-2">
          <Grid container>
            <TextField helperText={errorList.komoditas} error={errorList.komoditas !== ''} onChange={(e) => onDataChange('komoditas', e.target.value)} value={data.komoditas} margin="normal" placeholder="Silahkan masukan Komoditas" fullWidth label="Komoditas" />
          </Grid>
          <Grid container spacing={2} direction="row">
            <Grid xs={6} item>
              <TextField helperText={errorList.price} error={errorList.price !== ''} onChange={(e) => onDataChange('price', e.target.value)} value={data.price} fullWidth margin="normal" placeholder="Silahkan masukan Harga" label="Harga" inputProps={{
                min: "0"
              }} type="number" />
            </Grid>
            <Grid xs={6} item>
              <FormControl margin="normal" error={errorList.size !== ''} fullWidth>
                <InputLabel id="select-size-label">Ukuran</InputLabel>
                <Select disabled={apiSteinCityList.loading} onChange={(e) => onDataChange('size', e.target.value)} value={data.size} label="Lokasi" labelId="select-size-label" id="select-size">
                  {sizeList.map((item, index) => (
                    <MenuItem key={index} value={item.size}>{item.size}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errorList.size}</FormHelperText>
            </FormControl>
            </Grid>
          </Grid>
          <Grid container>
          <FormControl margin="normal" error={errorList.area_kota !== ''} fullWidth>
              <InputLabel id="select-location-label">Lokasi</InputLabel>
              <Select disabled={apiSteinCityList.loading} onChange={(e) => onDataChange('area_kota', e.target.value)} value={data.area_kota} label="Lokasi" labelId="select-location-label" id="select-location">
                {cityList.map((item, index) => (
                  <MenuItem key={index} value={item.city}>{item.city}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errorList.area_kota}</FormHelperText>
          </FormControl>
          </Grid>
          <Grid className="mt-1" container direction="row">
            <Button onClick={onButtonSubmitClick} variant="contained" color="primary">
              { id ? 'Ubah data' : 'Tambah Data baru'}
            </Button>
            {/* {id && (
              <Button onClick={() => deleteData()} sx={{ marginLeft: '10px' }} variant="contained" color="error">
                Hapus Data
              </Button>
            )} */}
          </Grid>
        </Grid>
    </Grid>
    )
  }

  return (
    <Container className="detail-body">
      {renderContent()}
    </Container>
  )
}