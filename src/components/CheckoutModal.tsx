import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ChevronRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderPlaced: (order: Order) => void;
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onOrderPlaced,
  onClearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Bank Transfer' | 'Card Payment'>('Cash on Delivery');

  // Success details
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const cartTotal = cart.reduce((total, item) => total + item.configuredPrice * item.quantity, 0);
  const shippingFee = cartTotal > 50000 ? 0 : 1500;
  const finalTotal = cartTotal + shippingFee;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePlaceOrder = () => {
    // Generate order object
    const trackingNum = `LEN-${Math.floor(100000 + Math.random() * 900000)}-PK`;
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cart,
      shippingDetails: {
        name,
        email,
        phone,
        address,
        city,
        zipCode,
      },
      paymentMethod,
      total: finalTotal,
      status: 'Order Placed',
      date: new Date().toISOString().split('T')[0],
      trackingNumber: trackingNum,
    };

    // Save order
    const storedOrders = localStorage.getItem('orders_history');
    const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('orders_history', JSON.stringify(updatedOrders));

    setPlacedOrder(newOrder);
    onOrderPlaced(newOrder);
    onClearCart();
    setStep(3); // Go to success screen
  };

  const citiesList = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala'
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-300"
      id="checkout-modal"
    >
      <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Secure Order Checkout</h3>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Checkout Stepper Progress */}
        {step !== 3 && (
          <div className="bg-gray-50/50 border-b border-gray-200 py-2.5 px-6 flex items-center justify-center gap-4 text-[11px] font-bold">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-blue-600' : 'text-emerald-600'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                1
              </span>
              <span>Shipping Details</span>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                2
              </span>
              <span>Payment & Summary</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {step === 1 && (
            <form onSubmit={handleNextStep} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
              {/* Form inputs */}
              <div className="lg:col-span-7 space-y-3.5">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider border-b pb-1.5">
                  1. Contact & Shipping Address
                </h4>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Nasir Shazil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 0300-1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="p-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Complete Dispatch Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Flat 4C, Lane 5, Bukhari Commercial, Phase 6 DHA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="p-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Select City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="p-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-bold text-slate-800 bg-white shadow-sm"
                    >
                      {citiesList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Zip / Postal Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 75500"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="p-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Side Summary Panel */}
              <div className="lg:col-span-5 bg-slate-50 border border-gray-200 rounded-sm p-4 flex flex-col gap-4 self-stretch">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider border-b pb-1.5">
                  Order Summary
                </h4>

                <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2.5 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-2.5 items-center justify-between py-1 border-b border-gray-200/50 last:border-0">
                      <div className="min-w-0 text-left">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">{item.product.subCategory}</span>
                        <span className="text-xs font-bold text-slate-800 block truncate" title={item.product.name}>
                          {item.product.name}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold block mt-0.5">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        PKR {(item.configuredPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2.5 space-y-1.5 text-[11px] font-semibold text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Items Subtotal</span>
                    <span className="text-slate-950 font-bold">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping fee</span>
                    <span className="font-bold text-emerald-600">
                      {shippingFee === 0 ? 'Free Shipping' : `PKR ${shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 my-1"></div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                    <span>Total Bill</span>
                    <span className="text-sm">PKR {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-sm transition-all shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                >
                  Continue to Payment <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
              {/* Payment selection */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider border-b pb-1.5">
                  2. Select Payment Mode
                </h4>

                <div className="flex flex-col gap-2.5">
                  {/* Option 1: Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3 rounded-sm border text-left flex gap-3 items-start transition-all cursor-pointer ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'bg-white border-blue-600 ring-1 ring-blue-600 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="p-1 bg-blue-50 text-blue-600 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] flex-1">
                      <div className="font-bold text-slate-900">Cash on Delivery (COD)</div>
                      <div className="text-gray-500 font-medium mt-0.5 leading-relaxed">
                        Pay in cash upon doorstep package delivery. Available nationwide. Ideal for rapid verification.
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`p-3 rounded-sm border text-left flex gap-3 items-start transition-all cursor-pointer ${
                      paymentMethod === 'Bank Transfer'
                        ? 'bg-white border-blue-600 ring-1 ring-blue-600 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="p-1 bg-blue-50 text-blue-600 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] flex-1">
                      <div className="font-bold text-slate-900">Direct Bank Wire Transfer</div>
                      <div className="text-gray-500 font-medium mt-0.5 leading-relaxed">
                        Transfer to our Alfalah Bank corporate account. Send transfer receipt via WhatsApp support to confirm dispatch.
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Card Payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card Payment')}
                    className={`p-3 rounded-sm border text-left flex gap-3 items-start transition-all cursor-pointer ${
                      paymentMethod === 'Card Payment'
                        ? 'bg-white border-blue-600 ring-1 ring-blue-600 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="p-1 bg-blue-50 text-blue-600 mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] flex-1">
                      <div className="font-bold text-slate-900">Credit / Debit Card</div>
                      <div className="text-gray-500 font-medium mt-0.5 leading-relaxed">
                        Pay securely using Visa, MasterCard, or UnionPay. Simulated sandbox transaction portal.
                      </div>
                    </div>
                  </button>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-sm p-3 text-[11px] font-semibold text-gray-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Flagship Consumer Safeguard:</span> <br />
                    <span>Every notebook or monitor ordered is double-sealed inside specialized shockproof logistics casing. Brand warranty starts automatically from date of doorstep delivery receipt.</span>
                  </div>
                </div>
              </div>

              {/* Confirm Summary Side Column */}
              <div className="lg:col-span-5 bg-slate-50 border border-gray-200 rounded-sm p-4 flex flex-col gap-4 self-stretch text-left">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider border-b pb-1.5">
                  Confirm Order details
                </h4>

                <div className="space-y-2 text-xs font-semibold text-gray-500">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b pb-0.5">Shipping Target</div>
                  <div>
                    <div className="font-bold text-slate-850">{name}</div>
                    <div className="text-gray-600 mt-0.5">{phone}</div>
                    <div className="text-gray-600 truncate">{address}</div>
                    <div className="text-gray-600 font-bold mt-0.5">{city}, Pakistan</div>
                  </div>
                </div>

                <div className="border-t pt-2.5 space-y-1.5 text-xs font-semibold text-gray-500">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b pb-0.5">Bill Summary</div>
                  <div className="flex justify-between items-center mt-1 text-[11px]">
                    <span>Items Total</span>
                    <span className="font-bold text-slate-800">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900 pt-1">
                    <span>Total Payable</span>
                    <span className="text-slate-900">PKR {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-2 border border-gray-200 hover:border-gray-400 rounded-sm text-xs font-bold text-gray-700 transition-colors bg-white text-center cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm transition-all shadow-sm text-center cursor-pointer"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && placedOrder && (
            <div className="max-w-xl mx-auto py-6 text-center flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Order Placed Successfully!</h2>
                <p className="text-xs text-gray-500 font-bold">
                  Your Lenovo hardware configuration has been dispatched to our warehouse queue.
                </p>
              </div>

              {/* Tracking Receipt Card */}
              <div className="w-full bg-slate-50 border border-gray-200 rounded-sm p-4 text-left space-y-3.5">
                <div className="flex justify-between items-center border-b pb-2.5 border-gray-200">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Order Tracking Code</span>
                    <span className="text-sm font-black text-blue-600 tracking-tight block mt-1">
                      {placedOrder.trackingNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Order Total</span>
                    <span className="text-xs font-black text-slate-900 block mt-1">
                      PKR {placedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-gray-500">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Recipient Name</span>
                    <span className="font-bold text-slate-800 mt-1 block">{placedOrder.shippingDetails.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Phone Contact</span>
                    <span className="font-bold text-slate-800 mt-1 block">{placedOrder.shippingDetails.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Delivery Location</span>
                    <span className="font-bold text-slate-700 mt-1 block leading-relaxed">
                      {placedOrder.shippingDetails.address}, {placedOrder.shippingDetails.city}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-1"></div>

                <div className="flex gap-2 items-center text-[11px] font-semibold text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Estimated doorstep delivery: <strong className="text-slate-800">2-3 working days</strong></span>
                </div>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-sm transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
