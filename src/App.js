import { ThemeProvider } from '@mui/material/styles';
import { Header, Body } from 'ComponentMain';
import { mainTheme } from './theme';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Body />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
