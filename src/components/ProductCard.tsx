import { Heart, RefreshCw, Star, ShieldCheck, ShoppingCart, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  wishlisted: boolean;
  compared: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  wishlisted,
  compared,
  onToggleWishlist,
  onToggleCompare,
  onSelectProduct,
  onAddToCart,
}: ProductCardProps) {
  const discountAmount = product.originalPrice - product.price;

  return (
    <div
      className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full relative group"
      id={`product-card-${product.id}`}
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {product.discount > 0 && (
          <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm shadow-sm uppercase tracking-wider">
            Save {product.discount}%
          </span>
        )}
        {product.featured && (
          <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm shadow-sm uppercase tracking-wider">
            Official Recommended
          </span>
        )}
      </div>

      {/* Wishlist toggle */}
      <button
        onClick={() => onToggleWishlist(product.id)}
        className={`absolute top-3 right-3 p-1.5 rounded-sm border shadow-sm backdrop-blur-sm z-10 transition-all duration-300 ${
          wishlisted
            ? 'bg-red-50 text-red-600 border-red-200'
            : 'bg-white/80 text-gray-500 hover:text-red-600 hover:bg-white border-gray-200'
        }`}
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-red-600' : ''}`} />
      </button>

      {/* Image container */}
      <div
        onClick={() => onSelectProduct(product)}
        className="w-full aspect-[4/3] overflow-hidden bg-gray-50 relative cursor-pointer border-b border-gray-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        
        {/* Quick View Spec Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/95 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm border border-gray-200 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-600" /> Details
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        {/* Sub-category / Brand series */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
            Lenovo {product.subCategory}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-800">{product.rating}</span>
            <span className="text-[10px] font-medium text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="text-xs font-bold text-gray-900 mt-1.5 cursor-pointer line-clamp-2 hover:text-blue-600 transition-colors h-10 leading-snug"
        >
          {product.name}
        </h3>

        {/* Key Specs Row */}
        {product.category === 'Laptops' || product.category === 'Gaming' ? (
          <div className="my-3 py-2 px-2.5 bg-gray-50 rounded-sm flex flex-col gap-1.5 text-left border border-gray-100">
            {product.specs.processor && (
              <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-gray-600">
                <span className="font-bold text-gray-400 uppercase text-[8px] tracking-wide">CPU</span>
                <span className="truncate text-right font-semibold text-gray-700">{product.specs.processor}</span>
              </div>
            )}
            {product.specs.gpu && (
              <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-gray-600">
                <span className="font-bold text-gray-400 uppercase text-[8px] tracking-wide">GPU</span>
                <span className="truncate text-right font-semibold text-blue-600">{product.specs.gpu}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[10px] font-medium text-gray-600">
              <span className="font-bold text-gray-400 uppercase text-[8px] tracking-wide">RAM / SSD</span>
              <span className="font-semibold text-gray-700">{product.specs.ram?.split(' ')[0]} / {product.specs.storage?.split(' ')[0]}</span>
            </div>
          </div>
        ) : (
          <div className="my-3 py-2 px-2.5 bg-gray-50 rounded-sm flex flex-col gap-1.5 text-left border border-gray-100">
            {product.specs.screen && (
              <div className="flex items-center justify-between text-[10px] font-medium text-gray-600">
                <span className="font-bold text-gray-400 uppercase text-[8px] tracking-wide">Display</span>
                <span className="truncate font-semibold text-gray-700">{product.specs.screen}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[10px] font-medium text-gray-600">
              <span className="font-bold text-gray-400 uppercase text-[8px] tracking-wide">Warranty</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Official
              </span>
            </div>
          </div>
        )}

        {/* Price & original price */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
          <div className="flex flex-col text-left">
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through font-medium leading-none">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-extrabold text-slate-900 mt-0.5 leading-none">
              PKR {product.price.toLocaleString()}
            </span>
          </div>

          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-sm">
            In Stock
          </span>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {/* Add to Compare */}
          <button
            onClick={() => onToggleCompare(product)}
            className={`col-span-1 border rounded-sm flex items-center justify-center transition-all cursor-pointer ${
              compared
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50'
            }`}
            title={compared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${compared ? 'animate-spin' : ''}`} />
          </button>

          {/* Add to Cart / Configure Button */}
          <button
            onClick={() => {
              if (product.customisable) {
                onSelectProduct(product);
              } else {
                onAddToCart(product);
              }
            }}
            className="col-span-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-sm transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {product.customisable ? (
              <>Configure</>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
