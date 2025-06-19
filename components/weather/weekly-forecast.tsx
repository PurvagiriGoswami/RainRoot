"use client";

import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, CloudSnow, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyForecastProps {
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

export function WeeklyForecast({ forecastData, isLoading }: WeeklyForecastProps) {
  console.log('WeeklyForecast rendered with data:', forecastData);

  const getWeatherIcon = (weatherMain: string, size = 32) => {
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

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

  // Group forecast data by day and get daily averages
  const getDailyForecast = () => {
    if (!forecastData?.list) return [];

    const dailyData = new Map();
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt_txt).toDateString();
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date: item.dt_txt,
          temps: [],
          weather: item.weather[0],
          winds: [],
          humidity: [],
          precipitation: []
        });
      }
      
      const dayData = dailyData.get(date);
      dayData.temps.push(item.main.temp);
      dayData.winds.push(item.wind.speed);
      dayData.humidity.push(item.main.humidity);
      dayData.precipitation.push(item.pop);
    });

    // Convert to array and calculate averages
    return Array.from(dailyData.values()).slice(0, 5).map(day => ({
      day: getDayName(day.date),
      condition: day.weather.description,
      weatherMain: day.weather.main,
      temperature: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
      windSpeed: (day.winds.reduce((a, b) => a + b, 0) / day.winds.length).toFixed(1),
      precipitation: Math.round((day.precipitation.reduce((a, b) => a + b, 0) / day.precipitation.length) * 100),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length)
    }));
  };

  const weeklyData = getDailyForecast();

  if (isLoading) {
    return (
      <div className="weather-card">
        <Skeleton className="h-6 w-40 mb-6 bg-white/10" />
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center space-x-4 flex-1">
                <Skeleton className="h-8 w-8 rounded bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-white/10" />
                  <Skeleton className="h-3 w-20 bg-white/10" />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-12 bg-white/10" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!forecastData || weeklyData.length === 0) {
    return (
      <div className="weather-card text-center p-8">
        <p className="text-blue-200">Unable to load weekly forecast data</p>
      </div>
    );
  }

  return (
    <div className="weather-card">
      <h3 className="text-lg font-medium text-blue-200 mb-6">WEEKLY FORECAST</h3>
      
      <div className="space-y-4">
        {weeklyData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="group-hover:scale-110 transition-transform duration-200">
                {getWeatherIcon(item.weatherMain)}
              </div>
              <div>
                <p className="font-semibold text-white text-shadow">{item.day}</p>
                <p className="text-sm text-blue-300 capitalize">{item.condition}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-weather-accent" />
                <span className="text-white font-medium">{item.temperature}°C</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-blue-400" />
                <span className="text-blue-200">{item.windSpeed} m/s</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-gray-400" />
                <span className="text-blue-200">{item.precipitation}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-blue-200">{item.humidity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}