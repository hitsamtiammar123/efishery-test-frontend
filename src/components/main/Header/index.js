import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { EfisheryLogoWhite } from 'Assets';
import { Tab as EfisheryTab, Tabs as EFisheryTabs } from 'ComponentNavigation';
import './styles.scss';

export const GridHeader = styled(Grid)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.efishery.main,
  padding: '10px',
  zIndex: 2
}));

export default function Header(){
  const [currHeader, setCurrHeader] = useState(0);

  function onTabChange(e, newVal){
    setCurrHeader(newVal);
  }

  return (
    <GridHeader container direction="row" justifyContent="space-between" className="header">
      <Link to="/">
        <img className="logo" src={EfisheryLogoWhite} alt="Efishery Logo" />
      </Link>
      <EFisheryTabs value={currHeader} onChange={onTabChange} aria-label="nav tabs example">
        <EfisheryTab label="View List" to="/" component={Link} />
        <EfisheryTab label="Create New List" to="/detail"  component={Link} />
      </EFisheryTabs>
    </GridHeader>
  )
}