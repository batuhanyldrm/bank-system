import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from 'react-router';

//import './index.css'
import Login from './pages/auth/Login.jsx';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './app/store.js';
import { getMe } from './features/auth/authThunks.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Accounts from './pages/accounts/Accounts.jsx';


function Index() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Index: componentDidMount");
    dispatch(getMe());

    return () => {
      console.log("Index: componentWillUnmount");
    }
  }, [dispatch]);

  if (loading) {
    return null;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Accounts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  /* <StrictMode> */
    <Provider store={store}><Index /></Provider>
  /* </StrictMode>, */
)
