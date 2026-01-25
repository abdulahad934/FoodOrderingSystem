import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/admin-login' element={<AdminLogin/>}></Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
