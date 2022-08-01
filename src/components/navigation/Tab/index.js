import { styled } from '@mui/material/styles';
import { Tab } from '@mui/material';

export default styled(Tab)(() => ({
  '&.Mui-selected': {
    color: 'green'
  }
}));