import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from './styles/global';

// import Routes from './routes';

// import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

const App: React.FC = () => (
  <>
    {/* <BrowserRouter>
      <Routes />
    </BrowserRouter> */}
    <SignIn />
    <GlobalStyle />
  </>
);

export default App;
