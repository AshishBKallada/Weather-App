import React, { useEffect, useState, useCallback } from "react";
import Input from "./ui/input";
import Button from "./ui/Button";
import { SearchIcon } from "./icons/SearchIcon";
import { CloudIcon } from "./icons/CloudIcon";
import axios from "axios";
import { displayIcon } from "../Logic/IconDisplay";
import Loading from "../Loading/Loading";
import _ from "lodash";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const Component = () => {
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [searchWeatherData, setSearchWeatherData] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude, setCurrentWeatherData);
          fetchLocationName(latitude, longitude, setCurrentLocation);
        },
        (error) => {
          console.error("Error fetching location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeatherData = (latitude, longitude, setData) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching weather data: ",
          error.response ? error.response.data : error.message
        );
      });
  };

  const fetchLocationName = (latitude, longitude, setLocation) => {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;

    axios
      .get(url)
      .then((response) => {
        if (response.data && response.data.features.length > 0) {
          setLocation(response.data.features[0].properties.formatted);
        } else {
          setLocation("Unknown location");
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching location name: ",
          error.response ? error.response.data : error.message
        );
      });
  };

  const fetchSuggestions = (query) => {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${apiKey}`;

    axios
      .get(url)
      .then((response) => {
        if (response.data && response.data.features) {
          setSuggestions(response.data.features);
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching suggestions: ",
          error.response ? error.response.data : error.message
        );
      });
  };

  const debouncedFetchSuggestions = useCallback(
    _.debounce(fetchSuggestions, 300),
    []
  );

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchInput(query);

    if (query.trim()) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const { geometry } = suggestion;
    if (geometry && geometry.coordinates) {
      const [longitude, latitude] = geometry.coordinates;
      fetchWeatherData(latitude, longitude, setSearchWeatherData);
      setSearchLocation(suggestion.properties.formatted);

      setSuggestions([]);
    } else {
      console.error("Geometry or coordinates not found in suggestion.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-cover bg-center bg-gray-200">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/snowfallvd.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header className="bg-black relative bg-opacity-50 py-4 px-6 shadow">
        <div className="flex items-center">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl text-white font-bold">Weatherify</h1>
            <a
              href="https://github.com/AshishBKallada"
              className="ml-12 text-sm text-gray-300 font-cursive"
            >
              AsherCode
            </a>
          </div>
          <img
            className="h-12 w-12 ml-4 rounded-full"
            src="/bearspin.gif"
            alt="Weather Icon"
          />
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 relative md:grid-cols-2 gap-8 p-8">
        <section className="bg-black bg-opacity-50 text-white rounded-lg shadow-2xl p-6 flex flex-col items-center justify-center gap-4">
          {currentWeatherData && currentWeatherData.current ? (
            <>
              <div className="flex items-center gap-4">
                {displayIcon(currentWeatherData.current.temperature_2m)}
                <div>
                  <div className="text-4xl font-bold">
                    {currentWeatherData.current.temperature_2m}°C
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Wind Speed: {currentWeatherData.current.wind_speed_10m} km/h
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground text-center">
                {currentLocation}
              </div>
            </>
          ) : (
            <Loading />
          )}
        </section>
        <section className="bg-black bg-opacity-50 text-white rounded-lg shadow-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 w-full">
            <Input
              type="text"
              placeholder="Enter a location"
              className="flex-1 bg-muted rounded-md px-4 py-2 text-sm"
              onChange={handleInputChange}
              value={searchInput}
            />
            <Button>
              <SearchIcon className="w-5 h-5" />
            </Button>
          </div>
          {suggestions.length > 0 && (
            <ul className="bg-black bg-opacity-50 rounded-md mt-2 max-h-60 overflow-auto w-full">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.properties.place_id}
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.properties.formatted}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col items-center justify-center flex-1 mt-4">
            {searchWeatherData && searchWeatherData.current && (
              <>
                <CloudIcon className="w-12 h-12 text-blue-500" />
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {searchWeatherData.current.temperature_2m}°C
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Wind Speed: {searchWeatherData.current.wind_speed_10m} km/h
                  </div>
                </div>
                <p className="text-muted-foreground">{searchLocation}</p>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Component;
