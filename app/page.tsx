"use client";

import { useState, useEffect } from 'react';
import { WeatherHeader } from '@/components/weather/weather-header';
import { CurrentWeather } from '@/components/weather/current-weather';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { WeeklyForecast } from '@/components/weather/weekly-forecast';
import { WeatherInsights } from '@/components/weather/weather-insights';
import { fetchWeatherData, getCurrentLocationWeather, type WeatherData, type ForecastData } from '@/lib/weather-api';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [location, setLocation] = useState(' Surat, IN');
  const [isLoading, setIsLoading] = useState(true);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number }>({ lat: 24.4539, lon: 54.3773 });

  console.log('Home page rendered with state:', { weatherData, forecastData, location, isLoading });

  const loadWeatherData = async (lat?: number, lon?: number) => {
    setIsLoading(true);
    console.log('Loading weather data for coordinates:', lat, lon);
    
    try {
      let data;
      if (lat && lon) {
        data = await fetchWeatherData(lat, lon);
      } else {
        data = await getCurrentLocationWeather();
      }
      
      if (data) {
        const [weather, forecast] = data;
        setWeatherData(weather);
        setForecastData(forecast);
        
        // Update location display
        if (weather) {
          setLocation(`${weather.name}, ${weather.sys.country}`);
          setCurrentCoords({ lat: lat || 24.4539, lon: lon || 54.3773 });
        }
        
        console.log('Weather data loaded successfully:', { weather, forecast });
      } else {
        console.error('Failed to load weather data');
      }
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Initial weather data load');
    loadWeatherData();
  }, []);

  const handleLocationChange = (lat: number, lon: number, displayName: string) => {
    console.log('Location changed:', { lat, lon, displayName });
    setLocation(displayName);
    loadWeatherData(lat, lon);
  };

  const handleRefresh = () => {
    console.log('Refreshing weather data');
    loadWeatherData(currentCoords.lat, currentCoords.lon);
  };

  return (
    <div className="min-h-screen bg-weather-gradient">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <WeatherHeader 
          location={location}
          onLocationChange={handleLocationChange}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
        
        <main className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Weather Info */}
          <div className="xl:col-span-2 space-y-6">
            <CurrentWeather 
              weatherData={weatherData}
              isLoading={isLoading}
            />
            <HourlyForecast 
              forecastData={forecastData}
              isLoading={isLoading}
            />
          </div>
          
          {/* Right Column - Forecasts and Insights */}
          <div className="xl:col-span-1 space-y-6">
            <WeeklyForecast 
              forecastData={forecastData || undefined}
              isLoading={isLoading}
            />
            <WeatherInsights />
          </div>
        </main>
      </div>
    </div>
  );
}