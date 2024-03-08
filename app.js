// Import necessary modules
const express = require("express");
const main = require("./script");

// Create an instance of Express
const app = express();

// Define a route for the API endpoint
app.get("/api/scrape", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required." });
    }

    await main(url);
    res.json({ message: "Scraping is done!" });
  } catch (error) {
    console.error("Error while scraping:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
