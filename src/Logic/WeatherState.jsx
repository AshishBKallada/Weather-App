export const getWeatherCondition = (weathercode) => {
    if (weathercode === 0) return "Sunny";
    if (weathercode === 1 || weathercode === 2) return "Partly Cloudy";
    if (weathercode === 3 || weathercode === 4) return "Cloudy";
    if (weathercode >= 5 && weathercode <= 8) return "Rainy";
    if (weathercode >= 9 && weathercode <= 11) return "Stormy";
  
    return "Unknown Weather Condition";
  };
  