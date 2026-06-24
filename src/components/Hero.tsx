import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  bgColor: string;
  textColor: string;
  badge: string;
  icon: React.ReactNode;
  specs: { label: string; value: string }[];
  price: string;
  image: string;
  productId: string;
}

export default function Hero({ onSelectProduct, allProducts }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 'legion',
      title: 'Legion Pro 7 Series',
      subtitle: 'Dominator of Virtuality',
      description: 'Shatter boundaries with Intel® Core™ i9 14th Gen processors and NVIDIA® GeForce RTX™ 4080 graphics. Featuring Liquid Metal cooling and advanced AI tuning to push framerates past the absolute limit.',
      accent: 'text-cyan-400 border-cyan-400/30 bg-cyan-950/40',
      bgColor: 'bg-gradient-to-br from-[#020B14] via-[#041628] to-[#0A223B]',
      textColor: 'text-white',
      badge: 'PRO GAMING POWERHOUSE',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      specs: [
        { label: 'Processor', value: 'Core i9-14900HX' },
        { label: 'Graphics', value: 'RTX 4080 12GB' },
        { label: 'Display', value: '16" 2.5K 240Hz' }
      ],
      price: '695,000 PKR',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=90',
      productId: 'legion-pro-7-16irx9'
    },
    {
      id: 'yoga',
      title: 'Yoga Slim 7i Aura Edition',
      subtitle: 'Designed to Inspire',
      description: 'The luxury of complete freedom. Impossibly thin all-aluminum chassis engineered with the Intel® Core™ Ultra Lunar Lake AI Processor. Experience pristine colors on the 2.8K OLED PureSight touch display.',
      accent: 'text-amber-400 border-amber-400/30 bg-amber-950/40',
      bgColor: 'bg-gradient-to-br from-[#09151B] via-[#11242E] to-[#1B3542]',
      textColor: 'text-white',
      badge: 'NEXT-GEN AI ULTRABOOK',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      specs: [
        { label: 'NPU Tops', value: '47 NPU TOPS' },
        { label: 'Battery', value: 'Up to 24 Hours' },
        { label: 'Screen', value: '15.3" 2.8K OLED Touch' }
      ],
      price: '410,000 PKR',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=90&sig=8',
      productId: 'yoga-slim-7i-aura'
    },
    {
      id: 'thinkpad',
      title: 'ThinkPad X1 Carbon Gen 12',
      subtitle: 'The Executive Standard',
      description: 'The legendary masterpiece of executive durability and elite productivity. Weighing only 1.09kg, forged with aerospace-grade carbon fiber, and fully protected by ThinkShield military cryptography.',
      accent: 'text-[#E11925] border-[#E11925]/30 bg-red-950/30',
      bgColor: 'bg-gradient-to-br from-[#070708] via-[#131316] to-[#1E1F24]',
      textColor: 'text-white',
      badge: 'SECURED MIL-SPEC ENTERPRISE',
      icon: <ShieldCheck className="w-4 h-4 text-red-500" />,
      specs: [
        { label: 'Weight', value: '1.09 kg Ultra-Light' },
        { label: 'Security', value: 'ThinkShield dTPM 2.0' },
        { label: 'Processor', value: 'Core Ultra 7 NPU' }
      ],
      price: '520,000 PKR',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=90&sig=9',
      productId: 'thinkpad-x1-carbon-gen-12'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCtaClick = (productId: string) => {
    const targetProduct = allProducts.find((p) => p.id === productId);
    if (targetProduct) {
      onSelectProduct(targetProduct);
    }
  };

  const slide = slides[currentSlide];

  return (
    <section className="w-full relative overflow-hidden" id="hero-slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`w-full min-h-[460px] md:min-h-[520px] lg:min-h-[580px] ${slide.bgColor} ${slide.textColor} flex items-center relative py-12 md:py-16`}
        >
          {/* Animated Background Grids */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
            {/* Slide Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-4 text-left">
              {/* Badge */}
              <div className={`px-2.5 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${slide.accent}`}>
                {slide.icon}
                <span>{slide.badge}</span>
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col gap-1.5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg font-bold text-blue-400 tracking-tight uppercase">
                  {slide.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-xl font-medium">
                {slide.description}
              </p>

              {/* Specs Bento List */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-2">
                {slide.specs.map((spec, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-sm p-2 flex flex-col backdrop-blur-sm">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{spec.label}</span>
                    <span className="text-xs font-bold text-white truncate mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA and Pricing */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 w-full">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Starting Special Price</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">{slide.price}</span>
                </div>

                <button
                  onClick={() => handleCtaClick(slide.productId)}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm shadow-sm flex items-center gap-2 transition-all duration-300 group cursor-pointer"
                >
                  Configure & Buy
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Slide Product Image */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative max-w-sm sm:max-w-md lg:max-w-none w-full aspect-video sm:aspect-square lg:aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white ml-2">Top Rated Lenovo Laptop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Slide Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 transition-all duration-300 ${
              currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            title={`Slide ${idx + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}
