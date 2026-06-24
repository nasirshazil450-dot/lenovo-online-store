import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Heart, RefreshCw, Compass, Laptop, Shield, User, Menu, X, ArrowRight } from 'lucide-react';
import { CartItem, Product } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlist: string[];
  compareList: Product[];
  onOpenCart: () => void;
  onOpenCompare: () => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
  onSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectSubCategory: (sub: string) => void;
  onOpenOrders: () => void;
}

export default function Header({
  cart,
  wishlist,
  compareList,
  onOpenCart,
  onOpenCompare,
  onSelectProduct,
  allProducts,
  onSearch,
  onSelectCategory,
  onSelectSubCategory,
  onOpenOrders,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.configuredPrice * item.quantity, 0);

  // Filter products for suggestions
  const suggestions = searchQuery.trim()
    ? allProducts
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="w-full z-40 bg-white" id="main-header">
      {/* Announcement Bar / Top Utility Bar */}
      <div className="w-full bg-slate-900 text-white text-[11px] py-1.5 px-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex gap-4">
          <span>Karachi Office: 021-35308691</span>
          <span className="hidden sm:inline">Store Finder</span>
          <span className="hidden sm:inline">Support</span>
          <span className="hidden sm:inline">Business Solutions</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={onOpenOrders} className="hover:text-blue-400 transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer">
            <Compass className="w-3.5 h-3.5" />
            <span>Track Your Order</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 border-b border-gray-200">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-gray-700 hover:text-blue-600 transition-colors rounded-sm hover:bg-gray-50"
          id="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => { onSelectCategory('all'); onSearch(''); }} 
          id="brand-logo"
        >
          {/* Lenovo Red Box Logo */}
          <div className="bg-[#E11925] text-white px-3.5 py-1.5 text-xl sm:text-2xl font-black tracking-tighter uppercase flex items-center justify-center font-sans shadow-sm">
            lenovo
          </div>
          {/* Flagship Store & Powered By */}
          <div className="flex flex-col text-left justify-center leading-none">
            <span className="text-xs sm:text-[13px] font-extrabold tracking-tight text-[#0096EB] uppercase">
              Flagship Store
            </span>
            <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-gray-500 tracking-wider uppercase mt-0.5">
              <span>Powered By</span>
              <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[#39B54A] text-white text-[5px] font-black leading-none">
                P
              </span>
              <span className="text-[#39B54A] font-black">PC House</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-lg relative" id="search-container">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-4 pr-12 py-2 bg-gray-100 border-none rounded-sm text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-sm flex items-center justify-center transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Search Autocomplete */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-sm shadow-2xl border border-gray-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Suggested Products</div>
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSuggestionClick(p)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-sm flex items-center gap-3 transition-colors group"
                >
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-sm border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500">{p.subCategory}</div>
                    <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{p.name}</div>
                  </div>
                  <div className="text-xs font-bold text-red-600">
                    PKR {p.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-1.5 sm:gap-3" id="header-widgets">
          {/* Compare widget */}
          <button
            onClick={onOpenCompare}
            className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-sm transition-all relative flex items-center justify-center group"
            title="Compare Products"
            id="widget-compare"
          >
            <RefreshCw className="w-5.5 h-5.5 group-hover:rotate-45 transition-transform duration-300" />
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Orders tracker trigger */}
          <button
            onClick={onOpenOrders}
            className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-sm transition-all flex items-center justify-center group"
            title="Track Orders"
            id="widget-orders"
          >
            <User className="w-5.5 h-5.5" />
          </button>

          {/* Cart status */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-sm transition-all duration-300 shadow-sm group"
            id="widget-cart"
          >
            <div className="relative p-0.5">
              <ShoppingCart className="w-4.5 h-4.5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden lg:block leading-none pr-1">
              <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">My Cart</span>
              <span className="text-xs font-bold block mt-0.5 text-blue-400">
                {cartTotal > 0 ? `PKR ${cartTotal.toLocaleString()}` : 'Empty'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible under 768px */}
      <div className="md:hidden px-4 py-2 border-b border-gray-200 bg-gray-50">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 text-xs rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Category Sub-navigation */}
      <nav className="bg-gray-50 border-b border-gray-200 hidden md:block" id="category-nav">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center gap-8 text-sm font-semibold text-gray-600">
          <button onClick={() => { onSelectCategory('all'); onSearch(''); }} className="hover:text-blue-600 transition-colors py-0.5 border-b-2 border-transparent hover:border-blue-600">
            All Products
          </button>
          
          <div className="h-4 w-px bg-gray-300"></div>

          {/* Laptops */}
          <div className="relative group">
            <button onClick={() => onSelectCategory('Laptops')} className="hover:text-blue-600 transition-colors flex items-center gap-1 py-0.5 border-b-2 border-transparent hover:border-blue-600">
              Laptops <Laptop className="w-3.5 h-3.5" />
            </button>
            <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-sm shadow-xl p-3 z-50 hidden group-hover:flex flex-col gap-2 min-w-[200px] animate-in fade-in duration-200">
              <button onClick={() => onSelectSubCategory('ThinkPad')} className="text-left py-1.5 px-2.5 rounded-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">ThinkPad (Enterprise)</button>
              <button onClick={() => onSelectSubCategory('Yoga')} className="text-left py-1.5 px-2.5 rounded-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Yoga (Premium 2-in-1)</button>
              <button onClick={() => onSelectSubCategory('IdeaPad')} className="text-left py-1.5 px-2.5 rounded-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">IdeaPad (Student & Everyday)</button>
            </div>
          </div>

          {/* Gaming */}
          <div className="relative group">
            <button onClick={() => onSelectCategory('Gaming')} className="hover:text-blue-600 transition-colors flex items-center gap-1 py-0.5 border-b-2 border-transparent hover:border-blue-600">
              Gaming Gear
            </button>
            <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-sm shadow-xl p-3 z-50 hidden group-hover:flex flex-col gap-2 min-w-[200px] animate-in fade-in duration-200">
              <button onClick={() => onSelectSubCategory('Legion')} className="text-left py-1.5 px-2.5 rounded-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Legion Pro Series</button>
              <button onClick={() => onSelectSubCategory('LOQ')} className="text-left py-1.5 px-2.5 rounded-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">LOQ Entry Gaming</button>
            </div>
          </div>

          {/* Tablets */}
          <button onClick={() => onSelectCategory('Tablets')} className="hover:text-blue-600 transition-colors py-0.5 border-b-2 border-transparent hover:border-blue-600">
            Tablets
          </button>

          {/* Desktops */}
          <button onClick={() => onSelectCategory('Desktops')} className="hover:text-blue-600 transition-colors py-0.5 border-b-2 border-transparent hover:border-blue-600">
            Desktops
          </button>

          {/* Monitors */}
          <button onClick={() => onSelectCategory('Monitors')} className="hover:text-blue-600 transition-colors py-0.5 border-b-2 border-transparent hover:border-blue-600">
            Monitors & Screens
          </button>

          {/* Accessories */}
          <button onClick={() => onSelectCategory('Accessories')} className="hover:text-blue-600 transition-colors py-0.5 border-b-2 border-transparent hover:border-blue-600">
            Accessories
          </button>
          
          <div className="ml-auto flex items-center gap-4 text-xs font-bold text-gray-400">
            <div className="flex items-center gap-1 text-blue-600">
              <Shield className="w-4 h-4" />
              <span>Lenovo Official Partner Warranty</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-4/5 max-w-[300px] h-full bg-white p-6 shadow-2xl flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#E11925] text-white px-2 py-0.5 text-base font-black tracking-tighter uppercase flex items-center justify-center font-sans">
                  lenovo
                </div>
                <div className="flex flex-col text-left justify-center leading-none">
                  <span className="text-[10px] font-extrabold tracking-tight text-[#0096EB] uppercase">
                    Flagship Store
                  </span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">
                    By PC House
                  </span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Product Categories</div>
              
              <button
                onClick={() => { onSelectCategory('all'); onSearch(''); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gray-800 hover:text-blue-600 py-1 flex justify-between items-center"
              >
                All Products <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => { onSelectCategory('Laptops'); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gray-800 hover:text-blue-600 py-1 flex justify-between items-center"
              >
                Laptops <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <div className="pl-4 flex flex-col gap-2">
                <button onClick={() => { onSelectSubCategory('ThinkPad'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-gray-600 py-1 hover:text-blue-600">ThinkPad Series</button>
                <button onClick={() => { onSelectSubCategory('Yoga'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-gray-600 py-1 hover:text-blue-600">Yoga Series</button>
                <button onClick={() => { onSelectSubCategory('IdeaPad'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-gray-600 py-1 hover:text-blue-600">IdeaPad Series</button>
              </div>

              <button
                onClick={() => { onSelectCategory('Gaming'); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gray-800 hover:text-blue-600 py-1 flex justify-between items-center"
              >
                Gaming Gear <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <div className="pl-4 flex flex-col gap-2">
                <button onClick={() => { onSelectSubCategory('Legion'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-gray-600 py-1 hover:text-blue-600">Legion Gaming</button>
                <button onClick={() => { onSelectSubCategory('LOQ'); setMobileMenuOpen(false); }} className="text-left text-xs font-semibold text-gray-600 py-1 hover:text-blue-600">LOQ Entry Gaming</button>
              </div>

              <button
                onClick={() => { onSelectCategory('Tablets'); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gray-800 hover:text-blue-600 py-1 flex justify-between items-center"
              >
                Tablets <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => { onSelectCategory('Desktops'); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gray-800 hover:text-blue-600 py-1 flex justify-between items-center"
              >
                Desktops <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => { onSelectCategory('Monitors'); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gray-800 hover:text-blue-600 py-1 flex justify-between items-center"
              >
                Monitors <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => { onSelectCategory('Accessories'); setMobileMenuOpen(false); }}
                className="text-left font-bold text-gray-800 hover:text-blue-600 py-1 flex justify-between items-center"
              >
                Accessories <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
              <button
                onClick={() => { onOpenOrders(); setMobileMenuOpen(false); }}
                className="w-full py-2 px-4 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" /> Track My Order
              </button>
              <div className="text-center text-[11px] font-semibold text-gray-400">
                Authorized Lenovo Retailer Support: <br />
                <span className="text-gray-600">021-35308691</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
