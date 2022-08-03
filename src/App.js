import { ThemeProvider } from '@mui/material/styles';
import { Header, Body } from 'ComponentMain';
import { mainTheme } from './theme';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import './App.scss';

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Header />
            <Body />
          </div>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
