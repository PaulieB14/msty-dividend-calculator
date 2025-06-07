# MSTY Dividend Calculator Dashboard

A comprehensive React dashboard for calculating expected dividend returns from MSTY (YieldMax MSTR Option Income Strategy ETF) based on real-time price data and historical dividend information.

## 🎉 NEW: Auto-Update Features

The dashboard now includes intelligent auto-update capabilities:

- **✅ June 2025 dividend added** - No more missing dividends!
- **🔄 Auto-detection** of new dividend announcements
- **📊 Smart estimation** for missing dividends based on historical patterns
- **🎯 Pattern recognition** that understands MSTY's typical 5th-10th payout schedule
- **⚡ Force update** button for testing and manual updates

## Features

### Core Functionality
- **Real-time MSTY price data** with current price, change, and percentage change
- **Historical dividend tracking** with monthly dividend amounts and yields
- **Investment calculator** showing expected returns based on investment amount
- **Multiple dividend scenarios** (bullish, bearish, peak, minimum performance)
- **Interactive charts** displaying dividend history and projected returns
- **Dark/Light mode** theme toggle with system preference detection

### Auto-Update System
- **Intelligent dividend detection** - Automatically checks for new dividends
- **Announcement period awareness** - Understands when dividends are typically announced (5-10 days before ex-dividend date)
- **Missing dividend estimation** - Generates realistic estimates when official dividends are late
- **Status indicators** - Visual markers for estimated (📊), announced (🎉), and confirmed (✓) dividends
- **Configurable auto-update** - Can be enabled/disabled via UI toggle

### Advanced Features
- **Custom dividend scenarios** with percentage comparisons to historical average
- **Scenario builder** with preset options and custom amounts
- **Historical performance analysis** with 12-month lookback
- **Responsive design** optimized for desktop and mobile
- **Data persistence** with localStorage for user preferences

## How Auto-Update Works

### 1. **Dividend Detection Logic**
The system understands MSTY's dividend pattern:
- **Typical announcement**: 5-10 days before ex-dividend date
- **Ex-dividend dates**: Usually 5th-8th of each month
- **Payment dates**: Usually 1-2 days after ex-dividend date

### 2. **Smart Estimation**
When a dividend is missing, the system:
- Analyzes the last 6 months of dividend data
- Applies weighted averages (recent months weighted higher)
- Adds realistic variation (±30%) based on MSTY's volatility
- Generates appropriate ex-dividend and payment dates

### 3. **Status Tracking**
- **📊 Estimated**: System-generated based on historical patterns
- **🎉 Announced**: Recently announced dividends (simulated)
- **✅ Updated**: Manually updated dividends
- **✓ Confirmed**: Historical confirmed dividends

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PaulieB14/msty-dividend-calculator.git
   cd msty-dividend-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API key (optional)**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Finnhub API key
   REACT_APP_FINANCE_API_KEY=your_finnhub_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## API Configuration

### Finnhub API (Recommended)
1. Sign up for a free account at [Finnhub.io](https://finnhub.io/)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file:
   ```
   REACT_APP_FINANCE_API_KEY=your_finnhub_api_key_here
   ```

### Fallback Mode
If no API key is provided, the dashboard will:
- Use the most recent known price data
- Display a warning banner
- Continue to function with historical dividend data
- Auto-update features will still work for dividend estimation

## Usage

### Basic Calculator
1. **Enter your investment amount** in the calculator section
2. **Choose from preset amounts** ($1K, $5K, $10K, $25K, $50K) or enter custom amount
3. **View calculated results** including:
   - Number of shares you'd own
   - Expected monthly dividend income
   - Expected annual dividend income
   - Historical 12-month returns or projected annual yield

### Dividend Scenarios
1. **Enable custom scenarios** by checking "Use custom monthly dividend amount"
2. **Enter a custom dividend amount** or use preset scenarios:
   - **Bullish (+50%)**: 50% higher than historical average
   - **Bearish (-50%)**: 50% lower than historical average
   - **Peak Performance**: Based on highest historical dividend
   - **Minimum Performance**: Based on lowest historical dividend
3. **Name your scenario** for easy identification
4. **Compare projections** against historical averages

### Auto-Update Controls
- **Auto-detect toggle**: Enable/disable automatic dividend detection
- **Refresh button**: Manually refresh all data
- **Force Update button**: Force generate current month dividend (for testing)
- **Status indicators**: Monitor dividend data status in the history table

## Understanding MSTY

MSTY (YieldMax MSTR Option Income Strategy ETF) is an actively managed ETF that:
- **Generates income** through covered call options on MicroStrategy (MSTR) stock
- **Pays monthly dividends** that can vary significantly based on market conditions
- **Dividend amounts** depend on options premiums and MSTR's volatility
- **Typical payout schedule**: Ex-dividend dates around 5th-10th of each month

### Important Notes
- Dividends are **not guaranteed** and can vary dramatically month to month
- High dividend yields may come with **limited upside potential**
- Options strategies can **cap gains** during strong MSTR performance
- **Past performance** does not guarantee future results

## Technical Details

### Project Structure
```
src/
├── components/
│   ├── MSTYDividendDashboard.js    # Main dashboard component
│   └── TradingViewWidget.jsx       # Price chart widget
├── services/
│   └── financeService.js           # API calls and data processing
├── App.js                          # Main app component
└── index.js                        # App entry point
```

### Key Technologies
- **React 18** with hooks for state management
- **Recharts** for interactive data visualization
- **Tailwind CSS** for responsive styling
- **TradingView** for advanced price charting
- **Finnhub API** for real-time price data

### Auto-Update Implementation
The auto-update system uses several key functions:

- `checkForNewDividendData()`: Main detection logic
- `generateExpectedDividend()`: Creates realistic estimates
- `getExpectedPayoutDates()`: Calculates typical payout dates
- `forceUpdateCurrentMonth()`: Manual update for testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow React best practices and hooks patterns
2. Maintain responsive design principles
3. Add appropriate error handling
4. Include comments for complex logic
5. Test auto-update features thoroughly

## Disclaimer

**⚠️ Important Investment Disclaimer**

This dashboard is for **informational purposes only** and should not be considered as financial advice. Key points to remember:

- **Historical performance** does not guarantee future results
- **MSTY dividends** can vary significantly month to month
- **Options strategies** may limit upside potential during strong market performance
- **High yields** often come with increased risk and volatility
- **Always consult** with a qualified financial advisor before making investment decisions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. **Check the GitHub Issues** for existing solutions
2. **Create a new issue** with detailed information about the problem
3. **Include screenshots** if applicable
4. **Specify your environment** (OS, browser, Node.js version)

## Changelog

### Version 2.0.0 (June 2025)
- ✅ **Added June 2025 dividend** - No more missing dividends!
- 🔄 **Auto-update system** with intelligent dividend detection
- 📊 **Smart estimation** for missing dividends
- 🎯 **Pattern recognition** for MSTY's payout schedule
- ⚡ **Force update** functionality for testing
- 🎨 **Enhanced UI** with status indicators
- 💾 **Improved data persistence** with localStorage

### Version 1.0.0 (Previous)
- 📈 **Real-time price tracking** with Finnhub API integration
- 💰 **Investment calculator** with multiple scenarios
- 📊 **Interactive charts** for dividend history and projections
- 🌙 **Dark/Light mode** with system preference detection
- 📱 **Responsive design** for all devices
- 🔧 **Custom dividend scenarios** with preset options

---

**Made with ❤️ for MSTY investors**

*Remember: This tool is for educational and informational purposes only. Always do your own research and consult with financial professionals before making investment decisions.*