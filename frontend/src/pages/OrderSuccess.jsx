import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
            <div className="bg-white dark:bg-[#1a1a1a] p-8 md:p-12 rounded-lg shadow-sm border border-gray-100 dark:border-white/5 max-w-md w-full">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Thank You!</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Your order has been placed successfully.</p>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 p-4 bg-gray-50 dark:bg-black/20 rounded">
                    <p className="font-bold mb-2">Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                    <p className="mb-2">Estimated Delivery: 3-5 Business Days</p>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                        <p className="font-bold text-green-600 dark:text-green-400">💵 Payment on Delivery</p>
                        <p className="text-xs mt-1">Please have cash ready when our delivery team arrives.</p>
                    </div>
                </div>
                <Link
                    to="/"
                    className="inline-block w-full bg-black dark:bg-shein-red text-white font-bold py-3 rounded hover:bg-gray-800 dark:hover:bg-red-600 transition shadow-lg"
                >
                    CONTINUE SHOPPING
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
