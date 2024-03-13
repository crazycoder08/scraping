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
      };
      return response;
    }
  } catch (error) {
    console.error("Error while scraping:", error);
    console.error("*****************************************");
    return res.status(500).json({ message: "Internal server might be down, please try again." });
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
