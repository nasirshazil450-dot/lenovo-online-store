import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, ShoppingCart, MessageSquare, Send, Check } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCartWithSpecs: (product: Product, ram: string, storage: string, price: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCartWithSpecs,
}: ProductDetailModalProps) {
  // Configurator states
  const [selectedRam, setSelectedRam] = useState(product.specs.ram || 'Base');
  const [selectedStorage, setSelectedStorage] = useState(product.specs.storage || 'Base');
  const [extraPrice, setExtraPrice] = useState(0);

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // General state
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  // Options for upgrades
  const ramUpgrades = product.customisable
    ? product.specs.ram?.includes('DDR4')
      ? [
          { label: '8GB DDR4 3200MHz', value: '8GB DDR4 3200MHz', priceDiff: 0 },
          { label: '16GB DDR4 Upgrade', value: '16GB DDR4 3200MHz', priceDiff: 15000 },
          { label: '32GB DDR4 Enterprise', value: '32GB DDR4 3200MHz', priceDiff: 35000 }
        ]
      : [
          { label: product.specs.ram || '16GB DDR5', value: product.specs.ram || '16GB DDR5', priceDiff: 0 },
          { label: '32GB DDR5 Elite Upgrade', value: '32GB DDR5 5600MHz', priceDiff: 30000 },
          { label: '64GB DDR5 Ultimate Upgrade', value: '64GB DDR5 5600MHz', priceDiff: 75000 }
        ]
    : [];

  const storageUpgrades = product.customisable
    ? [
        { label: product.specs.storage || '512GB NVMe SSD', value: product.specs.storage || '512GB NVMe SSD', priceDiff: 0 },
        { label: '1TB PCIe Gen4 Performance NVMe Upgrade', value: '1TB PCIe Gen4 NVMe SSD', priceDiff: 18000 },
        { label: '2TB PCIe Gen4 Extreme Speed Upgrade', value: '2TB PCIe Gen4 NVMe SSD', priceDiff: 45000 }
      ]
    : [];

  // Recalculate price when upgrades change
  useEffect(() => {
    let priceOffset = 0;
    if (product.customisable) {
      const selectedRamObj = ramUpgrades.find((r) => r.value === selectedRam);
      const selectedStorageObj = storageUpgrades.find((s) => s.value === selectedStorage);
      priceOffset += (selectedRamObj?.priceDiff || 0) + (selectedStorageObj?.priceDiff || 0);
    }
    setExtraPrice(priceOffset);
  }, [selectedRam, selectedStorage, product.customisable]);

  // Load reviews from localStorage or seed
  useEffect(() => {
    const key = `reviews_product_${product.id}`;
    const storedReviews = localStorage.getItem(key);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      // Seed default reviews
      const initialReviews: Review[] = [
        {
          id: '1',
          username: 'Muhammad Ali',
          rating: 5,
          comment: `Absolutely brilliant device! Received it yesterday in pristine packing. The Lenovo warranty is verified. Speed is beyond exceptional. Sourced from PC House PC imports. Highly recommend Lenovo Online Store!`,
          date: '2026-06-18',
          verified: true
        },
        {
          id: '2',
          username: 'Aisha Khan',
          rating: 4,
          comment: `Amazing build quality and screen contrast. Battery timing is around 7-8 hours on normal workspace loads. The cooling is completely silent unless you run heavy stress tests. Very happy with the purchase.`,
          date: '2026-06-15',
          verified: true
        }
      ];
      localStorage.setItem(key, JSON.stringify(initialReviews));
      setReviews(initialReviews);
    }
  }, [product.id]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const key = `reviews_product_${product.id}`;
    const newRevObj: Review = {
      id: Date.now().toString(),
      username: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0],
      verified: false
    };

    const updatedReviews = [newRevObj, ...reviews];
    localStorage.setItem(key, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);

    // Reset Form
    setNewReviewName('');
    setNewReviewComment('');
    setReviewSubmitted(true);
  };

  const finalPrice = product.price + extraPrice;

  const handleAddToCart = () => {
    const ramVal = product.customisable ? selectedRam : (product.specs.ram || '');
    const storageVal = product.customisable ? selectedStorage : (product.specs.storage || '');
    onAddToCartWithSpecs(product, ramVal, storageVal, finalPrice);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-300"
      id="product-detail-modal"
    >
      <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden animate-in scale-in duration-300">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
            <span className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
              Lenovo Authorized Flagship Spec Sheet
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Product Image & Gallery */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>

              {/* Highlights Bulletin */}
              <div className="bg-slate-50 border border-gray-200 rounded-sm p-4 text-left">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">Product Highlights</h4>
                <ul className="flex flex-col gap-1.5">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs text-gray-600 font-semibold flex items-start gap-1.5">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Specifications & Options */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <div>
                <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest leading-none">
                  Lenovo {product.subCategory} series
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-gray-800 ml-1.5">{product.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400">|</span>
                  <span className="text-xs font-bold text-gray-500">
                    {reviews.length} Verified Reviews
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                {product.description}
              </p>

              {/* Dynamic Configurator */}
              {product.customisable && (
                <div className="bg-blue-50/25 border border-blue-100 rounded-sm p-4 flex flex-col gap-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-blue-100 pb-2">
                    <span>⚡ Customize Hardware Specifications</span>
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-sm font-bold">Flexible</span>
                  </h4>

                  {/* RAM Upgrades */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Select Memory Size (RAM):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ramUpgrades.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setSelectedRam(item.value)}
                          className={`p-2.5 rounded-sm border text-xs text-left font-bold transition-all flex justify-between items-center cursor-pointer ${
                            selectedRam === item.value
                              ? 'bg-white border-blue-600 text-slate-900 shadow-sm ring-1 ring-blue-600'
                              : 'bg-white/50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="text-[11px] font-bold text-emerald-600 whitespace-nowrap">
                            {item.priceDiff === 0 ? 'Included' : `+PKR ${item.priceDiff.toLocaleString()}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Storage Upgrades */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Select NVMe M.2 Storage:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {storageUpgrades.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setSelectedStorage(item.value)}
                          className={`p-2.5 rounded-sm border text-xs text-left font-bold transition-all flex justify-between items-center cursor-pointer ${
                            selectedStorage === item.value
                              ? 'bg-white border-blue-600 text-slate-900 shadow-sm ring-1 ring-blue-600'
                              : 'bg-white/50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="text-[11px] font-bold text-emerald-600 whitespace-nowrap">
                            {item.priceDiff === 0 ? 'Included' : `+PKR ${item.priceDiff.toLocaleString()}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Buying */}
              <div className="bg-slate-50 border border-gray-200 rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Flagship Pricing Summary</span>
                  <div className="flex items-center gap-2.5 mt-1 justify-center sm:justify-start">
                    <span className="text-xl font-extrabold text-slate-900">
                      PKR {finalPrice.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && !extraPrice && (
                      <span className="text-xs text-gray-400 line-through font-semibold">
                        PKR {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5">
                    Includes GST, import costs & doorstep dispatch.
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 sm:flex-none px-5 py-2.5 text-white text-xs font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      addedSuccess
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-slate-900 hover:bg-blue-600'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </>
                    )}
                  </button>
                  
                  {/* Contact Us dropdown */}
                  <div className="relative flex-1 sm:flex-none">
                    <button
                      onClick={() => setShowContactOptions(!showContactOptions)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 hover:border-blue-600 hover:text-blue-600 text-slate-800 text-xs font-bold rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact Us</span>
                    </button>
                    
                    {showContactOptions && (
                      <div className="absolute right-0 bottom-full mb-2 w-56 bg-white border border-gray-200 rounded-sm shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 text-left">
                        <div className="px-2 py-1 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b pb-1 mb-1">
                          Product Inquiries
                        </div>
                        
                        {/* WhatsApp option */}
                        <a
                          href={`https://wa.me/923000500412?text=Hi%20Lenovo%20Flagship%20Store%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(product.name)}%20priced%20at%20PKR%20${finalPrice.toLocaleString()}%20from%20your%20online%20store.`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center gap-2.5 p-2 rounded-sm hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 1.01 11.45 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.96.512 3.878 1.483 5.581L1.95 22.05l5.836-1.514z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-extrabold leading-none">WhatsApp Chat</div>
                            <div className="text-[9px] text-gray-400 font-semibold mt-0.5">0300-0500412</div>
                          </div>
                        </a>
                        
                        {/* Phone call option */}
                        <a
                          href="tel:02135308691"
                          className="flex items-center gap-2.5 p-2 rounded-sm hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#0096EB] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-extrabold leading-none">Call Support</div>
                            <div className="text-[9px] text-gray-400 font-semibold mt-0.5">021-35308691</div>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="mt-2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">
                  Complete Technical Specifications
                </h4>
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val], idx) => (
                        <tr
                          key={key}
                          className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                          <td className="p-2 font-bold text-gray-400 uppercase tracking-wider w-1/3 border-r border-gray-150">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </td>
                          <td className="p-2 font-semibold text-gray-700 text-left">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Verified Customer Reviews</span>
                </h4>

                {/* Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="bg-slate-50 border border-gray-200 rounded-sm p-4 flex flex-col gap-4 text-left mb-6"
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b pb-1">
                    Write an honest review for this Lenovo device:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Haris Ahmed"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="p-2 bg-white border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Rating Star Scale</label>
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setNewReviewRating(idx + 1)}
                            className="p-0.5 text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                idx < newReviewRating ? 'fill-yellow-400' : 'text-gray-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Your Experience</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share details about performance, delivery timing, chassis finish..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="p-2 bg-white border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="self-end px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    Submit Review
                  </button>

                  {reviewSubmitted && (
                    <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-sm text-center">
                      Thank you! Your feedback has been verified and saved.
                    </div>
                  )}
                </form>

                {/* Reviews List */}
                <div className="flex flex-col gap-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-100 pb-4 last:border-b-0 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">{rev.username}</span>
                          {rev.verified && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-100">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 font-semibold mt-1.5 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
