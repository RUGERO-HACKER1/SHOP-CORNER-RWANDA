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
                <h1 className="text-4xl font-bold mb-4 tracking-tight">CONTACT US</h1>
                <p className="text-gray-500">We'd love to hear from you. Here's how you can reach us.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-gray-50 p-8 rounded-2xl">
                        <h3 className="font-bold text-xl mb-6">Get in Touch</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    <MapPin className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Visit Us</h4>
                                    <p className="text-gray-600">KG 123 St, Kigali, Rwanda<br />Ground Floor, Fashion Plaza</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    <Mail className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Email Us</h4>
                                    <p className="text-gray-600">support@shopcorner.rw<br />sales@shopcorner.rw</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    <Phone className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Call Us</h4>
                                    <p className="text-gray-600">+250 788 000 000<br />Mon - Fri, 8am - 6pm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Your Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Message</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full border-2 border-gray-100 rounded-lg p-4 focus:outline-none focus:border-black transition bg-gray-50"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
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
