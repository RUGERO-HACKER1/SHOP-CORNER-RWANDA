import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 tracking-tight dark:text-white">OUR STORY</h1>
                <div className="w-24 h-1 bg-black dark:bg-shein-red mx-auto"></div>
            </div>

            <div className="space-y-12 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <section>
                    <p className="mb-6">
                        Welcome to <span className="font-bold text-black dark:text-white">SHOP CORNER RWANDA</span>, your ultimate destination for fashion-forward trends and timeless staples.
                        Born from a passion for style and accessibility, we believe that looking good shouldn't break the bank.
                    </p>
                    <p>
                        We curate the latest styles from around the globe, tailored specifically for the vibrant and dynamic spirit of Rwanda.
                        Whether you're looking for the perfect outfit for a night out in Kigali, comfortable workwear, or cozy updates for your home, we've got you covered.
                    </p>
                </section>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-xl transition-colors">
                        <h3 className="font-bold text-xl mb-3 text-black dark:text-white">Quality First</h3>
                        <p className="text-sm dark:text-gray-400">We handpick every item to ensure it meets our high standards of durability and style.</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-xl transition-colors">
                        <h3 className="font-bold text-xl mb-3 text-black dark:text-white">Local Love</h3>
                        <p className="text-sm dark:text-gray-400">Proudly serving our community with fast local shipping and dedicated support.</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-xl transition-colors">
                        <h3 className="font-bold text-xl mb-3 text-black dark:text-white">Trend Setters</h3>
                        <p className="text-sm dark:text-gray-400">Always ahead of the curve, bringing you the freshest looks every season.</p>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Our Mission</h2>
                    <p className="dark:text-gray-400">
                        To empower individuals to express themselves through fashion, offering a seamless and enjoyable shopping experience
                        right here in Rwanda. We are more than just a store; we are a community of style enthusiasts.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
