# The Weather Site Final

A modern, responsive weather web application built with Next.js and Tailwind CSS. Get real-time weather updates, hourly and weekly forecasts, and insightful weather analytics for any city worldwide.

---

## 🌦️ Features
- **Current Weather:** Real-time temperature, conditions, wind, and more
- **Hourly Forecast:** Up to 24 hours of detailed weather data
- **Weekly Forecast:** 7-day outlook for planning ahead
- **Weather Insights:** Analytics and trends for smarter decisions
- **City Search:** Fast, auto-complete city lookup
- **Responsive Design:** Works beautifully on desktop and mobile
- **Modern UI:** Built with Tailwind CSS and Shadcn UI components

---

## 🚀 Demo
<!-- If deployed, add your Netlify/Vercel link here -->
[Live Demo](#)

---

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [GeoDB Cities API](https://rapidapi.com/wirefreethought/api/geodb-cities/)

---

## 📸 Screenshots
<!-- Add screenshots to the /public directory and reference them here -->
| Home Page | Forecast | Mobile View |
|-----------|----------|-------------|
| ![Home](public/screenshots/home.png) | ![Forecast](public/screenshots/forecast.png) | ![Mobile](public/screenshots/mobile.png) |

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/PurvagiriGoswami/RsinRoot.git
cd RsinRoot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEO_API_URL=https://wft-geo-db.p.rapidapi.com/v1/geo
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_GEO_API_KEY=your_rapidapi_key
```
> **Note:** Never commit your real API keys to GitHub. Use `.env.local` (already in `.gitignore`).

### 4. Run the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🌍 Deployment

You can deploy this project easily to [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/):
1. Push your code to GitHub
2. Connect your repo on Netlify/Vercel
3. Add the same environment variables in the dashboard
4. Deploy and enjoy!

---

## 🙏 Credits
- [OpenWeatherMap](https://openweathermap.org/)
- [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📄 License
This project is licensed under the MIT License.
