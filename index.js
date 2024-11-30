import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { uploadVideoToFacebookReels } from "./uplode.js";

// import itemRoutes from './routes/itemRoutes.js'; // Import routes

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Mongoose schema and model
const contentSchema = new mongoose.Schema({
  content_type: String,
  duration: Number,
  page_name: String,
  playback_url: String,
  public_id: String,
  secure_url: String,
  thumbnail_url: String,
});

const Content = mongoose.model("Content", contentSchema);

// Route to save reel data to MongoDB
app.post("/save-content", (req, res) => {
  const contentData = req.body;

  const newContent = new Content(contentData);
  newContent
    .save()
    .then((data) =>
      res.status(200).json({data, message: "Content data saved successfully!" })
    )
    .catch((err) =>
      res.status(500).json({ message: "Error saving content data", error: err })
    );
});

// Routes
// Default Route

// Usage Example
const plaseId = "106078429431815";
const pageId = "456940277498316";
const accessToken =
  "EAARmtJMMrPgBOZCTrAZCiDLGLDqp8ZBjjZAssmbPRZB3KjmmWnku0UE6RRaFoPCy1MCjnyFDEph2smXS8lYrUA37FKJgE2TaQULrR9HbyzZBqFdchVPyMo61avgqIfpJTuSTo9nL3IHFOuJRZChInwSurrIwBZA6RltvXhVqhglqZAh8kHaaRZAq1Bw8lrsgwMuYrdnUYXcgeKZAxpgcCj1wP78qKI8I9yDLM6d3ZCcyPQHn";
const videoUrl =
  "https://res.cloudinary.com/dr0wx32z6/video/upload/v1714792752/video/zr8tohaidjzodu1x9tsr.mp4";
const description =
  "Moments That Make You Smile – Watch Now! 🎥✨  #Reels #ReelsInspiration #TrendingNow #ViralReels #ExplorePage #ReelsDaily #ReelsOfInstagram #ShortVideos #ForYou #FYP #UKReels #USReels #AmericanLifestyle #LondonVibes #GlobalTrends #LikeCommentShare #SupportCreators #WatchNow #BoostMyReel #ReelItFeelIt #ComedyReels #LaughOutLoud #FunMoments #JokeOfTheDay #FeelGoodContent #MotivationMonday #PositiveVibesOnly #DreamBig #GoalDigger #InspireOthers #DayInTheLife #LifeInMotion #EverydayMoments #ChasingDreams #WanderlustReels #TravelDiaries #ExploreWithMe #AdventureTime";

app.get("/reel-uplode", async (req, res) => {
  // res.send('Welcome to the Normal Express Server!');

  uploadVideoToFacebookReels(pageId, accessToken, videoUrl, description)
    .then((response) => console.log("Final Response:", response))
    .catch((error) => console.error("Final Error:", error));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
