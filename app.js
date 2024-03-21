// Import necessary modules
const express = require("express");
const main = require("./script");
const fs = require("fs");

// Create an instance of Express
const app = express();

// Define a route for the API endpoint
app.get("/api/scrape", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required." });
    }

    let profileRes = await main(url);

    if (profileRes.status == 200){
      console.log(profileRes.message);
      console.log("*****************************************");
      return res.json(profileRes);
    }else{
      console.log(profileRes.message);
      console.log("********************==*********************");
      let response = {
        status: profileRes.status,
        message: profileRes.message,
        title: profileRes.title,
      };
      return res.json(response);
    }
  } catch (error) {
    let response = {
      status: 500,
      title: "Invalid URL!",
      message: "Failed to retrieve data from the specified URL. Please verify the API URL.",
    };
    return res.json(response);
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
