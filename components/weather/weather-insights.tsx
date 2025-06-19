"use client";

import { TrendingUp, TrendingDown, AlertTriangle, Sun, Umbrella } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WeatherInsight {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  value?: number;
  maxValue?: number;
  icon: React.ReactNode;
}

export function WeatherInsights() {
  console.log('WeatherInsights component rendered');

  const insights: WeatherInsight[] = [
    {
      type: 'warning',
      title: 'UV Index High',
      description: 'Use sun protection between 10 AM - 4 PM',
      value: 8,
      maxValue: 10,
      icon: <Sun className="h-5 w-5" />
    },
    {
      type: 'info',
      title: 'Air Quality',
      description: 'Good air quality today',
      value: 85,
      maxValue: 100,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      type: 'success',
      title: 'Perfect Beach Day',
      description: 'Ideal conditions for outdoor activities',
      icon: <Sun className="h-5 w-5" />
    },
    {
      type: 'info',
      title: 'Sunset Time',
      description: 'Beautiful sunset expected at 7:24 PM',
      icon: <TrendingDown className="h-5 w-5" />
    }
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-weather-accent border-weather-accent/30 bg-orange-500/10';
      case 'success':
        return 'text-green-400 border-green-400/30 bg-green-500/10';
      default:
        return 'text-blue-400 border-blue-400/30 bg-blue-500/10';
    }
  };

  return (
    <div className="weather-card">
      <h3 className="text-lg font-medium text-blue-200 mb-6">WEATHER INSIGHTS</h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-start space-x-4 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] ${getInsightColor(insight.type)}`}
          >
            <div className={`p-2 rounded-lg ${getInsightColor(insight.type).replace('text-', 'bg-').replace('/10', '/20')}`}>
              {insight.icon}
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
              <p className="text-sm text-blue-200 mb-2">{insight.description}</p>
              
              {insight.value && insight.maxValue && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-300">Progress</span>
                    <span className="text-white font-medium">
                      {insight.value}/{insight.maxValue}
                    </span>
                  </div>
                  <Progress 
                    value={(insight.value / insight.maxValue) * 100} 
                    className="h-2 bg-white/10"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}