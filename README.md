# EMS Tracking API

A fast and lightweight API built with Bun and TypeScript for tracking EMS (Express Mail Service) packages in Algeria.

## Features

- Track EMS packages using tracking numbers
- Returns detailed tracking information including:
  - Current status
  - Location history
  - Timestamps for each tracking event
- Error handling for invalid tracking numbers
- JSON response format

## Prerequisites

- [Bun](https://bun.sh) runtime (v1.0.0 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ems-tracking-api
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

## Running the API

Start the server:

```bash
bun run api/index.ts
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Track Package

```
GET /track/:trackingNumber
```

#### Parameters

- `trackingNumber` (required): The EMS tracking number (e.g., EY000643903DZ)

#### Response Format

Success (200):

```json
{
  "tracking_number": "EY006623903DZ",
  "events": [
    {
      "date": "2024-03-15",
      "location": "Algiers",
      "status": "Delivered"
    }
    // ... more events
  ],
  "status": "Delivered"
}
```

Not Found (404):

```json
{
  "error": "Unable to retrieve tracking information"
}
```

Server Error (500):

```json
{
  "error": "Internal server error"
}
```

## Error Handling

The API includes comprehensive error handling:

- Invalid tracking numbers return a 404 status
- Server-side errors return a 500 status
- Unknown routes return a 404 status

## Technical Details

- Built with Bun and TypeScript
- Uses Cheerio for HTML parsing
- Implements proper HTTP status codes
- Type-safe implementation with TypeScript interfaces

## Development

To modify the API:

1. The main server logic is in `api/index.ts`
2. Tracking functionality is in `api/tracking_scraper.ts`
3. Make your changes
4. Restart the server to see the changes

## Deployment

This project is configured for deployment with Vercel. Ensure you have the `vercel.json` configuration file set up correctly for your deployment needs.

## License

MIT License

## Disclaimer

This API is unofficial and not affiliated with EMS Algeria. Use it at your own risk.
