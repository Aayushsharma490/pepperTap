'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Heart, User, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  images: string;
  stock: number;
  rating: number;
  reviewCount: number;
}

import { useSearchStore } from '@/store/searchStore';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearchStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (category: string) => {
    let filtered = products.filter((p) => p.category === category);
    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    return filtered;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 relative">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-400/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] animate-float delay-1000" />

        <div className="text-center mb-16 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
          >
            Fresh Groceries, <br />
            <span className="text-gradient">Delivered Fast.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto font-medium"
          >
            Empowering local kirana shops with a elite, premium delivery experience.
            Supporting your neighborhood, one order at a time.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="GROCERY" className="w-full relative z-10">
          <TabsList className="flex w-fit mx-auto bg-white/50 backdrop-blur-xl border-none p-2 rounded-3xl mb-12 shadow-2xl">
            <TabsTrigger value="GROCERY" className="px-8 h-12 rounded-2xl data-[state=active]:gradient-primary data-[state=active]:shadow-lg font-bold">🛒 Grocery</TabsTrigger>
            <TabsTrigger value="VEGETABLES" className="px-8 h-12 rounded-2xl data-[state=active]:gradient-primary data-[state=active]:shadow-lg font-bold">🥬 Vegetables</TabsTrigger>
            <TabsTrigger value="RESTAURANT" className="px-8 h-12 rounded-2xl data-[state=active]:gradient-primary data-[state=active]:shadow-lg font-bold">🍔 Food</TabsTrigger>
          </TabsList>

          <TabsContent value="GROCERY" className="mt-8">
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-80 bg-muted/20 animate-pulse rounded-3xl" />
                ))
              ) : (
                filterProducts('GROCERY').map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="VEGETABLES" className="mt-8">
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-80 bg-muted/20 animate-pulse rounded-3xl" />
                ))
              ) : (
                filterProducts('VEGETABLES').map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="RESTAURANT" className="mt-8">
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-80 bg-muted/20 animate-pulse rounded-3xl" />
                ))
              ) : (
                filterProducts('RESTAURANT').map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="font-semibold mb-2">Peppertap - Empowering Local Businesses</p>
            <p className="text-sm">Supporting kirana shops to compete with big players</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
