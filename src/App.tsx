import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, RefreshCw, ShoppingCart, Check, Filter, ArrowUpDown } from 'lucide-react';

import Header from './components/Header';
import Hero from './components/Hero';
import CategorySlider from './components/CategorySlider';
import ProductCard from './components/ProductCard';
import ProductCompare from './components/ProductCompare';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersTracker from './components/OrdersTracker';
import Footer from './components/Footer';

import { products } from './data/products';
import { Product, CartItem } from './types';

export default function App() {
  // Global States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  // Navigation / Filter States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedProcessor, setSelectedProcessor] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(750000);

  // Active Modals & Overlay triggers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [globalContactOpen, setGlobalContactOpen] = useState(false);

  // General Notification Toasts
  const [toastMessage, setToastMessage] = useState<string>('');

  // Load state from localStorage on Mount
  useEffect(() => {
    const storedCart = localStorage.getItem('lenovo_cart');
    const storedWishlist = localStorage.getItem('lenovo_wishlist');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  // Save states to localStorage on state change
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('lenovo_cart', JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('lenovo_wishlist', JSON.stringify(newWishlist));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const cartItemId = product.id; // unique base item key
    const existing = cart.find((item) => item.id === cartItemId);
    
    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: cartItemId,
          product,
          quantity: 1,
          configuredPrice: product.price,
        },
      ];
    }
    saveCart(updatedCart);
    showToast(`Added ${product.name} to your shopping cart!`);
  };

  const handleAddToCartWithSpecs = (product: Product, ram: string, storage: string, price: number) => {
    // Generate a unique card identifier based on customized configuration
    const cartItemId = `${product.id}-${ram.replace(/\s+/g, '')}-${storage.replace(/\s+/g, '')}`;
    const existing = cart.find((item) => item.id === cartItemId);

    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: cartItemId,
          product,
          quantity: 1,
          configuredRam: ram,
          configuredStorage: storage,
          configuredPrice: price,
        },
      ];
    }
    saveCart(updatedCart);
    showToast(`Successfully added customized configuration of ${product.name} to cart!`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    const updated = cart.map((item) => (item.id === id ? { ...item, quantity } : item));
    saveCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
    showToast('Removed item from shopping cart.');
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    let updated: string[];
    const isPresent = wishlist.includes(productId);
    if (isPresent) {
      updated = wishlist.filter((id) => id !== productId);
      showToast('Removed device from your wishlist.');
    } else {
      updated = [...wishlist, productId];
      showToast('Added device to your saved wishlist!');
    }
    saveWishlist(updated);
  };

  // Compare operations
  const handleToggleCompare = (product: Product) => {
    const isPresent = compareList.some((p) => p.id === product.id);
    if (isPresent) {
      setCompareList(compareList.filter((p) => p.id !== product.id));
      showToast('Removed from compare list.');
    } else {
      if (compareList.length >= 3) {
        showToast('You can compare a maximum of 3 products at a time!');
        return;
      }
      setCompareList([...compareList, product]);
      showToast('Added to compare list.');
    }
  };

  const handleRemoveFromCompare = (product: Product) => {
    setCompareList(compareList.filter((p) => p.id !== product.id));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Dynamic filter lists
  const processorsList = ['all', 'Intel Core i9', 'Intel Core i7', 'Intel Core Ultra', 'Intel Core i5', 'AMD Ryzen'];

  // Main Filter Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }

    // 2. Sub-Category Filter (ThinkPad, Yoga, LOQ, Legion etc)
    if (activeSubCategory !== 'all' && product.subCategory !== activeSubCategory) {
      return false;
    }

    // 3. Search Query Filter
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 4. Processor Filter
    if (selectedProcessor !== 'all') {
      if (!product.specs.processor?.toLowerCase().includes(selectedProcessor.toLowerCase())) {
        return false;
      }
    }

    // 5. Price Filter
    if (product.price > priceRange) {
      return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Default featured sort
    return b.featured ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-x-hidden" id="lenovo-online-store-root">
      {/* Dynamic Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-slate-900 text-blue-600 text-xs font-bold px-5 py-3 rounded-sm border border-slate-800 shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header component */}
      <Header
        cart={cart}
        wishlist={wishlist}
        compareList={compareList}
        onOpenCart={() => setCartOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onSelectProduct={setSelectedProduct}
        allProducts={products}
        onSearch={handleSearch}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveSubCategory('all');
        }}
        onSelectSubCategory={(sub) => {
          // Find matching category automatically
          const target = products.find((p) => p.subCategory === sub);
          if (target) {
            setActiveCategory(target.category);
          }
          setActiveSubCategory(sub);
        }}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      {/* Immersive Hero Slider Banners */}
      {activeCategory === 'all' && !searchQuery && (
        <Hero onSelectProduct={setSelectedProduct} allProducts={products} />
      )}

      {/* Value Ribbons bar */}
      <div className="w-full bg-white border-b border-gray-200 py-3.5 hidden sm:block shadow-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-600">
            <div className="p-1 rounded-sm bg-blue-50 text-blue-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span>Authorized Partner Warranty</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-600 border-x border-gray-150">
            <div className="p-1 rounded-sm bg-emerald-50 text-emerald-600">
              <Check className="w-4 h-4" />
            </div>
            <span>Nationwide Secure Transport Pack</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-600">
            <div className="p-1 rounded-sm bg-blue-50 text-blue-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span>Modular Hardware Customization</span>
          </div>
        </div>
      </div>

      {/* Category Slider circles navigation */}
      {!searchQuery && (
        <CategorySlider
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          onSelectCategory={setActiveCategory}
          onSelectSubCategory={setActiveSubCategory}
        />
      )}

      {/* Main Catalog View Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 flex-1 w-full" id="catalog-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Filter Sidebar */}
          <aside className="lg:col-span-3 bg-white p-4 border border-gray-200 rounded-sm space-y-5 text-left shadow-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-[10px] font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-blue-600" /> Filter Devices
              </span>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveSubCategory('all');
                  setSelectedProcessor('all');
                  setPriceRange(750000);
                  setSearchQuery('');
                }}
                className="text-[9px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Filter by Processor */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Processor Type</span>
              <div className="flex flex-col gap-1">
                {processorsList.map((proc) => (
                  <button
                    key={proc}
                    onClick={() => setSelectedProcessor(proc)}
                    className={`w-full p-2 rounded-sm text-xs text-left font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedProcessor === proc
                        ? 'bg-blue-50/50 text-slate-900 border-l-2 border-blue-600 pl-2.5'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{proc === 'all' ? 'All Processors' : proc}</span>
                    {selectedProcessor === proc && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Max Price (PKR)</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm">
                  {priceRange.toLocaleString()} PKR
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={750000}
                step={10000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-semibold text-gray-400">
                <span>10K PKR</span>
                <span>750K PKR</span>
              </div>
            </div>

            {/* Help Support Hotline banner */}
            <div className="bg-slate-900 text-white rounded-sm p-4 space-y-1.5">
              <div className="text-[9px] font-black uppercase text-blue-600 tracking-widest leading-none">Lenovo Expert Hotline</div>
              <p className="text-[11px] font-medium text-gray-300 leading-normal">
                Stuck choosing high performance configs? Speak with a certified Lenovo representative.
              </p>
              <div className="text-sm font-bold text-blue-600 pt-0.5 leading-none">021-35308691</div>
            </div>
          </aside>

          {/* Right Column: Products Listing Grid */}
          <section className="lg:col-span-9 space-y-5">
            {/* Sorter header */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Active Catalogue
                </span>
                <h3 className="text-xs font-extrabold text-slate-900 mt-0.5">
                  Showing {sortedProducts.length} high-quality Lenovo products
                </h3>
              </div>

              {/* Sorter selection dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1.5 border border-gray-200 rounded-sm text-xs font-bold text-gray-700 bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="featured">Official Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating Status</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {sortedProducts.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-sm p-16 text-center text-xs text-gray-400 font-bold bg-white shadow-sm flex flex-col items-center justify-center">
                <ShieldAlert className="w-10 h-10 text-gray-300 animate-pulse" />
                <p className="mt-4 uppercase">No Products Match Your Filter Selection</p>
                <p className="text-xs text-gray-400 mt-1">Try resetting the pricing slide, search, or processor type selection.</p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveSubCategory('all');
                    setSelectedProcessor('all');
                    setPriceRange(750000);
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-sm hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlist.includes(product.id)}
                    compared={compareList.some((p) => p.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onToggleCompare={handleToggleCompare}
                    onSelectProduct={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Floating comparison status tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-sm p-3 shadow-2xl flex items-center gap-4 z-40 animate-in slide-in-from-bottom-12 duration-300">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 text-left">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <div>
              Compare List <br />
              <span className="text-[10px] font-bold text-blue-600">{compareList.length} of 3 selected</span>
            </div>
          </div>
          <button
            onClick={() => setCompareOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-bold rounded-sm transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wider cursor-pointer"
          >
            Compare Now
          </button>
          <button
            onClick={() => setCompareList([])}
            className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest pr-1 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Detailed Product spec modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCartWithSpecs={handleAddToCartWithSpecs}
        />
      )}

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Multistep Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onOrderPlaced={(order) => {
          // Open Tracking portal for the placed order automatically
          setOrdersOpen(true);
        }}
        onClearCart={handleClearCart}
      />

      {/* Order Tracking Logistics Board */}
      <OrdersTracker isOpen={ordersOpen} onClose={() => setOrdersOpen(false)} />

      {/* Brand rich Footer */}
      <Footer />

      {/* Global Floating Contact Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" id="global-contact-widget">
        <AnimatePresence>
          {globalContactOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white border border-gray-200 rounded-sm shadow-2xl p-3 w-56 flex flex-col gap-2 mb-2 text-left"
            >
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">
                Lenovo Flagship Helpdesk
              </div>
              
              {/* WhatsApp Option */}
              <a
                href="https://wa.me/923000500412?text=Hi%20Lenovo%20Flagship%20Store%2C%20I%20have%20an%20inquiry%20about%20a%20product."
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2.5 p-2 rounded-sm hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors group"
              >
                <div className="w-7.5 h-7.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 1.01 11.45 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.96.512 3.878 1.483 5.581L1.95 22.05l5.836-1.514z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-extrabold leading-none text-slate-800">WhatsApp Chat</div>
                  <div className="text-[9px] text-gray-400 font-semibold mt-0.5">0300-0500412</div>
                </div>
              </a>
              
              {/* Call Option */}
              <a
                href="tel:02135308691"
                className="flex items-center gap-2.5 p-2 rounded-sm hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors group"
              >
                <div className="w-7.5 h-7.5 rounded-full bg-[#0096EB] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-extrabold leading-none text-slate-800">Call Support</div>
                  <div className="text-[9px] text-gray-400 font-semibold mt-0.5">021-35308691</div>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Trigger Toggle Badge */}
        <button
          onClick={() => setGlobalContactOpen(!globalContactOpen)}
          className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-black py-3 px-5 rounded-full flex items-center gap-2 shadow-2xl transition-all duration-300 border border-slate-800 uppercase tracking-widest cursor-pointer select-none"
        >
          {globalContactOpen ? (
            <span>Close Help</span>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Contact Us</span>
            </>
          )}
        </button>
      </div>
      
      {/* Compare Modal Overlay */}
      {compareOpen && (
        <ProductCompare
          onClose={() => setCompareOpen(false)}
          compareList={compareList}
          onRemoveFromCompare={handleRemoveFromCompare}
          onAddToCart={handleAddToCart}
          onSelectProduct={setSelectedProduct}
        />
      )}
    </div>
  );
}
