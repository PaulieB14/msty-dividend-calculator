import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';

const MSTYDividendDashboard = () => {
  // Current price and key metrics
  const currentPrice = 25.12; // As of May 7, 2025
  const averageMonthlyDividend = 2.6356;
  const annualYield = 125.90; // Annual yield percentage

  // Dividend history data
  const dividendHistory = [
    { month: "Apr", year: 2024, dividend: 4.1286, yield: 16.44 },
    { month: "May", year: 2024, dividend: 2.5239, yield: 10.05 },
    { month: "Jun", year: 2024, dividend: 3.0300, yield: 12.06 },
    { month: "Jul", year: 2024, dividend: 2.3320, yield: 9.28 },
    { month: "Aug", year: 2024, dividend: 1.9405, yield: 7.72 },
    { month: "Sep", year: 2024, dividend: 1.8541, yield: 7.38 },
    { month: "Oct", year: 2024, dividend: 4.1981, yield: 16.71 },
    { month: "Nov", year: 2024, dividend: 4.4213, yield: 17.60 },
    { month: "Dec", year: 2024, dividend: 3.0821, yield: 12.27 },
    { month: "Jan", year: 2025, dividend: 2.2792, yield: 9.07 },
    { month: "Feb", year: 2025, dividend: 2.0216, yield: 8.05 },
    { month: "Mar", year: 2025, dividend: 1.3775, yield: 5.48 },
    { month: "Apr", year: 2025, dividend: 1.3356, yield: 5.32 },
    { month: "May", year: 2025, dividend: 2.3734, yield: 9.45 }
  ];

  // Format data for chart display
  const chartData = dividendHistory.map(item => ({
    ...item,
    label: `${item.month} ${item.year}`
  }));

  // State for user input
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [calculatedResults, setCalculatedResults] = useState(null);
  
  // Function to calculate returns
  const calculateReturns = (amount) => {
    const sharesOwned = amount / currentPrice;
    
    // Expected monthly dividend based on average
    const expectedMonthlyDividend = averageMonthlyDividend * sharesOwned;
    
    // Expected annual dividend
    const expectedAnnualDividend = expectedMonthlyDividend * 12;
    
    // Calculate historical returns if invested one year ago
    const lastYearDividends = dividendHistory.slice(0, 12);
    const historicalDividendTotal = lastYearDividends.reduce((sum, item) => sum + item.dividend, 0);
    const historicalReturn = historicalDividendTotal * sharesOwned;
    
    // Calculate historical monthly returns
    const monthlyReturns = dividendHistory.map(item => ({
      label: `${item.month} ${item.year}`,
      dividend: item.dividend,
      return: (item.dividend * sharesOwned).toFixed(2)
    }));
    
    return {
      sharesOwned: sharesOwned.toFixed(2),
      expectedMonthlyDividend: expectedMonthlyDividend.toFixed(2),
      expectedAnnualDividend: expectedAnnualDividend.toFixed(2),
      expectedAnnualYieldPercentage: annualYield.toFixed(2),
      historicalReturn: historicalReturn.toFixed(2),
      monthlyReturns
    };
  };

  // Calculate results when investment amount changes
  useEffect(() => {
    setCalculatedResults(calculateReturns(investmentAmount));
  }, [investmentAmount]);

  // Handle input change
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setInvestmentAmount(value);
    }
  };

  // Function to handle preset amount buttons
  const handlePresetAmount = (amount) => {
    setInvestmentAmount(amount);
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">MSTY Dividend Calculator Dashboard</h1>
        <p className="text-gray-600">Calculate expected returns from MSTY based on historical dividends</p>
      </div>
      
      {/* Key stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-700">Current Price</h2>
          <p className="text-3xl font-bold text-blue-700">${currentPrice}</p>
          <p className="text-gray-500 text-sm">As of May 7, 2025</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-700">Avg Monthly Dividend</h2>
          <p className="text-3xl font-bold text-green-700">${averageMonthlyDividend}</p>
          <p className="text-gray-500 text-sm">Per share</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-gray-700">Annual Yield</h2>
          <p className="text-3xl font-bold text-purple-700">{annualYield}%</p>
          <p className="text-gray-500 text-sm">Based on current price</p>
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
        
        {calculatedResults && (
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
              <h3 className="text-gray-700 font-semibold">12-Month Historical Return</h3>
              <p className="text-2xl font-bold text-amber-700">${calculatedResults.historicalReturn}</p>
            </div>
          </div>
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
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Dividend']} />
                <ReferenceLine y={averageMonthlyDividend} stroke="red" strokeDasharray="3 3" label="Average" />
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
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Yield']} />
                <Line type="monotone" dataKey="yield" stroke="#7e22ce" name="Yield %" dot={{ r: 3 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Expected monthly returns chart (based on investment) */}
      {calculatedResults && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Expected Monthly Returns (${investmentAmount.toLocaleString()})</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculatedResults.monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Return']} />
                <Bar dataKey="return" fill="#16a34a" name="Monthly Return" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Disclaimer section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Important Disclaimer</h2>
        <p className="text-gray-700 text-sm">
          This dashboard is for informational purposes only. Historical dividend payments may not be indicative of future returns. MSTY dividends can vary significantly month to month based on the fund's strategy of selling options on MicroStrategy (MSTR). The YieldMax MSTR Option Income Strategy ETF (MSTY) is an actively managed ETF that uses options strategies which may limit upside potential. Please consult with a financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default MSTYDividendDashboard;
