import { ThemeProvider } from '@mui/material/styles';
import { Header } from 'ComponentMain';
import { mainTheme } from './theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <div className="App">
        <Header />
      </div>
    </ThemeProvider>
  );
}

export default App;
