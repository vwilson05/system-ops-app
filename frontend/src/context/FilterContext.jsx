import React, { createContext, useState, useContext, useEffect } from "react";
import { getRegions, getLocations } from "../api/api"; // Ensure these functions exist

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [regions, setRegions] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch Regions and set them directly
    getRegions()
      .then((data) => {
        setRegions(data);
        console.log("Fetched Regions:", data);
      })
      .catch((err) => console.error("Error fetching regions:", err));

    // Fetch Locations and set them directly
    getLocations()
      .then((data) => {
        setLocations(data);
        console.log("Fetched Locations:", data);
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  return (
    <FilterContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        selectedLocation,
        setSelectedLocation,
        regions,
        locations,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
