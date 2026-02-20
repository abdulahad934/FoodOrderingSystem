import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import SearchPage from './pages/SearchPage';
import Register from './components/Register';
import Login from './components/Login';

import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import PaymentPage from './pages/PaymentPage';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ProfilePage from './pages/ProfilePage';
import ChangePassword from './pages/ChangePassword';
import OrdersNotConfirmed from './pages/OrdersNotConfirmed';
import AllOrders from './pages/AllOrders';
import OrderCancelled from './pages/OrderCancelled';
import FoodPickup from './pages/FoodPickup';
import Delivered from './pages/Delivered';
import BeingPrepared from './pages/BeingPrepared';
import Confirmed from './pages/Confirmed';


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
        <Route path='/manage-food' element = {<ManageFood/>}></Route>
        <Route path='/order-not-confirmed' element = {<OrdersNotConfirmed/>}></Route>
        <Route path='/search' element={<SearchPage/>}/>
        <Route path='/register' element= {<Register/>}/>
        <Route path="/food/:id" element={<FoodDetail />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/payment' element={<PaymentPage/>}/>
        <Route path='/my-orders' element={<MyOrders/>}/>
        <Route path='/order-details/:order_number' element={<OrderDetails/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/changepassword' element={<ChangePassword/>}/>
        <Route path='/all-orders' element={<AllOrders/>}/>
        <Route path='/order-cancelled' element={<OrderCancelled/>}/>
        <Route path='/food-pickup' element={<FoodPickup/>}/>
        <Route path='/delivered' element={<Delivered/>}/>
        <Route path='/being-prepared' element={<BeingPrepared/>}/>
        <Route path='/confirmed' element={<Confirmed/>}/>
      </Routes>
      

    </BrowserRouter>
  );
}

export default App;
