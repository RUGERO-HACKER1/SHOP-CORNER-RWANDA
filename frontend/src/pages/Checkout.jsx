import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';
import { Truck, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Checkout = () => {
    const { cartTotal, cart, clearCart } = useCart();
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        address: '',
        city: 'Kigali',
        phone: '',
        notes: '',
        latitude: null,
        longitude: null,
    });

    // Load Google Maps (requires valid API key in VITE_GOOGLE_MAPS_API_KEY)
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!mapRef.current) return;

        // If no key, don't try to load Maps JS – avoids the big Google error banner
        if (!apiKey) {
            console.warn('Google Maps API key is missing. Set VITE_GOOGLE_MAPS_API_KEY in your frontend .env file.');
            return;
        }

        const initIfReady = () => {
            if (window.google && window.google.maps) {
                setMapLoaded(true);
                setTimeout(() => initMap(), 100);
            }
        };

        if (window.google && window.google.maps) {
            initIfReady();
            return;
        }

        const existing = document.querySelector('script[data-google-maps]');
        if (existing) {
            existing.addEventListener('load', initIfReady);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.dataset.googleMaps = 'true';
        script.onload = initIfReady;
        script.onerror = () => {
            console.error('Failed to load Google Maps JS. Check your API key, billing, and allowed domains.');
        };
        document.head.appendChild(script);

        return () => {
            // leave script in DOM so map keeps working on navigation
        };
    }, []);

    const initMap = () => {
        if (!mapRef.current || !window.google) return;

        // Default to Kigali, Rwanda
        const defaultCenter = { lat: -1.9441, lng: 30.0619 };
        const newMap = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
        });

        const newMarker = new window.google.maps.Marker({
            map: newMap,
            position: defaultCenter,
            draggable: true,
            title: 'Delivery Location',
        });

        // Update location when marker is dragged
        newMarker.addListener('dragend', (e) => {
            const pos = e.latLng;
            setSelectedLocation({ lat: pos.lat(), lng: pos.lng() });
            setFormData(prev => ({
                ...prev,
                latitude: pos.lat(),
                longitude: pos.lng(),
            }));
            reverseGeocode(pos.lat(), pos.lng());
        });

        // Click to set marker
        newMap.addListener('click', (e) => {
            const pos = e.latLng;
            newMarker.setPosition(pos);
            setSelectedLocation({ lat: pos.lat(), lng: pos.lng() });
            setFormData(prev => ({
                ...prev,
                latitude: pos.lat(),
                longitude: pos.lng(),
            }));
            reverseGeocode(pos.lat(), pos.lng());
        });

        // Add search box
        const input = document.getElementById('map-search');
        if (input) {
            const searchBox = new window.google.maps.places.SearchBox(input);
            newMap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

            searchBox.addListener('places_changed', () => {
                const places = searchBox.getPlaces();
                if (places.length === 0) return;

                const place = places[0];
                if (!place.geometry) return;

                newMap.setCenter(place.geometry.location);
                newMap.setZoom(17);
                newMarker.setPosition(place.geometry.location);

                const loc = place.geometry.location;
                setSelectedLocation({ lat: loc.lat(), lng: loc.lng() });
                setFormData(prev => ({
                    ...prev,
                    address: place.formatted_address || place.name,
                    city: place.address_components?.find(c => c.types.includes('locality'))?.long_name || prev.city,
                    latitude: loc.lat(),
                    longitude: loc.lng(),
                }));
            });
        }

        setMap(newMap);
        setMarker(newMarker);
    };

    const reverseGeocode = (lat, lng) => {
        if (!window.google) return;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                setFormData(prev => ({
                    ...prev,
                    address: results[0].formatted_address,
                }));
            }
        });
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.phone || !formData.address) {
                addToast('Please fill in all required fields', 'error');
                setLoading(false);
                return;
            }

            // Create order directly (pay on delivery)
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        size: item.size,
                        price: item.price,
                    })),
                    totalAmount: cartTotal,
                    shippingAddress: {
                        name: formData.name,
                        address: formData.address,
                        city: formData.city,
                        phone: formData.phone,
                        notes: formData.notes,
                        coordinates: formData.latitude && formData.longitude
                            ? { lat: formData.latitude, lng: formData.longitude }
                            : null,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to place order');
            }

            const data = await response.json();
            addToast('Order placed successfully! You will pay on delivery.', 'success');
            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            addToast(error.message || 'Failed to place order. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl lg:max-w-5xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8 dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 dark:text-white">{t('check_title')}</h1>

            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Forms */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-8">
                    {/* Shipping Info */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-6 text-lg font-bold dark:text-white">
                            <Truck className="w-5 h-5 text-shein-red" />
                            <h2>{t('check_shipping_title')}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('check_full_name')}</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" required placeholder="John Doe" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('check_address')}</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" required placeholder="123 Fashion St" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('check_city')}</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" required placeholder="New York" />
                            </div>
                            {/* ZIP / Postal Code removed as not needed */}
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-4 text-lg font-bold dark:text-white">
                            <MapPin className="w-5 h-5 text-shein-red" />
                            <h2>Select Delivery Location</h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Click on the map or drag the marker to set your delivery location. You can also search for an address.
                        </p>
                        <input
                            id="map-search"
                            type="text"
                            placeholder="Search for an address..."
                            className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 mb-4 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                        />
                        <div
                            ref={mapRef}
                            className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10"
                            style={{ minHeight: '256px' }}
                        />
                        {selectedLocation && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-6 text-lg font-bold dark:text-white">
                            <Truck className="w-5 h-5 text-shein-red" />
                            <h2>Contact Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                    required
                                    placeholder="0785617178"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Delivery Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                    rows="3"
                                    placeholder="Any special delivery instructions..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Info */}
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-start gap-3">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-green-900 dark:text-green-300 mb-2">Pay on Delivery</h3>
                                <p className="text-sm text-green-800 dark:text-green-400">
                                    You will pay when you receive your order. Our delivery team accepts cash payments. 
                                    Make sure you have the exact amount ready for a smooth delivery experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-shein-red text-white font-bold py-3 sm:py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-red-600 transition disabled:bg-gray-400 dark:disabled:bg-white/10 shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                <span>Placing Order...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Place Order - Pay on Delivery ({cartTotal.toLocaleString()} RWF)</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Mini Summary */}
                <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-lg lg:sticky lg:top-24 border dark:border-white/5 transition-colors">
                        <h3 className="font-bold mb-4 dark:text-white">{t('check_your_order')}</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto mb-4 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                    <img src={item.image} alt="" className="w-16 h-20 object-cover rounded dark:opacity-80" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium truncate dark:text-gray-200">{item.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                                        <p className="text-sm font-bold dark:text-white">{(item.price * item.quantity).toLocaleString()} RWF</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-white/10 pt-4 flex justify-between font-bold text-lg dark:text-white">
                            <span>{t('cart_total')}</span>
                            <span>{cartTotal.toLocaleString()} RWF</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
