import React from 'react';
import { ShieldCheck, RefreshCw, Clock } from 'lucide-react';

const Returns = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">RETURN POLICY</h1>
                <p className="text-gray-500">Simple, transparent, and hassle-free returns.</p>
            </div>

            {/* Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="border border-gray-200 p-6 rounded-xl text-center">
                    <Clock className="w-10 h-10 mx-auto mb-4 text-black" />
                    <h3 className="font-bold">45 Days</h3>
                    <p className="text-sm text-gray-500">Return window from delivery date</p>
                </div>
                <div className="border border-gray-200 p-6 rounded-xl text-center">
                    <RefreshCw className="w-10 h-10 mx-auto mb-4 text-black" />
                    <h3 className="font-bold">Free Returns</h3>
                    <p className="text-sm text-gray-500">First return per order is free</p>
                </div>
                <div className="border border-gray-200 p-6 rounded-xl text-center">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-black" />
                    <h3 className="font-bold">Quality Guarantee</h3>
                    <p className="text-sm text-gray-500">Full refund for defective items</p>
                </div>
            </div>

            {/* Policy Text */}
            <div className="space-y-8 text-gray-700">
                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">How do I return?</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Sign into your account and view "My Orders".</li>
                        <li>Click the "Return Item" button next to the product you wish to return.</li>
                        <li>Select the reason and print the return label.</li>
                        <li>Drop off the package at your nearest courier location.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">Refund Method</h2>
                    <p>
                        Refunds will be processed to your original payment method or as store credit (your choice) within 7 business days
                        of us receiving your return package.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">Non-Returnable Items</h2>
                    <p className="mb-2">The following items cannot be returned due to hygiene reasons:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Bodysuits, Lingerie, and Sleepwear</li>
                        <li>Swimwear (if hygiene sticker is removed)</li>
                        <li>Jewelry and Accessories</li>
                        <li>Final Sale items</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Returns;
