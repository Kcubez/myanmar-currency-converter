# Myanmar Currency Converter

A modern web application for converting Myanmar Kyat (MMK) to other currencies like Chinese Yuan (CNY), Japanese Yen (JPY), and more.

## Features

- 🔄 **Bidirectional Conversion**: Convert from MMK to other currencies and vice versa
- 🌍 **Multiple Currencies**: Support for CNY, JPY, USD, EUR, GBP, THB, SGD, KRW
- 📊 **Live Exchange Rates**: Fetch real-time rates from API or use manual rates
- 💱 **Easy Swap**: Quick currency swap with one click
- 🎨 **Modern UI**: Beautiful interface built with TailwindCSS
- 📱 **Responsive**: Works on all devices

## Getting Started

### 1. Set up API Key (Required)

To use real-time exchange rates, you need a free API key:

1. Sign up at [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/)
2. Get your free API key (1,500 requests/month on free tier)
3. Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

4. Add your API key to `.env.local`:

```env
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=your_actual_api_key_here
```

**Note:** The app requires an API key to function. Without it, exchange rates will not load.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. Enter the amount you want to convert
2. Select the source currency (from)
3. Select the target currency (to)
4. The result will be calculated automatically
5. Click "Update Rates" to fetch the latest exchange rates from the API

## Exchange Rate API

The app uses [exchangerate-api.com](https://www.exchangerate-api.com/) for fetching live exchange rates. The free tier is sufficient for personal use.

If the API is unavailable, the app will fall back to default manual rates.

## Tech Stack

- **Framework**: Next.js 16.0.1
- **Language**: TypeScript
- **Styling**: TailwindCSS v4.1.16
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **React**: v19.0.0

## License

MIT
