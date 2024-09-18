"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Prayer from "@/components/prayer";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [Cities, setCities] = useState({
    istanbul: {
      city: "Istanbul",
      country: "Turkey",
      display: "اسطنبول",
    },
    riyadh: {
      city: "Riyadh",
      country: "Saudi Arabia",
      display: "الرياض",
    },
  });

  const [selectedCity, setSelectedCity] = useState(Cities.istanbul);
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: "",
    dhuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
  });
  const [isLoading, setIsLoading] = useState(true); // Start with loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://api.aladhan.com/v1/timingsByCity?city=${selectedCity.city}&country=${selectedCity.country}`
        );
        const data = await response.json();

        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data.timings;
        setPrayerTimes({
          fajr: Fajr,
          dhuhr: Dhuhr,
          asr: Asr,
          maghrib: Maghrib,
          isha: Isha,
        });
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Fetch data immediately on component mount
  }, [selectedCity]); // Dependency array ensures the effect runs when selectedCity changes

  const handleCityChange = (selectedValue) => {
    setSelectedCity(Cities[selectedValue]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <h1 className=" md:text-5xl lg:text-6xl text-3xl">
        مواقيت الصلاة في مدينة {selectedCity.display}
      </h1>
      {
        <div className=" flex items-center justify-center h-1/2 flex-row gap-8">
          <Prayer name="العشاء" time={prayerTimes.isha} />
          <Prayer name="المغرب" time={prayerTimes.maghrib} />
          <Prayer name="العصر" time={prayerTimes.asr} />
          <Prayer name="الظهر" time={prayerTimes.dhuhr} />
          <Prayer name="الفجر" time={prayerTimes.fajr} />
        </div>
      }

      <Select
        value={Object.keys(Cities).find((key) => Cities[key] === selectedCity)}
        onValueChange={handleCityChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="اختر المدينة" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(Cities).map(([key, city]) => (
            <SelectItem key={key} value={key}>
              {city.display}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? (
          <MdOutlineDarkMode size={35} />
        ) : (
          <MdOutlineLightMode size={35} />
        )}
      </button>
    </main>
  );
}
