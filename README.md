# MSTY Dividend Calculator

An interactive dashboard to calculate expected returns from MSTY ETF based on historical dividends and real-time price data.

## Features

- **Real-time Price Data**: Displays current MSTY price, change, and percent change
- **Auto-refreshing Data**: Automatically updates price and dividend data every 5 minutes
- **Dividend History**: Track historical dividend payments and yields
- **Interactive Calculator**: Input any investment amount to see projected returns
- **Visualization**: Interactive charts showing dividend history and expected returns
- **Responsive Design**: Works on desktop and mobile devices
- **Automatic Monthly Updates**: Automatically detects and adds new monthly dividend data when available

## Live Demo

[View the Live MSTY Dividend Calculator](https://github.com/PaulieB14/msty-dividend-calculator) (Coming soon)

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- NPM or Yarn
- Financial API key (see API Keys section below)

### Installation

1. Clone this repository
```bash
git clone https://github.com/PaulieB14/msty-dividend-calculator.git
cd msty-dividend-calculator
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your API key (see API Keys section)
```
REACT_APP_FINANCE_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Keys

This dashboard uses financial APIs to fetch real-time price data. You'll need to obtain an API key from one of the following services:

- [Finnhub](https://finnhub.io/) (Free tier available)
- [Alpha Vantage](https://www.alphavantage.co/) (Free tier available)
- [Polygon.io](https://polygon.io/) (Free tier available)

After obtaining an API key, add it to your `.env` file as described in the installation section.

## How It Works

### Real-time Price Updates
The dashboard fetches the latest MSTY price data from financial APIs. If the primary API fails, it will automatically attempt to use backup APIs.

### Dividend Data Processing
Dividend data is initially loaded from historical records and then periodically checked for updates. The system automatically detects when new monthly dividends are announced and adds them to the dashboard.

### Calculation Methodology
- **Expected Monthly Income**: Based on the average monthly dividend over the available data period
- **Annual Yield**: Calculated using the most recent 12 months of dividend data
- **Historical Return**: Shows what you would have earned if you had invested the specified amount over the past 12 months

## Customization

### Changing the Refresh Interval
By default, data refreshes every 5 minutes. You can modify this in the `MSTYDividendDashboard.js` file:

```javascript
// Set up periodic refresh (value in milliseconds)
const refreshInterval = setInterval(() => {
  setRefreshCounter(prev => prev + 1);
}, 300000); // 300000 ms = 5 minutes
```

### Adding More Information
You can easily extend the dashboard to include additional information by modifying the `financeService.js` file to fetch more data and updating the UI components in `MSTYDividendDashboard.js`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This dashboard is for informational purposes only. Historical dividend payments may not be indicative of future returns. MSTY dividends can vary significantly month to month based on the fund's strategy of selling options on MicroStrategy (MSTR). The YieldMax MSTR Option Income Strategy ETF (MSTY) is an actively managed ETF that uses options strategies which may limit upside potential. Please consult with a financial advisor before making investment decisions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
