import React from 'react';
import { Laptop, Gamepad2, Monitor, Keyboard, Cpu, Tablet, HardDrive } from 'lucide-react';

interface CategorySliderProps {
  activeCategory: string;
  activeSubCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectSubCategory: (sub: string) => void;
}

export default function CategorySlider({
  activeCategory,
  activeSubCategory,
  onSelectCategory,
  onSelectSubCategory,
}: CategorySliderProps) {
  const categoriesList = [
    {
      id: 'all',
      name: 'All Products',
      icon: <Cpu className="w-5 h-5" />,
      color: 'bg-white text-slate-700 border-gray-200 hover:border-gray-300',
      activeColor: 'bg-slate-900 text-white border-slate-900'
    },
    {
      id: 'Laptops',
      name: 'Laptops',
      icon: <Laptop className="w-5 h-5" />,
      color: 'bg-white text-slate-700 border-gray-200 hover:border-gray-300',
      activeColor: 'bg-blue-600 text-white border-blue-600'
    },
    {
      id: 'Gaming',
      name: 'Gaming Gear',
      icon: <Gamepad2 className="w-5 h-5" />,
      color: 'bg-white text-slate-700 border-gray-200 hover:border-gray-300',
      activeColor: 'bg-slate-900 text-white border-slate-900'
    },
    {
      id: 'Tablets',
      name: 'Tablets',
      icon: <Tablet className="w-5 h-5" />,
      color: 'bg-white text-slate-700 border-gray-200 hover:border-gray-300',
      activeColor: 'bg-blue-600 text-white border-blue-600'
    },
    {
      id: 'Desktops',
      name: 'Desktops',
      icon: <HardDrive className="w-5 h-5" />,
      color: 'bg-white text-slate-700 border-gray-200 hover:border-gray-300',
      activeColor: 'bg-blue-600 text-white border-blue-600'
    },
    {
      id: 'Monitors',
      name: 'Monitors',
      icon: <Monitor className="w-5 h-5" />,
      color: 'bg-white text-slate-700 border-gray-200 hover:border-gray-300',
      activeColor: 'bg-blue-600 text-white border-blue-600'
    },
    {
      id: 'Accessories',
      name: 'Accessories',
      icon: <Keyboard className="w-5 h-5" />,
      color: 'bg-white text-slate-700 border-gray-200 hover:border-gray-300',
      activeColor: 'bg-blue-600 text-white border-blue-600'
    }
  ];

  const laptopSubs = [
    { id: 'ThinkPad', name: 'ThinkPad (Enterprise)' },
    { id: 'Yoga', name: 'Yoga (Premium 2-in-1)' },
    { id: 'IdeaPad', name: 'IdeaPad (Everyday & Student)' }
  ];

  const gamingSubs = [
    { id: 'Legion', name: 'Legion (Pro Gaming)' },
    { id: 'LOQ', name: 'LOQ (Entry Gaming)' }
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 py-6" id="category-slider">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-5">
        <div className="text-center md:text-left">
          <span className="text-[10px] font-bold uppercase text-blue-600 tracking-widest leading-none">Lenovo Official Catalog</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase mt-1">Shop By Categories</h2>
        </div>

        {/* Categories Circle Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          {categoriesList.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectSubCategory('all');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                  isSelected ? cat.activeColor : cat.color
                }`}
              >
                <span className="p-1 rounded-sm bg-black/5 flex items-center justify-center">
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Series/Sub-Category Pills */}
        {activeCategory === 'Laptops' && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 mr-2 uppercase tracking-wider">Series:</span>
            <button
              onClick={() => onSelectSubCategory('all')}
              className={`px-3 py-1 rounded-sm text-xs font-bold border transition-colors cursor-pointer ${
                activeSubCategory === 'all'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Laptops
            </button>
            {laptopSubs.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectSubCategory(sub.id)}
                className={`px-3 py-1 rounded-sm text-xs font-bold border transition-colors cursor-pointer ${
                  activeSubCategory === sub.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Series/Sub-Category Pills */}
        {activeCategory === 'Gaming' && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 mr-2 uppercase tracking-wider">Series:</span>
            <button
              onClick={() => onSelectSubCategory('all')}
              className={`px-3 py-1 rounded-sm text-xs font-bold border transition-colors cursor-pointer ${
                activeSubCategory === 'all'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Gaming Laptops
            </button>
            {gamingSubs.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectSubCategory(sub.id)}
                className={`px-3 py-1 rounded-sm text-xs font-bold border transition-colors cursor-pointer ${
                  activeSubCategory === sub.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
