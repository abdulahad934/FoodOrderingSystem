import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';


const MyOrders = () => {
    const userId = localStorage.getItem('userId');
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userId) {
            navigate('/login');
            return;
        }
        fetch(`http://127.0.0.1:1000/api/orders${userId}`)
        .then(res => res.json())
        .then(data => {
            setOrders(data);
        })
    }, [userId]);
  return (
    <PublicLayout>
        
    </PublicLayout>
  )
}

export default MyOrders