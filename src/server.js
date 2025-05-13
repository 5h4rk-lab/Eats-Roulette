import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const YELP_API_KEY = "YOUR_YELP_API_KEY";

app.get("/yelp", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const result = await axios.get("https://api.yelp.com/v3/businesses/search", {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
      params: {
        latitude: lat,
        longitude: lon,
        categories: "restaurants",
        radius: 5000,
        limit: 50,
      },
    });

    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));