import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">OUR STORY</h1>
                <div className="w-24 h-1 bg-black mx-auto"></div>
            </div>

            <div className="space-y-12 text-lg text-gray-700 leading-relaxed">
                <section>
                    <p className="mb-6">
                        Welcome to <span className="font-bold text-black">SHOP CORNER RWANDA</span>, your ultimate destination for fashion-forward trends and timeless staples.
                        Born from a passion for style and accessibility, we believe that looking good shouldn't break the bank.
                    </p>
                    <p>
                        We curate the latest styles from around the globe, tailored specifically for the vibrant and dynamic spirit of Rwanda.
                        Whether you're looking for the perfect outfit for a night out in Kigali, comfortable workwear, or cozy updates for your home, we've got you covered.
                    </p>
                </section>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="font-bold text-xl mb-3 text-black">Quality First</h3>
                        <p className="text-sm">We handpick every item to ensure it meets our high standards of durability and style.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="font-bold text-xl mb-3 text-black">Local Love</h3>
                        <p className="text-sm">Proudly serving our community with fast local shipping and dedicated support.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="font-bold text-xl mb-3 text-black">Trend Setters</h3>
                        <p className="text-sm">Always ahead of the curve, bringing you the freshest looks every season.</p>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-black mb-4">Our Mission</h2>
                    <p>
                        To empower individuals to express themselves through fashion, offering a seamless and enjoyable shopping experience
                        right here in Rwanda. We are more than just a store; we are a community of style enthusiasts.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
