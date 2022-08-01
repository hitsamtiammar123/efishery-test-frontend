import React, { useState } from 'react';
import { EfisheryLogo } from 'Assets';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Tab as EfisheryTab, Tabs as EFisheryTabs } from 'ComponentNavigation';
import './styles.scss';

export const GridHeader = styled(Grid)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.efishery.light,
  padding: '10px'
}));

export default function Header(){
  const [currHeader, setCurrHeader] = useState(0);

  function onTabChange(e, newVal){
    setCurrHeader(newVal);
  }

  return (
    <GridHeader container direction="row" justifyContent="space-between" className="header">
      <img className="logo" src={EfisheryLogo} alt="Efishery Logo" />
      <EFisheryTabs value={currHeader} onChange={onTabChange} aria-label="nav tabs example">
        <EfisheryTab label="View List" href="#" component="a" />
        <EfisheryTab label="Create New List" href="#" component="a" />
      </EFisheryTabs>
    </GridHeader>
  )
}