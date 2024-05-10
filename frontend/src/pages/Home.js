import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import WorldMap from "../components/world-map";
import BarChart from "../components/bar-chart";
import SelectedDescription from "../components/selected-description";
import { MenuItem, OutlinedInput, Select } from "@mui/material";
import PCPPlot from "../components/pcp-plot";

const Home = () => {
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [selectedYear, setSelectedYear] = useState(2023);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
    setSelectedCountry("");
  };

  const handleCountryChange = (val) => {
    setSelectedCountry(val);
  };

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" style={{ backgroundColor: "green" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5">Visualisation- 564</Typography>
            <Typography variant="h4" textAlign="center" flex="1">
              Measuring Joy: Exploring the Link Between Sustainability and
              Happiness
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div style={{ padding: "2px" }}>
        <Select
          labelId="select-year-label"
          value={selectedYear}
          onChange={handleYearChange}
          label="Select Year"
          input={<OutlinedInput />}
          sx={{ marginLeft: "10px" }}
        >
          {[...Array(2023 - 2016 + 1)]
            .map((_, index) => 2023 - index)
            .map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
        </Select>
        {selectedYear && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr",
              padding: 5
            }}
          >
            <div style={{ display: "grid", gridTemplateRows: "40% 60%" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
                <WorldMap
                  selectedCountry={selectedCountry}
                  selectedYear={selectedYear}
                  handleCountryChange={handleCountryChange}
                />
                <BarChart
                  selectedCountry={selectedCountry}
                  selectedYear={selectedYear}
                />
              </div>
              <div>
                {selectedCountry !== "" && (
                  <PCPPlot
                    selectedCountry={selectedCountry}
                    selectedYear={selectedYear}
                  />
                )}
              </div>
            </div>
            {selectedCountry !== "" && (
              <SelectedDescription selectedCountry={selectedCountry} />
            )}
          </div>
        )}
      </div>
    </Box>
  );
};
export default Home;
