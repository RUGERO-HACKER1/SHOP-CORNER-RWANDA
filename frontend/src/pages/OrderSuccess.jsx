import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100 max-w-md w-full">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-gray-900">Thank You!</h1>
                <p className="text-xl text-gray-600 mb-8">Your order has been placed successfully.</p>
                <div className="text-sm text-gray-500 mb-8 p-4 bg-gray-50 rounded">
                    <p>Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                    <p>Estimated Delivery: 3-5 Business Days</p>
                </div>
                <Link
                    to="/"
                    className="inline-block w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition"
                >
                    CONTINUE SHOPPING
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
