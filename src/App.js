import React from 'react';
import Router from './Router';
import { BrowserRouter } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";
import { ToastProvider } from 'react-toast-notifications';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#e67e22',
    },
    secondary: {
      main: '#2ecc71',
    },
  },
});


const App = () => {
    return (
    <React.Suspense fallback={''}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <Router />
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.Suspense>
  );
}

export default App;
