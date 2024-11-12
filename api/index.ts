import * as cheerio from "cheerio";
import express from "express";
import { type Request, type Response } from "express";

interface TrackingEvent {
  date: string;
  location: string;
  status: string;
}

interface TrackingInfo {
  tracking_number: string;
  events: TrackingEvent[];
  status: string;
}

const baseUrl = "https://www.ems.dz/track/index.php";
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

async function getTrackingInfo(
  trackingNumber: string
): Promise<TrackingInfo | null> {
  try {
    // Make request to tracking page
    const url = new URL(baseUrl);
    url.searchParams.set("icd", trackingNumber);

    const response = await fetch(url.toString(), {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    // Check if tracking number exists by looking for timeline container
    const timelineContainer = $(".cd-timeline__container");
    if (timelineContainer.length === 0) {
      return null;
    }

    // Extract tracking events
    const events: TrackingEvent[] = [];
    $(".cd-timeline__block").each((_, block) => {
      const content = $(block).find(".cd-timeline__content");
      if (content.length) {
        const event: TrackingEvent = {
          status: content.find("h2").text().trim(),
          location: content.find("p").text().trim(),
          date: content.find(".cd-timeline__date").text().trim(),
        };
        events.push(event);
      }
    });

    // Build response
    const trackingInfo: TrackingInfo = {
      tracking_number: trackingNumber,
      events: events,
      status: events.length > 0 ? events[0].status : "Unknown",
    };

    return trackingInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const app = express();
const port = process.env.PORT || 3000;

app.get("/track/:trackingNumber", async (req: Request, res: Response) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    const result = await getTrackingInfo(trackingNumber);

    if (!result) {
      res.status(404).json({
        error: "Unable to retrieve tracking information",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle 404 for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
