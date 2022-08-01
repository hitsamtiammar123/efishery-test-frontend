import { styled } from '@mui/material/styles';
import { Tabs } from '@mui/material';

export default styled(Tabs)(() => ({
  '& .MuiTabs-indicator': {
    backgroundColor: 'green'
  }
}));