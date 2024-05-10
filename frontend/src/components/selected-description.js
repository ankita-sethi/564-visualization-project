import React, { useEffect, useState } from "react";

import RadarChart from "./radar-chart";
import LineGraph from "./line-graph";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const items = [
  "clean_water_sanitation_score",
  "freedom_to_make_life_choices",
  "gdp_per_capita",
  "gender_equality_score",
  "generosity",
  "good_health_score",
  "happiness_score",
  "healthy_life_expectancy",
  "no_poverty_score",
  "perceptions_of_corruption",
  "quality_education_score",
  "social_support",
  "sustainable_index_score",
  "zero_hunger_score"
];
const SelectedDescription = ({ selectedCountry }) => {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("healthy_life_expectancy");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/country_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: [selectedCountry],
        year: []
      })
    })
      .then((response) => response.json())
      .then((data) => {
        const output = JSON.parse(JSON.stringify(data));
        setData(output.data);
      });
  }, [selectedCountry]);
  const currentData = data.filter((el) => el.year === 2023);
  return (
    currentData.length > 0 && (
      <div
        style={{
          display: "grid",
          gridTemplateRows: "30% 1fr 1fr"
        }}
      >
        <Card sx={{ maxWidth: 400, overflow: "scroll" }}>
          <CardMedia
            component="img"
            alt="flag"
            height="150"
            image={currentData[0].URL}
            style={{
              width: "auto",
              maxWidth: "100%",
              display: "block", // Align the image at the center
              margin: "auto", // Align the image at the center
              textAlign: "center"
            }}
          />
          <CardContent>
            <Accordion expanded={expanded} onChange={handleExpandClick}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography gutterBottom variant="h5" component="div">
                  {selectedCountry}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {Object.entries(currentData[0]).map(([key, value]) => {
                    if (key !== "URL" && key !== "year" && key !== "country") {
                      return (
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          key={key}
                        >
                          {`${key}: ${value}`}
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
            <FormControl
              variant="outlined"
              style={{ width: 180, marginTop: "20px" }}
            >
              <InputLabel id="dropdown-label">Select an item</InputLabel>
              <Select
                labelId="dropdown-label"
                id="dropdown"
                value={selectedItem}
                onChange={(event) => {
                  setSelectedItem(event.target.value);
                }}
                label="Select an item"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {items.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        <RadarChart data={data} selectedItem={selectedItem} />
        <LineGraph data={data} selectedItem={selectedItem} />
      </div>
    )
  );
};

export default SelectedDescription;
