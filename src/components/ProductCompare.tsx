import React from 'react';
import { X, RefreshCw, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCompareProps {
  compareList: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCompare({
  compareList,
  onRemoveFromCompare,
  onClose,
  onAddToCart,
  onSelectProduct,
}: ProductCompareProps) {
  if (compareList.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300"
      id="compare-overlay"
    >
      <div className="bg-white w-full max-w-6xl rounded-sm shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Product Comparison</h3>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-sm font-bold">
              {compareList.length} of 3 Selected
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid grid-cols-12 gap-4 min-w-[700px]">
            {/* Left Hand Spec Labels Column */}
            <div className="col-span-3 flex flex-col gap-8 pt-[210px] pr-4 border-r border-gray-200">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Price in PKR</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Processor</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Graphics GPU</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Memory RAM</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Storage Capacity</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Display Specs</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Weight</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Battery Unit</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10 flex items-center">Official Warranty</div>
            </div>

            {/* Compared Products Columns */}
            <div className="col-span-9 grid grid-cols-3 gap-6">
              {compareList.slice(0, 3).map((product) => (
                <div key={product.id} className="flex flex-col gap-8 text-left group">
                  {/* Product Header Card */}
                  <div className="h-[190px] flex flex-col justify-between p-3 border border-gray-200 rounded-sm relative bg-gray-50/50">
                    <button
                      onClick={() => onRemoveFromCompare(product)}
                      className="absolute top-2 right-2 p-1 bg-white hover:bg-red-50 border border-gray-200 rounded-sm text-gray-400 hover:text-red-600 transition-colors shadow-sm cursor-pointer"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded-sm border border-gray-100" />
                    <div className="mt-2 text-center">
                      <span className="text-[9px] font-bold uppercase text-blue-600 tracking-wider block leading-none">{product.subCategory}</span>
                      <span
                        onClick={() => { onClose(); onSelectProduct(product); }}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 cursor-pointer truncate block mt-1"
                      >
                        {product.name}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="h-10 flex items-center font-extrabold text-slate-900 text-xs">
                    PKR {product.price.toLocaleString()}
                  </div>

                  {/* Processor */}
                  <div className="h-10 flex items-center text-xs text-gray-700 font-semibold truncate" title={product.specs.processor || 'N/A'}>
                    {product.specs.processor || 'N/A'}
                  </div>

                  {/* Graphics */}
                  <div className="h-10 flex items-center text-xs text-blue-600 font-bold truncate" title={product.specs.gpu || 'N/A'}>
                    {product.specs.gpu || 'N/A'}
                  </div>

                  {/* RAM */}
                  <div className="h-10 flex items-center text-xs text-gray-700 font-semibold truncate" title={product.specs.ram || 'N/A'}>
                    {product.specs.ram || 'N/A'}
                  </div>

                  {/* Storage */}
                  <div className="h-10 flex items-center text-xs text-gray-700 font-semibold truncate" title={product.specs.storage || 'N/A'}>
                    {product.specs.storage || 'N/A'}
                  </div>

                  {/* Display */}
                  <div className="h-10 flex items-center text-xs text-gray-700 font-semibold line-clamp-2 leading-tight" title={product.specs.screen || 'N/A'}>
                    {product.specs.screen || 'N/A'}
                  </div>

                  {/* Weight */}
                  <div className="h-10 flex items-center text-xs text-gray-600 font-medium">
                    {product.specs.weight || 'N/A'}
                  </div>

                  {/* Battery */}
                  <div className="h-10 flex items-center text-xs text-gray-600 font-medium">
                    {product.specs.battery || 'N/A'}
                  </div>

                  {/* Warranty */}
                  <div className="h-10 flex items-center text-xs font-bold text-emerald-600">
                    {product.specs.warranty || 'No Warranty'}
                  </div>

                  {/* CTA button */}
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        onClose();
                        if (product.customisable) {
                          onSelectProduct(product);
                        } else {
                          onAddToCart(product);
                        }
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-sm transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {product.customisable ? (
                        <>Configure Specs <ArrowRight className="w-3.5 h-3.5" /></>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* Fill remaining space if comparing less than 3 */}
              {compareList.length < 3 &&
                Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center p-6 bg-gray-50/20 text-center h-[190px]"
                  >
                    <RefreshCw className="w-6 h-6 text-gray-300 animate-spin" />
                    <p className="text-[10px] font-bold text-gray-400 mt-2">Add another product to compare specs side-by-side</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
