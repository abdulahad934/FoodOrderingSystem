import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/admin-login' element={<AdminLogin/>}></Route>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='/add-category' element= {<AddCategory/>}/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
