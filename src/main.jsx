import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { SharedStateProvider } from './contexts/ShareStateProvider';


import './assets/scss/app.scss';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SharedStateProvider>
      <BrowserRouter>
        <App />
    </BrowserRouter>
    </SharedStateProvider>
  </StrictMode>,
)
