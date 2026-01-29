import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';

const Contact = () => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                addToast('Message sent successfully! We will get back to you soon.', 'success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                addToast('Failed to send message.', 'error');
            }
        } catch (err) {
            addToast('Error sending message.', 'error');
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 tracking-tight dark:text-white">CONTACT US</h1>
                <p className="text-gray-500 dark:text-gray-400">We'd love to hear from you. Here's how you can reach us.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-2xl transition-colors border dark:border-white/5">
                        <h3 className="font-bold text-xl mb-6 dark:text-white">Get in Touch</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-black rounded-full shadow-sm">
                                    <MapPin className="w-6 h-6 text-black dark:text-shein-red" />
                                </div>
                                <div>
                                    <h4 className="font-bold dark:text-white">Visit Us</h4>
                                    <p className="text-gray-600 dark:text-gray-400">KG 123 St, Kigali, Rwanda<br />Ground Floor, Fashion Plaza</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-black rounded-full shadow-sm">
                                    <Mail className="w-6 h-6 text-black dark:text-shein-red" />
                                </div>
                                <div>
                                    <h4 className="font-bold dark:text-white">Email Us</h4>
                                    <p className="text-gray-600 dark:text-gray-400">support@shopcorner.rw<br />sales@shopcorner.rw</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-black rounded-full shadow-sm">
                                    <Phone className="w-6 h-6 text-black dark:text-shein-red" />
                                </div>
                                <div>
                                    <h4 className="font-bold dark:text-white">Call Us</h4>
                                    <p className="text-gray-600 dark:text-gray-400">+250 788 000 000<br />Mon - Fri, 8am - 6pm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white dark:bg-transparent">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Your Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full border-b-2 border-gray-200 dark:border-white/10 py-3 bg-transparent text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-shein-red transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border-b-2 border-gray-200 dark:border-white/10 py-3 bg-transparent text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-shein-red transition"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Message</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full border-2 border-gray-100 dark:border-white/10 rounded-lg p-4 focus:outline-none focus:border-black dark:focus:border-shein-red transition bg-gray-50 dark:bg-black/20 text-black dark:text-white"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black dark:bg-shein-red text-white font-bold py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-red-600 transition flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
