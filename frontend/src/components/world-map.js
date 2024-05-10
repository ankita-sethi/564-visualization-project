import React, { useEffect } from "react";
import { createWorldMap } from "../utils/worldMap";

function WorldMap({ selectedCountry, selectedYear, handleCountryChange }) {
  useEffect(() => {
    createWorldMap({
      selected_year: selectedYear,
      selectedCountry: selectedCountry,
      handleCountryChange: handleCountryChange
    });
  }, [handleCountryChange, selectedCountry, selectedYear]);

  return <svg id="world_map" width={800} height={500}></svg>;
}

export default WorldMap;
