import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/admin-login' element={<AdminLogin/>}></Route>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='/add-category' element= {<AddCategory/>}/>
        <Route path='/manage-category' element = {<ManageCategory/>}/>
        <Route path='/add-food' element = {<AddFood/>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
