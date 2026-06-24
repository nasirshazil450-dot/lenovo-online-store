import React, { useState, useEffect } from 'react';
import { X, Search, Compass, Truck, Package, Calendar, RefreshCcw, CheckCircle } from 'lucide-react';
import { Order } from '../types';

interface OrdersTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersTracker({ isOpen, onClose }: OrdersTrackerProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedOrders = localStorage.getItem('orders_history');
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        setOrders(parsed);
        // By default, show the latest order if available
        if (parsed.length > 0) {
          setSearchedOrder(parsed[0]);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingId.trim()) return;

    const match = orders.find(
      (o) =>
        o.trackingNumber.toLowerCase() === searchTrackingId.trim().toLowerCase() ||
        o.id.toLowerCase() === searchTrackingId.trim().toLowerCase()
    );

    if (match) {
      setSearchedOrder(match);
      setErrorText('');
    } else {
      setSearchedOrder(null);
      setErrorText('Order or tracking code not found e.g., LEN-XXXXXX-PK.');
    }
  };

  // Simulates stepping the order status forward
  const handleSimulateStep = (orderId: string) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        let nextStatus: Order['status'] = 'Order Placed';
        if (o.status === 'Order Placed') nextStatus = 'Processing';
        else if (o.status === 'Processing') nextStatus = 'In Transit';
        else if (o.status === 'In Transit') nextStatus = 'Delivered';
        else nextStatus = 'Order Placed'; // Reset loop

        return { ...o, status: nextStatus };
      }
      return o;
    });

    setOrders(updatedOrders);
    localStorage.setItem('orders_history', JSON.stringify(updatedOrders));

    // Update current active searched order
    const match = updatedOrders.find((o) => o.id === orderId);
    if (match) {
      setSearchedOrder(match);
    }
  };

  const getStatusIndex = (status: Order['status']) => {
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Processing':
        return 1;
      case 'In Transit':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const stepsList = [
    { label: 'Order Confirmed', description: 'Hardware checked & serials recorded' },
    { label: 'Cased & Packed', description: 'Double-sealed shock casing applied' },
    { label: 'In Transit', description: 'Leopard/TCS Courier dispatch underway' },
    { label: 'Delivered', description: 'Signed at recipient doorstep' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-300"
      id="orders-tracker-overlay"
    >
      <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Compass className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Order Tracking Portal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Tracker Search Input */}
          <div className="bg-slate-50 border border-gray-200 rounded-sm p-4 text-left space-y-3">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Track Your Authorized Delivery Dispatch
            </span>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                placeholder="Enter Tracking Code or Order ID (e.g., LEN-XXXXXX-PK)"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-bold text-slate-800 bg-white shadow-sm"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Search className="w-4 h-4" /> Locate Order
              </button>
            </form>
            {errorText && <div className="text-[11px] font-bold text-red-500">{errorText}</div>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Left Hand: Orders History List */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider border-b pb-1.5">
                Order History ({orders.length})
              </h4>

              {orders.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-sm p-6 text-center text-[11px] text-gray-400 font-bold bg-gray-50/20">
                  <Package className="w-7 h-7 mx-auto text-gray-300 animate-bounce" />
                  <p className="mt-2">No placed orders found in browser cache.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => { setSearchedOrder(o); setErrorText(''); }}
                      className={`w-full p-2.5 border rounded-sm text-left transition-all cursor-pointer ${
                        searchedOrder?.id === o.id
                          ? 'border-blue-600 bg-blue-50/25 ring-1 ring-blue-600'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase text-gray-400">
                        <span>{o.id}</span>
                        <span className="text-emerald-600">{o.status}</span>
                      </div>
                      <div className="font-bold text-xs text-slate-800 mt-1">
                        {o.shippingDetails.name}
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 mt-1.5 border-t pt-1.5 border-gray-100">
                        <span>{o.date}</span>
                        <span className="text-slate-900 font-extrabold">PKR {o.total.toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Hand: Detailed Live Tracker Progress bar */}
            <div className="lg:col-span-8 space-y-6">
              {searchedOrder ? (
                <div className="border border-gray-200 rounded-sm p-4 sm:p-5 space-y-5 shadow-sm">
                  {/* Summary Block */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900 tracking-tight">{searchedOrder.id}</span>
                        <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-sm font-bold tracking-wider uppercase">
                          {searchedOrder.status}
                        </span>
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
                        Tracking Code: <strong className="text-blue-600">{searchedOrder.trackingNumber}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSimulateStep(searchedOrder.id)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                        title="Simulate shipping progress"
                      >
                        <RefreshCcw className="w-3 h-3" /> Simulate Progress
                      </button>
                    </div>
                  </div>

                  {/* Progressive Tracking Display */}
                  <div className="space-y-5 relative pl-5 border-l-2 border-gray-100">
                    {stepsList.map((stepItem, idx) => {
                      const activeIndex = getStatusIndex(searchedOrder.status);
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={idx} className="relative text-left">
                          {/* Circle indicator */}
                          <div
                            className={`absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-100'
                                  : 'bg-emerald-500 border-emerald-500'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            {isCompleted && !isCurrent && <CheckCircle className="w-2.5 h-2.5 text-white fill-emerald-500" />}
                          </div>

                          <div className="space-y-0.5">
                            <h5
                              className={`text-[10px] font-black uppercase tracking-wider ${
                                isCompleted ? 'text-slate-900' : 'text-gray-400'
                              }`}
                            >
                              {stepItem.label}
                            </h5>
                            <p className="text-[11px] text-gray-500 font-medium">
                              {stepItem.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Footer */}
                  <div className="p-3 bg-slate-50 border border-gray-200 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4.5 h-4.5 text-gray-400" />
                      <div className="text-left font-semibold text-gray-500">
                        <div>Order Date: <strong className="text-slate-700">{searchedOrder.date}</strong></div>
                        <div className="mt-0.5">Payment: <strong className="text-slate-700">{searchedOrder.paymentMethod}</strong></div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right font-semibold text-gray-500">
                      <div>Shipment Destination:</div>
                      <div className="font-bold text-slate-700 mt-0.5 truncate max-w-[200px]">
                        {searchedOrder.shippingDetails.address}, {searchedOrder.shippingDetails.city}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-sm p-12 text-center text-xs text-gray-400 font-bold bg-gray-50/20 h-full flex flex-col items-center justify-center">
                  <Truck className="w-10 h-10 text-gray-300 animate-pulse" />
                  <p className="mt-4">Search or select an order on the left to display its real-time logistics progress.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
