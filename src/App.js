import { ThemeProvider } from '@mui/material/styles';
import { Header, Body } from 'ComponentMain';
import { mainTheme } from './theme';
import './App.scss';

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <div className="App">
        <Header />
        <Body />
      </div>
    </ThemeProvider>
  );
}

export default App;
