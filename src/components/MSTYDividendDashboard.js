import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  fetchRealTimePrice, 
  fetchDividendHistory,
  calculateAnnualizedYield,
  checkForNewDividendData
} from '../services/financeService';

const MSTYDividendDashboard = () => {
  // State for price, dividend data, and loading status
  const [priceData, setPriceData] = useState({
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    percentChange: 0,
    timestamp: ''
  });
  const [dividendHistory, setDividendHistory] = useState([]);
  const [averageMonthlyDividend, setAverageMonthlyDividend] = useState(0);
  const [annualYield, setAnnualYield] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [refreshCounter, setRefreshCounter] = useState(0);

  // State for user input
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [customDividendAmount, setCustomDividendAmount] = useState('');
  const [useCustomDividend, setUseCustomDividend] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [calculatedResults, setCalculatedResults] = useState(null);
  
  // Function to load all data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch real-time price data
      const price = await fetchRealTimePrice();
      setPriceData(price);
      
      // Fetch dividend history
      let dividends = await fetchDividendHistory();
      
      // Check for new dividend data
      dividends = await checkForNewDividendData(dividends, price.currentPrice);
      
      // Sort by date (newest first)
      dividends.sort((a, b) => {
        const dateA = new Date(b.year, getMonthNumber(b.month));
        const dateB = new Date(a.year, getMonthNumber(a.month));
        return dateA - dateB;
      });
      
      setDividendHistory(dividends);
      
      // Calculate average monthly dividend
      const totalDividends = dividends.reduce((sum, item) => sum + item.dividend, 0);
      const avgDividend = totalDividends / dividends.length;
      setAverageMonthlyDividend(avgDividend);
      
      // Calculate annualized yield
      const yield12Month = calculateAnnualizedYield(dividends, price.currentPrice);
      setAnnualYield(yield12Month);
      
      // Update last updated timestamp
      setLastUpdated(new Date().toLocaleString());
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(`Failed to load data: ${err.message || 'Unknown error'}. Please check your API key configuration.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to convert month name to number
  const getMonthNumber = (monthName) => {
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return months[monthName] || 0;
  };

  // Initial data load
  useEffect(() => {
    loadData();
    
    // Set up periodic refresh every 5 minutes (300000 ms)
    const refreshInterval = setInterval(() => {
      setRefreshCounter(prev => prev + 1);
    }, 300000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Refresh data when refresh counter changes
  useEffect(() => {
    if (refreshCounter > 0) {
      loadData();
    }
  }, [refreshCounter]);

  // Function to calculate returns
  const calculateReturns = (amount) => {
    if (!priceData.currentPrice || priceData.currentPrice === 0) {
      return null;
    }
    
    const sharesOwned = amount / priceData.currentPrice;
    
    // Determine which dividend amount to use based on user selection
    const effectiveDividendAmount = useCustomDividend && customDividendAmount 
      ? parseFloat(customDividendAmount) 
      : averageMonthlyDividend;
    
    // Expected monthly dividend based on selected amount
    const expectedMonthlyDividend = effectiveDividendAmount * sharesOwned;
    
    // Expected annual dividend
    const expectedAnnualDividend = expectedMonthlyDividend * 12;
    
    // Calculate annualized yield based on custom or average dividend
    const effectiveAnnualYield = (effectiveDividendAmount * 12 / priceData.currentPrice) * 100;
    
    // Calculate historical returns if invested one year ago
    // Use up to 12 most recent months
    const lastYearDividends = dividendHistory.slice(0, Math.min(12, dividendHistory.length));
    const historicalDividendTotal = lastYearDividends.reduce((sum, item) => sum + item.dividend, 0);
    const historicalReturn = historicalDividendTotal * sharesOwned;
    
    // Calculate historical monthly returns
    const monthlyReturns = dividendHistory.map(item => ({
      label: `${item.month} ${item.year}`,
      dividend: item.dividend,
      return: (item.dividend * sharesOwned).toFixed(2)
    }));
    
    // For scenarios with custom dividend, create projected returns for next 12 months
    let projectedReturns = [];
    if (useCustomDividend && customDividendAmount) {
      const today = new Date();
      for (let i = 0; i < 12; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        projectedReturns.push({
          label: `${futureDate.toLocaleString('default', { month: 'short' })} ${futureDate.getFullYear()}`,
          dividend: parseFloat(customDividendAmount),
          return: (parseFloat(customDividendAmount) * sharesOwned).toFixed(2),
          isProjected: true
        });
      }
    }
    
    return {
      sharesOwned: sharesOwned.toFixed(2),
      expectedMonthlyDividend: expectedMonthlyDividend.toFixed(2),
      expectedAnnualDividend: expectedAnnualDividend.toFixed(2),
      expectedAnnualYieldPercentage: effectiveAnnualYield.toFixed(2),
      historicalReturn: historicalReturn.toFixed(2),
      monthlyReturns,
      projectedReturns,
      isCustomScenario: useCustomDividend && customDividendAmount ? true : false,
      scenarioName: scenarioName || (useCustomDividend ? 'Custom Scenario' : 'Historical Average')
    };
  };

  // Calculate results when investment amount or price/dividend data changes
  useEffect(() => {
    if (!loading && !error) {
      setCalculatedResults(calculateReturns(investmentAmount));
    }
  }, [investmentAmount, priceData, dividendHistory, averageMonthlyDividend, annualYield, loading, error, useCustomDividend, customDividendAmount, scenarioName]);

  // Handle input change
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setInvestmentAmount(value);
    }
  };

  // Handle custom dividend amount change
  const handleCustomDividendChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setCustomDividendAmount(value);
    }
  };

  // Handle checkbox change for using custom dividend
  const handleUseCustomDividendChange = (e) => {
    setUseCustomDividend(e.target.checked);
  };

  // Handle scenario name change
  const handleScenarioNameChange = (e) => {
    setScenarioName(e.target.value);
  };

  // Apply preset dividend scenarios
  const applyPresetScenario = (type) => {
    switch(type) {
      case 'bullish':
        // Bullish scenario - 50% higher than average
        const bullishAmount = (averageMonthlyDividend * 1.5).toFixed(4);
        setCustomDividendAmount(bullishAmount);
        setScenarioName('Bullish Scenario (+50%)');
        setUseCustomDividend(true);
        break;
      case 'bearish':
        // Bearish scenario - 50% lower than average
        const bearishAmount = (averageMonthlyDividend * 0.5).toFixed(4);
        setCustomDividendAmount(bearishAmount);
        setScenarioName('Bearish Scenario (-50%)');
        setUseCustomDividend(true);
        break;
      case 'highest':
        // Use highest historical dividend
        const highestDividend = Math.max(...dividendHistory.map(item => item.dividend));
        setCustomDividendAmount(highestDividend.toFixed(4));
        setScenarioName('Peak Performance');
        setUseCustomDividend(true);
        break;
      case 'lowest':
        // Use lowest historical dividend
        const lowestDividend = Math.min(...dividendHistory.map(item => item.dividend));
        setCustomDividendAmount(lowestDividend.toFixed(4));
        setScenarioName('Minimum Performance');
        setUseCustomDividend(true);
        break;
      case 'reset':
        // Reset to historical average
        setUseCustomDividend(false);
        setCustomDividendAmount('');
        setScenarioName('');
        break;
      default:
        break;
    }
  };

  // Function to handle preset amount buttons
  const handlePresetAmount = (amount) => {
    setInvestmentAmount(amount);
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    loadData();
  };

  // Format chart data
  const chartData = dividendHistory.map(item => ({
    ...item,
    label: `${item.month} ${item.year}`
  }));

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">MSTY Dividend Calculator Dashboard</h1>
        <p className="text-gray-600">Calculate expected returns from MSTY based on real-time data</p>
        
        {/* Refresh status and button */}
        <div className="mt-3 flex justify-center items-center space-x-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated || 'Never'}
          </span>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 flex items-center"
          >
            <svg 
              className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
      
      {/* Environment variable check notice */}
      {!process.env.REACT_APP_FINANCE_API_KEY && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
          <p className="font-bold">API Key Not Found</p>
          <p>Finnhub API key environment variable (REACT_APP_FINANCE_API_KEY) is not configured. The dashboard will use fallback data.</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Loading state */}
      {loading && !error && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Loading latest data...</p>
        </div>
      )}
      
      {/* Main content (shown when not loading and no error) */}
      {!loading && !error && (
        <>
          {/* Key stats section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <h2 className="text-lg font-semibold text-gray-700">Current Price</h2>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-blue-700">${priceData.currentPrice.toFixed(2)}</p>
                <span className={`ml-2 text-sm ${priceData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceData.change >= 0 ? '+' : ''}{priceData.change.toFixed(2)} ({priceData.percentChange.toFixed(2)}%)
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">As of {priceData.timestamp}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <h2 className="text-lg font-semibold text-gray-700">Avg Monthly Dividend</h2>
              <p className="text-3xl font-bold text-green-700">${averageMonthlyDividend.toFixed(4)}</p>
              <p className="text-gray-500 text-xs mt-1">Per share</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
              <h2 className="text-lg font-semibold text-gray-700">Annual Yield</h2>
              <p className="text-3xl font-bold text-purple-700">{annualYield.toFixed(2)}%</p>
              <p className="text-gray-500 text-xs mt-1">Based on current price</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
              <h2 className="text-lg font-semibold text-gray-700">Latest Dividend</h2>
              <p className="text-3xl font-bold text-amber-700">
                ${dividendHistory.length > 0 ? dividendHistory[0].dividend.toFixed(4) : '0.00'}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {dividendHistory.length > 0 
                  ? `${dividendHistory[0].month} ${dividendHistory[0].year} (${dividendHistory[0].yield.toFixed(2)}%)`
                  : 'No data available'}
              </p>
            </div>
          </div>
          
          {/* Calculator section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dividend Calculator</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Investment Amount ($)</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={handleAmountChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                min="1"
              />
              
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => handlePresetAmount(1000)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">$1,000</button>
                <button onClick={() => handlePresetAmount(5000)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">$5,000</button>
                <button onClick={() => handlePresetAmount(10000)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">$10,000</button>
                <button onClick={() => handlePresetAmount(25000)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">$25,000</button>
                <button onClick={() => handlePresetAmount(50000)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">$50,000</button>
              </div>
            </div>
            
            {/* Custom dividend scenario section */}
            <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Dividend Scenario Builder</h3>
              
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="useCustomDividend"
                    checked={useCustomDividend}
                    onChange={handleUseCustomDividendChange}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="useCustomDividend" className="text-gray-700 font-medium">
                    Use custom monthly dividend amount
                  </label>
                </div>
                
                {useCustomDividend && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Custom Monthly Dividend ($)</label>
                      <input
                        type="number"
                        value={customDividendAmount}
                        onChange={handleCustomDividendChange}
                        step="0.0001"
                        min="0"
                        placeholder={`Average: ${averageMonthlyDividend.toFixed(4)}`}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Scenario Name (Optional)</label>
                      <input
                        type="text"
                        value={scenarioName}
                        onChange={handleScenarioNameChange}
                        placeholder="e.g., Bull Market, Bear Market"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => applyPresetScenario('bullish')} 
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
                >
                  Bullish (+50%)
                </button>
                <button 
                  onClick={() => applyPresetScenario('bearish')} 
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
                >
                  Bearish (-50%)
                </button>
                <button 
                  onClick={() => applyPresetScenario('highest')} 
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200"
                >
                  Peak Performance
                </button>
                <button 
                  onClick={() => applyPresetScenario('lowest')} 
                  className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md hover:bg-amber-200"
                >
                  Minimum Performance
                </button>
                <button 
                  onClick={() => applyPresetScenario('reset')} 
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200"
                >
                  Reset to Average
                </button>
              </div>
            </div>
            
            {calculatedResults && (
              <>
                {/* Scenario banner if using custom dividend */}
                {calculatedResults.isCustomScenario && (
                  <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                    <p className="text-blue-800 font-medium">
                      <span className="mr-2">📊</span>
                      {calculatedResults.scenarioName}: Using ${parseFloat(customDividendAmount).toFixed(4)} monthly dividend per share 
                      {averageMonthlyDividend > 0 ? 
                        ` (${((parseFloat(customDividendAmount) / averageMonthlyDividend) * 100 - 100).toFixed(0)}% vs historical average)` 
                        : ''}
                    </p>
                  </div>
                )}
              
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-gray-700 font-semibold">Shares Owned</h3>
                    <p className="text-2xl font-bold text-blue-700">{calculatedResults.sharesOwned}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="text-gray-700 font-semibold">Expected Monthly Income</h3>
                    <p className="text-2xl font-bold text-green-700">${calculatedResults.expectedMonthlyDividend}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-md">
                    <h3 className="text-gray-700 font-semibold">Expected Annual Income</h3>
                    <p className="text-2xl font-bold text-purple-700">${calculatedResults.expectedAnnualDividend}</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-md">
                    <h3 className="text-gray-700 font-semibold">
                      {calculatedResults.isCustomScenario ? 'Projected Annual Yield' : '12-Month Historical Return'}
                    </h3>
                    <p className="text-2xl font-bold text-amber-700">
                      {calculatedResults.isCustomScenario 
                        ? `${calculatedResults.expectedAnnualYieldPercentage}%` 
                        : `$${calculatedResults.historicalReturn}`}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Dividend history chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">MSTY Monthly Dividend History</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={[0, 'auto']} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Dividend']} />
                    <ReferenceLine y={averageMonthlyDividend} stroke="red" strokeDasharray="3 3" label="Average" />
                    {useCustomDividend && customDividendAmount && (
                      <ReferenceLine y={parseFloat(customDividendAmount)} stroke="blue" strokeDasharray="3 3" label="Custom" />
                    )}
                    <Bar dataKey="dividend" fill="#4f46e5" name="Dividend" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Dividend yield chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">MSTY Monthly Yield % History</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={[0, 'auto']} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Yield']} />
                    <Line type="monotone" dataKey="yield" stroke="#7e22ce" name="Yield %" dot={{ r: 3 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Returns chart (based on investment) */}
          {calculatedResults && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {calculatedResults.isCustomScenario 
                  ? `Projected Monthly Returns (${calculatedResults.scenarioName})` 
                  : `Expected Monthly Returns`} 
                (${investmentAmount.toLocaleString()})
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={calculatedResults.isCustomScenario 
                      ? calculatedResults.projectedReturns 
                      : calculatedResults.monthlyReturns}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={[0, 'auto']} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Return']} />
                    <Bar 
                      dataKey="return" 
                      fill={calculatedResults.isCustomScenario ? "#0891b2" : "#16a34a"} 
                      name="Monthly Return" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {calculatedResults.isCustomScenario && (
                <div className="mt-2 text-xs text-gray-500 italic">
                  Note: This chart shows projected returns based on the custom dividend amount of ${parseFloat(customDividendAmount).toFixed(4)} per share.
                </div>
              )}
            </div>
          )}
          
          {/* Dividend history table */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Dividend History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Date</th>
                    <th className="py-2 px-4 border-b text-right">Amount</th>
                    <th className="py-2 px-4 border-b text-right">Yield</th>
                    <th className="py-2 px-4 border-b text-left">Ex-Dividend Date</th>
                    <th className="py-2 px-4 border-b text-left">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dividendHistory.map((dividend, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{dividend.month} {dividend.year}</td>
                      <td className="py-2 px-4 border-b text-right">${dividend.dividend.toFixed(4)}</td>
                      <td className="py-2 px-4 border-b text-right">{dividend.yield.toFixed(2)}%</td>
                      <td className="py-2 px-4 border-b">{dividend.exDate || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{dividend.payDate || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Disclaimer section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Important Disclaimer</h2>
            <p className="text-gray-700 text-sm">
              This dashboard is for informational purposes only. Historical dividend payments may not be indicative of future returns. MSTY dividends can vary significantly month to month based on the fund's strategy of selling options on MicroStrategy (MSTR). The YieldMax MSTR Option Income Strategy ETF (MSTY) is an actively managed ETF that uses options strategies which may limit upside potential. Please consult with a financial advisor before making investment decisions.
            </p>
            <p className="text-gray-700 text-sm mt-2">
              Data is refreshed automatically every 5 minutes or when you click the refresh button. Price data is in real-time, while dividend information may be delayed.
            </p>
            <p className="text-gray-700 text-sm mt-2">
              Custom dividend scenarios are for projection purposes only and do not guarantee actual returns.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MSTYDividendDashboard;
