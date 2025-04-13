
export const mapWeatherCondition = (weatherId: number): 'sunny' | 'rainy' | 'cloudy' => {
  // Weather condition codes from OpenWeatherMap: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 600) {
    return 'rainy'; // Thunderstorm, Drizzle, Rain, Snow
  } else if (weatherId === 800) {
    return 'sunny'; // Clear sky
  } else {
    return 'cloudy'; // Clouds, Atmosphere, etc.
  }
};

export const getFormattedTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const getWeatherIconByCondition = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    return 'sun';
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return 'cloud-rain';
  } else if (conditionLower.includes('thunder')) {
    return 'cloud-lightning';
  } else if (conditionLower.includes('snow')) {
    return 'cloud-snow';
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    return 'cloud-fog';
  } else {
    return 'cloud';
  }
};
