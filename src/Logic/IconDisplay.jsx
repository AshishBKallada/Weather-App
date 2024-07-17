import { CloudIcon } from "../Components/icons/CloudIcon";
import { CloudRainIcon } from "../Components/icons/Rainy";
import { SunIcon } from "../Components/icons/SunIcon";
import { SnowIcon } from "../Components/icons/SnowIcon";


export function displayIcon(celsius) {
  if (celsius > 30) {
    return <SunIcon className="w-12 h-12 text-yellow-500" />;
  } else if (celsius > 20) {
    return <CloudIcon className="w-12 h-12 text-blue-500" />;
  } else if (celsius > 10) {
    return <CloudRainIcon className="w-12 h-12 text-gray-500" />;
  } else {
    return <SnowIcon className="w-12 h-12 text-blue-500" />;
  }
}
