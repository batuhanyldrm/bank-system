import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from 'react-router';

//import './index.css'
import Login from './pages/auth/Login.jsx';
import { Provider } from 'react-redux';
import store from './app/store.js';

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  /* <StrictMode> */
    <Provider store={store}><Index /></Provider>
  /* </StrictMode>, */
)
