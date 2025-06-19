"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon, Cloud, CloudRain, Wind, Droplets, Eye, Thermometer, CloudSnow, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CurrentWeatherProps {
  weatherData?: {
    name: string;
    sys: { country: string };
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: { speed: number };
    visibility: number;
    clouds: { all: number };
  } | null;
  isLoading?: boolean;
}

export function CurrentWeather({ weatherData, isLoading }: CurrentWeatherProps) {
  const [animatedTemp, setAnimatedTemp] = useState(0);

  console.log('CurrentWeather rendered with data:', weatherData);

  useEffect(() => {
    if (weatherData) {
      const timer = setTimeout(() => {
        setAnimatedTemp(Math.round(weatherData.main.temp));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [weatherData]);

  const getWeatherIcon = (weatherMain: string, description: string, size = 64) => {
    console.log('Getting weather icon for:', { weatherMain, description });
    const iconProps = { size, className: "text-weather-accent floating-element" };
    
    switch (weatherMain) {
      case 'Clear':
        return <Sun {...iconProps} />;
      case 'Clouds':
        return <Cloud {...iconProps} />;
      case 'Rain':
        return <CloudRain {...iconProps} />;
      case 'Snow':
        return <CloudSnow {...iconProps} />;
      case 'Thunderstorm':
        return <Zap {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  const formatDate = () => {
    const today = new Date();
    return `Today ${today.getDate()} ${today.toLocaleDateString('en-US', { month: 'short' })}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="weather-card col-span-1 lg:col-span-2 xl:col-span-1">
          <div className="text-center space-y-4">
            <Skeleton className="h-6 w-40 mx-auto bg-white/10" />
            <Skeleton className="h-20 w-20 mx-auto rounded-full bg-white/10" />
            <Skeleton className="h-16 w-32 mx-auto bg-white/10" />
            <Skeleton className="h-4 w-24 mx-auto bg-white/10" />
            <Skeleton className="h-8 w-48 mx-auto bg-white/10" />
          </div>
        </div>
        <div className="weather-card">
          <Skeleton className="h-6 w-32 mb-6 bg-white/10" />
          <div className="grid grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-xl bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-white/10" />
                  <Skeleton className="h-6 w-12 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-card text-center p-8">
        <p className="text-blue-200">Unable to load weather data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Main Current Weather Card */}
      <div className="weather-card col-span-1 lg:col-span-2 xl:col-span-1">
        <div className="text-center">
          <h2 className="text-lg font-medium text-blue-200 mb-2">CURRENT WEATHER</h2>
          
          <div className="flex items-center justify-center mb-4">
            {getWeatherIcon(weatherData.weather[0].main, weatherData.weather[0].description, 80)}
          </div>
          
          <div className="mb-4">
            <div className="text-6xl font-bold text-white text-shadow-lg mb-2">
              <span className="animate-count-up">
                {animatedTemp}°C
              </span>
            </div>
            <p className="text-xl text-blue-200 capitalize">{weatherData.weather[0].description}</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-white text-shadow mb-1">
              {weatherData.name.toUpperCase()}, {weatherData.sys.country}
            </p>
            <p className="text-blue-300">{formatDate()}</p>
          </div>
        </div>
      </div>

      {/* Air Conditions Card */}
      <div className="weather-card">
        <h3 className="text-lg font-medium text-blue-200 mb-6">AIR CONDITIONS</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Thermometer className="h-5 w-5 text-weather-accent" />
            </div>
            <div>
              <p className="text-sm text-blue-300">Real Feel</p>
              <p className="text-xl font-semibold text-white">{Math.round(weatherData.main.feels_like)}°C</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Wind className="h-5 w-5 text-weather-accent" />
            </div>
            <div>
              <p className="text-sm text-blue-300">Wind</p>
              <p className="text-xl font-semibold text-white">{weatherData.wind.speed.toFixed(1)} m/s</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Cloud className="h-5 w-5 text-weather-accent" />
            </div>
            <div>
              <p className="text-sm text-blue-300">Clouds</p>
              <p className="text-xl font-semibold text-white">{weatherData.clouds.all}%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Droplets className="h-5 w-5 text-weather-accent" />
            </div>
            <div>
              <p className="text-sm text-blue-300">Humidity</p>
              <p className="text-xl font-semibold text-white">{weatherData.main.humidity}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}