const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = '7fe985aa1303e3510cfb3b96c69a263e';

const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '4f0dcce84bmshac9e329bd55fd14p17ec6fjsnff18c2e61917',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};

export interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    //humidity: number;
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
}

export interface ForecastData {
  list: Array<{
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
      //humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: { speed: number };
    pop: number; // Probability of precipitation
  }>;
}

export interface CityData {
  data: Array<{
    id: number;
    name: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    region: string;
  }>;
}

export async function fetchWeatherData(lat: number, lon: number): Promise<[WeatherData, ForecastData] | null> {
  console.log('Fetching weather data for coordinates:', { lat, lon });
  
  try {
    const [weatherPromise, forecastPromise] = await Promise.all([
      fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`),
      fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`)
    ]);

    if (!weatherPromise.ok || !forecastPromise.ok) {
      console.error('Weather API request failed');
      return null;
    }

    const weatherResponse = await weatherPromise.json();
    const forecastResponse = await forecastPromise.json();
    
    console.log('Weather data fetched successfully:', { weatherResponse, forecastResponse });
    return [weatherResponse, forecastResponse];
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export async function fetchCities(input: string): Promise<CityData | null> {
  console.log('Searching cities for input:', input);
  
  if (!input || input.length < 2) {
    return null;
  }
  
  try {
    const response = await fetch(
      `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${input}`,
      GEO_API_OPTIONS
    );

    if (!response.ok) {
      console.error('Cities API request failed');
      return null;
    }

    const data = await response.json();
    console.log('Cities data fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return null;
  }
}

export async function getCurrentLocationWeather(): Promise<[WeatherData, ForecastData] | null> {
  console.log('Getting current location weather');
  
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      // Fallback to Abu Dhabi coordinates
      fetchWeatherData(21.1702, 72.8311).then(resolve);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location coordinates:', { latitude, longitude });
        const data = await fetchWeatherData(latitude, longitude);
        resolve(data);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to Abu Dhabi coordinates
        fetchWeatherData(21.1702, 72.8311).then(resolve);
      }
    );
  });
}