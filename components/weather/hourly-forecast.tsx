"use client";

import { Sun, Moon, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface HourlyForecastProps {
  forecastData?: {
    list: Array<{
      dt: number;
      dt_txt: string;
      main: {
        temp: number;
        feels_like: number;
        humidity: number;
      };
      weather: Array<{
        main: string;
        description: string;
        icon: string;
      }>;
      wind: { speed: number };
      pop: number;
    }>;
  } | null;
  isLoading?: boolean;
}

export function HourlyForecast({ forecastData, isLoading }: HourlyForecastProps) {
  console.log('HourlyForecast rendered with data:', forecastData);

  const getWeatherIcon = (weatherMain: string, size = 24) => {
    const iconProps = { size, className: "text-weather-accent" };
    
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  // Get next 12 hours of forecast data
  const hourlyData = forecastData?.list.slice(0, 12) || [];

  if (isLoading) {
    return (
      <div className="weather-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40 bg-white/10" />
          <Skeleton className="h-4 w-32 bg-white/10" />
        </div>
        
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex-shrink-0 bg-white/5 rounded-2xl p-4 min-w-[80px]">
                <div className="text-center space-y-3">
                  <Skeleton className="h-4 w-12 mx-auto bg-white/10" />
                  <Skeleton className="h-6 w-6 mx-auto rounded bg-white/10" />
                  <Skeleton className="h-5 w-8 mx-auto bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (!forecastData || hourlyData.length === 0) {
    return (
      <div className="weather-card mb-6 text-center p-8">
        <p className="text-blue-200">Unable to load hourly forecast data</p>
      </div>
    );
  }

  return (
    <div className="weather-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-blue-200">TODAY'S FORECAST</h3>
        <span className="text-sm text-blue-300">{hourlyData.length} hours available</span>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {hourlyData.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors duration-200 cursor-pointer group min-w-[80px]"
            >
              <div className="text-center space-y-3">
                <p className="text-sm text-blue-300 font-medium">
                  {formatTime(item.dt_txt)}
                </p>
                
                <div className="flex justify-center group-hover:scale-110 transition-transform duration-200">
                  {getWeatherIcon(item.weather[0].main)}
                </div>
                
                <p className="text-lg font-semibold text-white">
                  {Math.round(item.main.temp)}°
                </p>
                
                {item.pop > 0.1 && (
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                    <p className="text-xs text-blue-400">{Math.round(item.pop * 100)}%</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}