
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategoriesList from '@/components/CategoriesList';
import CuratedCollections from '@/components/home/CuratedCollections';
import NewBrandSpotlights from '@/components/home/NewBrandSpotlights';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function Discover() {
  const navigate = useNavigate();
  
  const handleCategorySelect = (category: string) => {
    navigate('/', { state: { selectedCategory: category } });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 text-center">
            <Compass className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Discover Businesses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections, discover new brand spotlights, and browse by categories to find the perfect businesses for your needs.
            </p>
          </div>
        </section>
        
        {/* Categories Section */}
        <CategoriesList onCategorySelect={handleCategorySelect} />
        
        {/* Curated Collections */}
        <CuratedCollections />
        
        {/* New Brand Spotlights */}
        <NewBrandSpotlights />
        
      </main>
    </div>
  );
}

export default Discover;
