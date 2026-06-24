'use client';

import LandingNavbar from '@/components/landing-navbar';
import LandingFooter from '@/components/landing-footer';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
    
    // Clear inputs
    setName('');
    setEmail('');
    setRestaurant('');
    setMessage('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <LandingNavbar />

      <header className="relative pt-20 pb-16 text-center border-b border-[#D4A437]/10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#D4A437]/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Contact Our <span className="gold-gradient-text">Concierge</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 text-base md:text-lg">
            Have custom requirements or need technical support? Send us a message.
          </p>
        </div>
      </header>

      <main className="flex-grow py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="font-serif text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Whether you run a luxury hotel dining lounge or a small boutique cafe, we would love to help you design the perfect digital menu presentation.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#D4A437]/10 text-[#D4A437] border border-[#D4A437]/15">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">Email Address</h4>
                    <p className="text-gray-400 text-sm mt-1">concierge@digitalmenu.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#D4A437]/10 text-[#D4A437] border border-[#D4A437]/15">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">Phone Support</h4>
                    <p className="text-gray-400 text-sm mt-1">+1 (800) 555-GOLD</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#D4A437]/10 text-[#D4A437] border border-[#D4A437]/15">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">Headquarters</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      789 Fifth Avenue, 12th Floor<br />
                      New York, NY 10022
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div className="lg:col-span-2 glass-gold p-8 sm:p-10 rounded-3xl">
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-[#D4A437] mb-6 animate-pulse" />
                  <h3 className="font-serif text-3xl font-bold mb-3">Message Received</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                    Thank you for reaching out. A DigitalMenu concierge representative will contact you within the next 12 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-full border border-gray-700 hover:border-[#D4A437] text-gray-300 hover:text-white transition-all text-sm font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#0d0d0d] border border-gray-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#0d0d0d] border border-gray-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Restaurant Name <span className="text-gray-600">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={restaurant}
                      onChange={(e) => setRestaurant(e.target.value)}
                      placeholder="Royal Spice"
                      className="w-full bg-[#0d0d0d] border border-gray-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our culinary menu specialists help you?"
                      className="w-full bg-[#0d0d0d] border border-gray-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-base transition-all duration-300 shadow-[0_0_15px_rgba(212,164,55,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
