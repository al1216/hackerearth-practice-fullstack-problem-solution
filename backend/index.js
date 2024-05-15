const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotEnv = require("dotenv");
dotEnv.config();

//import the json data
const providersData = require("./isp-data.json");
const { STATUS_CODES } = require("http");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "The server is operational" });
});

app.get("/api/providers", (req, res) => {
  res.json(providersData.providers);
});

app.get("/api/provider/:name", (req, res) => {
  let providerName = req.params.name;
  let providerDetail = providersData.providers.find(
    (provider) => provider.name === providerName
  );

  if (providerDetail) {
    res.json(providerDetail);
  } else {
    res.status(404).send("Provider not found");
  }
});

app.get("/api/api-hits", (req, res) => {
  res.json(providersData["api-hits"]);
});

app.get("/api/increase-api-hits/:num", (req, res) => {
  let num = req.params.num;
  providersData["api-hits"] = Number(num) + Number(providersData["api-hits"]);
  res.json({ status: 200 });
});

app.get("/api/sort/:type", (req, res) => {
  let type = req.params.type;
  let sortedData;
  if (type.toLowerCase() === "price") {
    sortedData = [...providersData.providers].sort(
      (a, b) => a.lowest_price - b.lowest_price
    );
  } else {
    sortedData = [...providersData.providers].sort(
      (a, b) => a.rating - b.rating
    );
  }

  res.json(sortedData);
});

app.get("/api/search/:searchText", (req, res) => {
  let searchText = req.params.searchText;
  if (searchText === "") {
    res.json(providersData.providers);
  } else {
    const searchLower = searchText.toLowerCase();
    const filteredData = providersData.providers.filter((provider) => {
      return (
        provider.name.toLowerCase().includes(searchLower) ||
        provider.rating.toString().includes(searchLower) ||
        provider.lowest_price.toString().includes(searchLower)
      );
    });

    res.json(filteredData);
  }
});

app.listen(process.env.SERVER_PORT, (req, res) => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
