import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/payment.css';

const PaymentPage = () => {
  const userId = localStorage.getItem('userId');
  const [paymentMode, setPaymentMode] = useState('');
  const [address, setAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error('Please enter a delivery address');
      return;
    }

    if (paymentMode === 'online') {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (!cardNumber || !expiry || !cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:1000/api/place_order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          address,
          paymentMode,
          cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
          cvv: paymentMode === 'online' ? cardDetails.cvv : '',
          expiry: paymentMode === 'online' ? cardDetails.expiry : ''
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server');
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="payment-wrapper"> {/* ✅ এই wrapper add করুন */}
        <div className="container py-5">
          {/* বাকি সব code exactly same */}
          <h3 className="text-center text-primary mb-4">
            <i className="fas fa-credit-card me-2"></i> Checkout & Payment
          </h3>
          <div className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label fw-semibold">Delivery Address</label>
              <textarea
                className="form-control border-primary-subtle"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="fw-semibold">Payment Method</label>
              <div>
                <input
                  type="radio"
                  name="paymentMode"
                  value="cod"
                  checked={paymentMode === 'cod'}
                  onChange={(e) => setPaymentMode(e.target.value)}
                /> Cash on Delivery
              </div>
              <div>
                <input
                  type="radio"
                  name="paymentMode"
                  value="online"
                  checked={paymentMode === 'online'}
                  onChange={(e) => setPaymentMode(e.target.value)}
                /> Online Payment
              </div>
            </div>

            {paymentMode === 'online' && (
              <div className="mb-3">
                <label className="fw-semibold">Card Details</label>
                <input
                  type="text"
                  placeholder="Card Number"
                  className="form-control mb-2"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  className="form-control mb-2"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="CVV"
                  className="form-control"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </div>
            )}

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div> {/* ✅ wrapper close */}
    </PublicLayout>
  );
};

export default PaymentPage;