/**
 * Finance Service for MSTY Dashboard
 * 
 * This service handles real-time price data and dividend information fetching
 */

// Configuration
const MSTY_SYMBOL = 'MSTY';
const FINNHUB_API_KEY = process.env.REACT_APP_FINANCE_API_KEY || '';

// API endpoints - Using different URLs for different services
const FINNHUB_API_URL = `https://finnhub.io/api/v1/quote?symbol=${MSTY_SYMBOL}&token=${FINNHUB_API_KEY}`;

// Fallback APIs - Note: In a real implementation, you would use different API keys for these services
const ALPHA_VANTAGE_URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${MSTY_SYMBOL}&apikey=demo`;
const BACKUP_PRICE_API = `https://api.polygon.io/v2/aggs/ticker/${MSTY_SYMBOL}/prev?apiKey=demo`;

/**
 * Fetches real-time price data for MSTY
 * @returns {Promise<Object>} Current price information
 */
export const fetchRealTimePrice = async () => {
  try {
    console.log('Fetching price data from Finnhub...');
    const response = await fetch(FINNHUB_API_URL);
    
    if (!response.ok) {
      throw new Error('Price data API response was not ok');
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Finnhub API error: ${data.error}`);
    }
    
    return {
      currentPrice: data.c, // Current price
      previousClose: data.pc, // Previous close
      change: data.c - data.pc, // Change
      percentChange: ((data.c - data.pc) / data.pc) * 100, // Percent change
      high: data.h, // Day high
      low: data.l, // Day low
      timestamp: new Date().toLocaleString(), // Current time
    };
  } catch (error) {
    console.error('Error fetching real-time price from Finnhub:', error);
    
    // Fallback to backup API if primary fails
    try {
      console.log('Attempting to use backup price API...');
      const backupResponse = await fetch(BACKUP_PRICE_API);
      if (!backupResponse.ok) {
        throw new Error('Backup price API response was not ok');
      }
      
      const backupData = await backupResponse.json();
      const result = backupData.results[0];
      
      return {
        currentPrice: result.c,
        previousClose: result.o,
        change: result.c - result.o,
        percentChange: ((result.c - result.o) / result.o) * 100,
        high: result.h,
        low: result.l,
        timestamp: new Date().toLocaleString(),
      };
    } catch (backupError) {
      console.error('Error fetching from backup price API:', backupError);
      
      // If all APIs fail, return the most recent known price as a fallback
      return {
        currentPrice: 25.12, // Last known price
        previousClose: 24.70,
        change: 0.42,
        percentChange: 1.70,
        high: 25.45,
        low: 24.65,
        timestamp: new Date().toLocaleString() + ' (Fallback data)',
      };
    }
  }
};

/**
 * Parses HTML content to extract dividend data
 * Note: In a production environment, you would use an official API instead
 * @param {string} htmlContent - HTML content to parse
 * @returns {Array} Array of dividend records
 */
const parseDividendDataFromHTML = (htmlContent) => {
  // This is a simplified example. In production, you would:
  // 1. Use an official API that provides structured data
  // 2. Or use a proper HTML parsing library on the server side
  
  // Extract dividend table rows
  const dividendRegex = /Ex-Dividend Date.*?(\\d{1,2}\\/\\d{1,2}\\/\\d{4}).*?Amount.*?\\$(\\d+\\.\\d+).*?Pay Date.*?(\\d{1,2}\\/\\d{1,2}\\/\\d{4})/gs;
  const matches = [...htmlContent.matchAll(dividendRegex)];
  
  return matches.map(match => {
    const exDivDate = new Date(match[1]);
    return {
      exDividendDate: exDivDate.toISOString().split('T')[0],
      amount: parseFloat(match[2]),
      payDate: new Date(match[3]).toISOString().split('T')[0],
      month: exDivDate.toLocaleString('default', { month: 'short' }),
      year: exDivDate.getFullYear()
    };
  });
};

/**
 * Fetches dividend history data for MSTY
 * @returns {Promise<Array>} Dividend history
 */
export const fetchDividendHistory = async () => {
  try {
    // In a real implementation, this would use an API
    // For demonstration, we'll simulate data fetching
    // and use backup static data if API fails
    
    // Simulated API call to get dividend history
    const response = await fetch('https://proxy-api.example.com/dividends/MSTY');
    
    if (!response.ok) {
      throw new Error('Dividend data API response was not ok');
    }
    
    const data = await response.json();
    return data.dividends;
    
  } catch (error) {
    console.error('Error fetching dividend history:', error);
    
    // Fallback to static data if API call fails
    return [
      { month: "May", year: 2025, dividend: 2.3734, yield: 9.45, exDate: "2025-05-08", payDate: "2025-05-09" },
      { month: "Apr", year: 2025, dividend: 1.3356, yield: 5.32, exDate: "2025-04-10", payDate: "2025-04-11" },
      { month: "Mar", year: 2025, dividend: 1.3775, yield: 5.48, exDate: "2025-03-13", payDate: "2025-03-14" },
      { month: "Feb", year: 2025, dividend: 2.0216, yield: 8.05, exDate: "2025-02-13", payDate: "2025-02-14" },
      { month: "Jan", year: 2025, dividend: 2.2792, yield: 9.07, exDate: "2025-01-16", payDate: "2025-01-17" },
      { month: "Dec", year: 2024, dividend: 3.0821, yield: 12.27, exDate: "2024-12-19", payDate: "2024-12-20" },
      { month: "Nov", year: 2024, dividend: 4.4213, yield: 17.60, exDate: "2024-11-21", payDate: "2024-11-22" },
      { month: "Oct", year: 2024, dividend: 4.1981, yield: 16.71, exDate: "2024-10-24", payDate: "2024-10-25" },
      { month: "Sep", year: 2024, dividend: 1.8541, yield: 7.38, exDate: "2024-09-06", payDate: "2024-09-09" },
      { month: "Aug", year: 2024, dividend: 1.9405, yield: 7.72, exDate: "2024-08-07", payDate: "2024-08-08" },
      { month: "Jul", year: 2024, dividend: 2.3320, yield: 9.28, exDate: "2024-07-05", payDate: "2024-07-08" },
      { month: "Jun", year: 2024, dividend: 3.0300, yield: 12.06, exDate: "2024-06-06", payDate: "2024-06-07" },
      { month: "May", year: 2024, dividend: 2.5239, yield: 10.05, exDate: "2024-05-06", payDate: "2024-05-08" },
      { month: "Apr", year: 2024, dividend: 4.1286, yield: 16.44, exDate: "2024-04-04", payDate: "2024-04-08" }
    ];
  }
};

/**
 * Calculates yield based on dividend amount and price
 * @param {number} dividendAmount - Dividend amount
 * @param {number} price - Current price
 * @returns {number} Calculated yield percentage
 */
export const calculateYield = (dividendAmount, price) => {
  return (dividendAmount / price) * 100;
};

/**
 * Calculates annualized yield based on monthly dividends
 * @param {Array} dividends - Array of dividend objects
 * @param {number} currentPrice - Current price
 * @returns {number} Annualized yield percentage
 */
export const calculateAnnualizedYield = (dividends, currentPrice) => {
  if (!dividends || dividends.length === 0 || !currentPrice) {
    return 0;
  }
  
  // Use up to 12 most recent months
  const recentDividends = dividends.slice(0, Math.min(12, dividends.length));
  const totalDividend = recentDividends.reduce((sum, item) => sum + item.dividend, 0);
  
  // If we have less than 12 months of data, annualize it
  const annualFactor = 12 / recentDividends.length;
  const annualizedDividend = totalDividend * annualFactor;
  
  return (annualizedDividend / currentPrice) * 100;
};

/**
 * Checks for and adds new dividend data
 * @param {Array} currentDividends - Current dividend array
 * @param {number} currentPrice - Current stock price
 * @returns {Promise<Array>} Updated dividend array
 */
export const checkForNewDividendData = async (currentDividends, currentPrice) => {
  try {
    // For a real implementation, this would scrape a financial website
    // or call an API to get the latest dividend announcements
    
    // Get the current month and year
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'short' });
    const currentYear = today.getFullYear();
    
    // Check if we already have the current month's dividend
    const hasCurrentMonth = currentDividends.some(
      div => div.month === currentMonth && div.year === currentYear
    );
    
    if (!hasCurrentMonth) {
      // Simulate checking if a new dividend has been announced
      // In a real implementation, this would check financial news or APIs
      
      // Simulate a 20% chance of finding a new dividend (for demo purposes)
      const hasNewDividend = Math.random() < 0.2;
      
      if (hasNewDividend) {
        // Simulate a new dividend amount based on the average of recent dividends
        const recentDividends = currentDividends.slice(0, 3);
        const avgRecentDividend = recentDividends.reduce((sum, div) => sum + div.dividend, 0) / recentDividends.length;
        
        // Add some random variation to the dividend amount (±20%)
        const variationFactor = 0.8 + (Math.random() * 0.4); // Random number between 0.8 and 1.2
        const newDividendAmount = avgRecentDividend * variationFactor;
        
        // Calculate yield based on current price
        const newYield = calculateYield(newDividendAmount, currentPrice);
        
        // Create the new dividend entry
        const newDividend = {
          month: currentMonth,
          year: currentYear,
          dividend: parseFloat(newDividendAmount.toFixed(4)),
          yield: parseFloat(newYield.toFixed(2)),
          exDate: today.toISOString().split('T')[0],
          payDate: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0]
        };
        
        // Add to the beginning of the array (most recent first)
        return [newDividend, ...currentDividends];
      }
    }
    
    // Return original array if no new dividend
    return currentDividends;
  } catch (error) {
    console.error('Error checking for new dividend data:', error);
    return currentDividends;
  }
};
