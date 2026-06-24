import React, { useState } from 'react';
import { Shield, Clock, Phone, MapPin, Send, HelpCircle, FileText } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSuccess(true);
    setEmail('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <footer className="w-full bg-slate-900 text-gray-400 text-xs border-t border-slate-800" id="main-footer">
      {/* Upper Features Ribbons */}
      <div className="bg-slate-800 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-2.5">
            <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Official Brand Warranty</h4>
              <p className="text-gray-300 mt-1 font-semibold leading-relaxed text-[11px]">
                Direct authorized coverage across Pakistan. Instant claims via designated service centers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Free Secure Delivery</h4>
              <p className="text-gray-300 mt-1 font-semibold leading-relaxed text-[11px]">
                Free logistics via TCS and Leopard on all orders above 50,000 PKR. Fully cased.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Corporate Help & Sales</h4>
              <p className="text-gray-300 mt-1 font-semibold leading-relaxed text-[11px]">
                Need bulk enterprise upgrades? Speak to a workspace manager at 021-35308691.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Sourced & Partnered</h4>
              <p className="text-gray-300 mt-1 font-semibold leading-relaxed text-[11px]">
                Direct stock imports from global distributors in partnership with PC House Pakistan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer directories */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#E11925] text-white font-black px-2.5 py-0.5 tracking-tighter text-xs uppercase">
              lenovo
            </div>
            <span className="text-sm font-black text-white uppercase tracking-tight">Flagship Store</span>
          </div>
          <p className="font-semibold text-gray-300 leading-relaxed max-w-sm text-[11px]">
            Pakistan’s elite digital catalog for original high-performance Lenovo hardware. Sourced and powered in direct partnership with PC House, featuring customized hardware configurations, official local warranties, and secure nationwide doorstep dispatch.
          </p>
          <div className="space-y-1.5 font-bold text-gray-400 text-[11px]">
            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-600" /> Techno City Mall, I.I Chundrigar Rd, Karachi, Pakistan</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-600" /> Sales Helpline: 021-35308691 | 0300-0500412</p>
          </div>
        </div>

        {/* Directory columns */}
        <div className="md:col-span-2 space-y-2.5">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" /> Catalog Series
          </h4>
          <ul className="space-y-1.5 font-semibold text-[11px]">
            <li><span className="hover:text-white cursor-pointer transition-colors block">Lenovo Legion Series</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Lenovo ThinkPad Elite</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Lenovo Yoga Slim convert</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Lenovo LOQ Gamer Range</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Lenovo IdeaPad Notebooks</span></li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-2.5">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Consumer Help
          </h4>
          <ul className="space-y-1.5 font-semibold text-[11px]">
            <li><span className="hover:text-white cursor-pointer transition-colors block">Official Warranty claims</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Technical Support Ticket</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Secure Shipment tracking</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Corporate Bulk quotes</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors block">Returns & Refund terms</span></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">
            Subscribe to Lenovo Launch Alerts
          </h4>
          <p className="font-semibold text-gray-300 leading-relaxed text-[11px]">
            Register your email to receive direct alerts about hardware stock releases, custom pricing discounts, and Lenovo partner launches.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-1.5">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-sm text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 font-semibold shadow-inner"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {success && (
            <div className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 p-2 rounded-sm text-center">
              ✓ Successfully registered for Lenovo launch alerts!
            </div>
          )}
        </div>
      </div>

      {/* Under footer licensing */}
      <div className="bg-slate-950 py-5 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] font-bold text-gray-500">
          <p>© 2026 Lenovo Pakistan Flagship Store. Powered by PC House. Styled after HP Flagship Store Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-3 font-black uppercase text-gray-600 text-[10px]">
            <span>Karachi</span>
            <span>•</span>
            <span>Lahore</span>
            <span>•</span>
            <span>Islamabad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
