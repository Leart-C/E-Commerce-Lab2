import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import AuthContextProvider from './auth/auth.context.tsx';
import { WishlistProvider } from './components/Context/WishlistContext.tsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode> { /* I mir per testim me te detajueshem gjat zhvillimit mund te largohet pa problem me komponentat e tjer*/}

  <BrowserRouter>
    <AuthContextProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </AuthContextProvider>
  </BrowserRouter>
</React.StrictMode>
);


