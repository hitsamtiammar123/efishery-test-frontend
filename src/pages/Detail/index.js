import React from 'react';
import { Container, Grid, TextField, FormControl, Select, InputLabel, MenuItem, Button } from '@mui/material';
import { IkanDefault } from 'Assets';
import './styles.scss';

export default function Detail(){
  return (
    <Container className="detail-body">
      <Grid spacing={4} container direction="row">
        <Grid item className="image-container">
          <img className="fish-img" alt="Fish" src={IkanDefault} />
        </Grid>
        <Grid item className="flex-1 ml-2">
          <Grid container xs={12}>
            <TextField margin="normal" placeholder="Silahkan masukan Komoditas" fullWidth label="Komoditas" />
          </Grid>
          <Grid container spacing={2} direction="">
            <Grid xs={6} item>
              <TextField fullWidth margin="normal" placeholder="Silahkan masukan Harga" label="Harga" inputProps={{
                min: "0"
              }} type="number" />
            </Grid>
            <Grid xs={6} item>
              <TextField fullWidth margin="normal" placeholder="Silahkan Masukan ukuran" label="Ukuran" inputProps={{
                min: "0"
              }} type="number" />
            </Grid>
          </Grid>
          <Grid container>
           <FormControl margin="normal" fullWidth>
              <InputLabel id="select-location-label">Lokasi</InputLabel>
              <Select label="Lokasi" labelId="select-location-label" id="select-location">
                <MenuItem value="Buleleng">Buleleng</MenuItem>
                <MenuItem value="Jakarta">Jakarta</MenuItem>
                <MenuItem value="Bandung">Bandung</MenuItem>
              </Select>
           </FormControl>
          </Grid>
          <Grid className="mt-1" container direction="row">
            <Button variant="contained" color="primary">Tambah Data baru</Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}