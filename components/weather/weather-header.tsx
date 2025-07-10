"use client";

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Settings, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchCities, type CityData } from '@/lib/weather-api';

interface WeatherHeaderProps {
  location: string;
  onLocationChange: (lat: number, lon: number, displayName: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function WeatherHeader({ location, onLocationChange, onRefresh, isLoading }: WeatherHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityData | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  console.log('WeatherHeader rendered with location:', location);

  const handleLocationSearch = () => {
    console.log('Location search triggered');
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery('');
      setSearchResults(null);
    }
  };

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults(null);
      return;
    }

    setIsSearchLoading(true);
    console.log('Searching for cities:', query);
    
    try {
      const results = await fetchCities(query);
      setSearchResults(results);
    } catch (error) {
      console.error('City search error:', error);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchCities(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchCities]);

  const handleCitySelect = (city: any) => {
    console.log('City selected:', city);
    const displayName = `${city.name}, ${city.countryCode}`;
    onLocationChange(city.latitude, city.longitude, displayName);
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults(null);
  };

  const handleRefresh = () => {
    console.log('Weather data refresh triggered');
    onRefresh();
  };

  return (
    <header className="glass-card rounded-2xl p-4 mb-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold gradient-text text-shadow">
              Rain Root
            </h1>
            {/* <span className="text-lg font-light text-blue-200"></span> */}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-blue-200">
          <span>{new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit'
          })} {new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
          })} GMT</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex-1">
          {isSearching ? (
            <div className="flex flex-col space-y-2 flex-1 max-w-md relative" style={{ position: 'relative', zIndex: 1000 }}>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search for a city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-white/40"
                  />
                  {isSearchLoading && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-blue-200" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearching(false)}
                  className="text-blue-200 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
              
              {searchResults && searchResults.data && searchResults.data.length > 0 && typeof window !== 'undefined' && createPortal(
                <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '120px', background: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} onClick={(e) => { e.stopPropagation(); setSearchResults(null); }}>
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg max-h-[60vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  {searchResults.data.slice(0, 10).map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl text-white">
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-blue-200">{city.region}, {city.country}</div>
                    </button>
                  ))}
                    </div>
                  </div>,
                  document.body
                )}

            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-weather-accent" />
              <span className="text-xl font-medium text-white text-shadow">
                {location}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLocationSearch}
                className="h-8 w-8 p-0 hover:bg-white/10 rounded-full"
              >
                <Search className="h-4 w-4 text-blue-200" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-10 w-10 p-0 hover:bg-white/10 rounded-full group"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 text-blue-200 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 text-blue-200 group-hover:rotate-180 transition-transform duration-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-white/10 rounded-full"
          >
            <Settings className="h-4 w-4 text-blue-200" />
          </Button>
        </div>
      </div>
    </header>
  );
}
