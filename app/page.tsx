'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Currency data with flags and names
const currencies = [
  { code: 'MMK', name: 'Myanmar Kyat', flag: '🇲🇲' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
];

// Initial empty rates - will be populated from API
const initialRates: { [key: string]: number } = {
  MMK: 1,
  CNY: 0,
  JPY: 0,
  USD: 0,
  EUR: 0,
  GBP: 0,
  THB: 0,
  SGD: 0,
  KRW: 0,
};

export default function Home() {
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<string>('MMK');
  const [toCurrency, setToCurrency] = useState<string>('CNY');
  const [result, setResult] = useState<number>(0);
  const [rates, setRates] = useState(initialRates);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Function to fetch exchange rates from API
  const fetchRates = async () => {
    setLoading(true);
    try {
      // Get API key from environment variable
      const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
      
      console.log('Environment check:', {
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey?.length,
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT FOUND'
      });
      
      if (!apiKey) {
        console.error('❌ API key not found. Please add NEXT_PUBLIC_EXCHANGE_RATE_API_KEY to your .env.local file');
        alert('API key not found! Please:\n1. Rename .env to .env.local\n2. Restart the dev server\n3. Refresh the page');
        setLoading(false);
        setInitialLoad(false);
        return;
      }
      
      // Using exchangerate-api.com v6 with API key
      const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/MMK`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Log the response for debugging
      console.log('API Response:', data);

      // Check if the API call was successful
      if (data.result === 'success' && data.conversion_rates) {
        setRates({
          MMK: 1,
          ...data.conversion_rates,
        });
        setLastUpdated(
          new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        );
        console.log('Rates updated successfully:', data.conversion_rates);
      } else {
        console.error('API Error:', data);
        alert(`API Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      alert('Failed to load exchange rates. Please check your API key and internet connection.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Fetch rates on component mount
  useEffect(() => {
    fetchRates();
  }, []);

  // Calculate conversion
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;

    if (fromCurrency === 'MMK') {
      // Converting from MMK to other currency
      setResult(numAmount * rates[toCurrency]);
    } else if (toCurrency === 'MMK') {
      // Converting from other currency to MMK
      setResult(numAmount / rates[fromCurrency]);
    } else {
      // Converting between two non-MMK currencies
      const inMMK = numAmount / rates[fromCurrency];
      setResult(inMMK * rates[toCurrency]);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col items-center text-center gap-4 mb-6 sm:flex-row sm:items-center sm:justify-center sm:text-left">
            {/* Logo */}
            <div className="bg-linear-to-br from-amber-500 to-yellow-600 rounded-2xl p-4 shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {/* Title */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-yellow-600">
                Myanmar Currency Converter
              </h1>
              <p className="text-slate-600 text-sm md:text-lg mt-2">
                Real-time exchange rates • Live updates
              </p>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {initialLoad && (
          <div className="flex items-center justify-center gap-3 mb-6 bg-blue-50 border border-blue-200 rounded-xl py-4 px-6">
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
            <p className="text-blue-700 font-medium">Loading real-time exchange rates...</p>
          </div>
        )}

        {/* Two Cards in Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Main Converter Card */}
          <Card className="lg:col-span-3 p-8 bg-white border-slate-200 shadow-xl">
            {/* From Currency */}
            <div className="space-y-3">
              <Label htmlFor="from-amount" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">From</Label>
              <div className="flex gap-3">
                <Input
                  id="from-amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 text-xl h-14 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-[180px] h-14 border-slate-300 text-base font-medium">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{currencies.find(c => c.code === fromCurrency)?.flag}</span>
                        <span className="font-semibold">{fromCurrency}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{currency.code}</span>
                            <span className="text-xs text-slate-500">{currency.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-6">
              <Button
                onClick={swapCurrencies}
                size="icon"
                variant="outline"
                className="rounded-full h-14 w-14 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 transition-all"
              >
                <ArrowLeftRight className="h-6 w-6" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-3">
              <Label htmlFor="to-amount" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">To</Label>
              <div className="flex gap-3">
                <Input
                  id="to-amount"
                  type="text"
                  value={result.toFixed(2)}
                  readOnly
                  className="flex-1 text-xl h-14 font-bold bg-slate-50 border-slate-300 text-slate-900"
                />
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-[180px] h-14 border-slate-300 text-base font-medium">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{currencies.find(c => c.code === toCurrency)?.flag}</span>
                        <span className="font-semibold">{toCurrency}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{currency.code}</span>
                            <span className="text-xs text-slate-500">{currency.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-linear-to-r from-amber-50 to-yellow-50 rounded-xl p-5 text-center mt-8 border border-amber-200">
              <p className="text-base text-slate-700">
                <span className="font-medium">1 {fromCurrency} =</span>{' '}
                <span className="font-bold text-xl md:text-2xl text-amber-600">
                  {fromCurrency === 'MMK'
                    ? rates[toCurrency].toFixed(6)
                    : toCurrency === 'MMK'
                    ? (1 / rates[fromCurrency]).toFixed(2)
                    : (rates[toCurrency] / rates[fromCurrency]).toFixed(6)}{' '}
                  {toCurrency}
                </span>
              </p>
            </div>
          </Card>

          {/* Exchange Rates Card */}
          <Card className="lg:col-span-2 bg-white border-slate-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>Exchange Rates</CardTitle>
                    {lastUpdated && !loading && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Live
                      </span>
                    )}
                  </div>
                  {lastUpdated && (
                    <CardDescription className="mt-1">
                      Updated: {lastUpdated}
                    </CardDescription>
                  )}
                </div>
                <Button
                  onClick={fetchRates}
                  disabled={loading}
                  size="sm"
                  className="gap-2 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Updating...' : 'Refresh'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Rate List */}
              <div className="grid grid-cols-2 gap-3">
                {currencies
                  .filter(c => c.code !== 'MMK')
                  .map(currency => (
                    <div
                      key={currency.code}
                      className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-4 text-center hover:shadow-lg hover:scale-105 hover:border-amber-300 transition-all duration-200 border-2 border-slate-200 cursor-pointer"
                    >
                      <div className="text-3xl mb-2">{currency.flag}</div>
                      <div className="text-xs font-bold text-slate-500 mb-1 tracking-wider">{currency.code}</div>
                      <div className="text-base font-bold text-slate-900">{rates[currency.code].toFixed(6)}</div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✓</span>
                  <p className="text-xs text-green-700 text-center font-medium">
                    Real-time data • Auto-loaded on page load • Click "Refresh" for latest rates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-md border border-slate-200">
            <p className="text-sm text-slate-600">
              Powered by{' '}
              <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-yellow-600">
                Myanmar Online Technology
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
