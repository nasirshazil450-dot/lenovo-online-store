import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const cartTotal = cart.reduce((total, item) => total + item.configuredPrice * item.quantity, 0);
  const shippingFee = cartTotal > 50000 ? 0 : 1500; // Free shipping for orders above 50,000 PKR

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4.5 h-4.5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Shopping Cart</h3>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-sm font-bold">
                {cart.length} Items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShoppingCart className="w-10 h-10 text-gray-300 animate-bounce" />
                <p className="text-xs font-bold text-gray-400 mt-4 uppercase">Your Cart is Currently Empty</p>
                <p className="text-[10px] text-gray-400 max-w-xs mt-1">Configure some Lenovo high-performance devices to start shopping!</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-sm hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
                >
                  Return to Store
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 border border-gray-200 rounded-sm flex gap-3 text-left relative group hover:border-gray-300 transition-colors bg-white"
                >
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-sm border border-gray-200" />
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-blue-600 tracking-wider block leading-none">
                        {item.product.subCategory}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-1" title={item.product.name}>
                        {item.product.name}
                      </h4>

                      {/* Display custom hardware specs if present */}
                      {(item.configuredRam || item.configuredStorage) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.configuredRam && (
                            <span className="text-[8px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-sm border border-blue-100">
                              RAM: {item.configuredRam.split(' ')[0]}
                            </span>
                          )}
                          {item.configuredStorage && (
                            <span className="text-[8px] font-bold bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-sm border border-gray-200">
                              SSD: {item.configuredStorage.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        PKR {item.configuredPrice.toLocaleString()}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1.5 border border-gray-200 rounded-sm p-0.5 bg-gray-50 shadow-inner">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white text-gray-500 rounded-sm transition-colors cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[11px] font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white text-gray-500 rounded-sm transition-colors cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing Summary Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3.5">
              <div className="space-y-1.5 text-[11px] font-semibold text-gray-500 text-left">
                <div className="flex justify-between items-center">
                  <span>Cart Subtotal</span>
                  <span className="text-gray-900 font-bold">PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-emerald-600">
                    {shippingFee === 0 ? 'Free Shipping' : `PKR ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-1"></div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 uppercase">Total (inc. GST)</span>
                  <span className="font-black text-slate-900 text-sm">
                    PKR {(cartTotal + shippingFee).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex items-center gap-1.5 justify-center py-1 bg-blue-50/50 border border-blue-100 rounded-sm text-[9px] font-bold text-gray-600">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Authorized packing with secure transport warranty</span>
              </div>

              {/* Action */}
              <button
                onClick={onCheckout}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> Secure Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
