import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ShadcnButton from './ShadcnButton';
import { cn } from '../lib/utils';

/**
 * AdvancedCharts Component
 * 
 * A component that displays various advanced chart visualizations
 * with filtering capabilities and real-time updates.
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Advanced charts component
 */
const AdvancedCharts = ({ className }) => {
  // State for active time period filter
  const [timePeriod, setTimePeriod] = useState('week');
  
  // State to track if real-time updates are enabled
  const [isRealTime, setIsRealTime] = useState(false);
  
  // Mock data for demo purposes - in a real app this would come from an API
  const salesData = {
    day: [
      { name: '00:00', sales: 1400, revenue: 2400, visitors: 340 },
      { name: '03:00', sales: 1100, revenue: 1398, visitors: 290 },
      { name: '06:00', sales: 700, revenue: 9800, visitors: 190 },
      { name: '09:00', sales: 2780, revenue: 3908, visitors: 480 },
      { name: '12:00', sales: 1890, revenue: 4800, visitors: 380 },
      { name: '15:00', sales: 2390, revenue: 3800, visitors: 430 },
      { name: '18:00', sales: 3490, revenue: 4300, visitors: 520 },
      { name: '21:00', sales: 2490, revenue: 4300, visitors: 460 },
    ],
    week: [
      { name: 'Mon', sales: 4000, revenue: 8400, visitors: 1200 },
      { name: 'Tue', sales: 3000, revenue: 5398, visitors: 980 },
      { name: 'Wed', sales: 2000, revenue: 9800, visitors: 820 },
      { name: 'Thu', sales: 2780, revenue: 3908, visitors: 890 },
      { name: 'Fri', sales: 1890, revenue: 4800, visitors: 760 },
      { name: 'Sat', sales: 2390, revenue: 3800, visitors: 820 },
      { name: 'Sun', sales: 3490, revenue: 4300, visitors: 1100 },
    ],
    month: [
      { name: 'Jan', sales: 14000, revenue: 24000, visitors: 4200 },
      { name: 'Feb', sales: 11000, revenue: 13980, visitors: 3800 },
      { name: 'Mar', sales: 9000, revenue: 18000, visitors: 3200 },
      { name: 'Apr', sales: 17800, revenue: 23900, visitors: 4900 },
      { name: 'May', sales: 18900, revenue: 24800, visitors: 5100 },
      { name: 'Jun', sales: 13900, revenue: 18000, visitors: 4300 },
      { name: 'Jul', sales: 14900, revenue: 20300, visitors: 4200 },
      { name: 'Aug', sales: 12300, revenue: 17900, visitors: 3700 },
      { name: 'Sep', sales: 15600, revenue: 21400, visitors: 4300 },
      { name: 'Oct', sales: 16800, revenue: 22500, visitors: 4600 },
      { name: 'Nov', sales: 14500, revenue: 19800, visitors: 4100 },
      { name: 'Dec', sales: 19200, revenue: 28500, visitors: 5300 },
    ],
  };

  const trafficSourcesData = [
    { name: 'Direct', value: 35 },
    { name: 'Social Media', value: 25 },
    { name: 'Email', value: 20 },
    { name: 'Organic Search', value: 15 },
    { name: 'Referral', value: 5 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ef4444'];
  
  // Real-time data simulation with useEffect
  React.useEffect(() => {
    let interval;
    
    // If real-time updates are enabled, simulate data updates every 3 seconds
    if (isRealTime) {
      interval = setInterval(() => {
        // Deep clone the data
        const updatedData = JSON.parse(JSON.stringify(salesData));
        
        // Update each data point with a random variation
        Object.keys(updatedData).forEach(period => {
          updatedData[period] = updatedData[period].map(item => ({
            ...item,
            sales: Math.max(0, item.sales + Math.floor((Math.random() - 0.5) * 500)),
            revenue: Math.max(0, item.revenue + Math.floor((Math.random() - 0.5) * 1000)),
            visitors: Math.max(0, item.visitors + Math.floor((Math.random() - 0.5) * 100)),
          }));
        });
        
        // Replace salesData with updated data (in a real app, we'd use setState)
        Object.keys(updatedData).forEach(period => {
          salesData[period] = updatedData[period];
        });
        
        // Force re-render by updating state
        setIsRealTime(prev => !!prev);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTime]);
  
  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };
  
  // Handle time period filter changes
  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
  };

  // Toggle real-time updates
  const toggleRealTime = () => {
    setIsRealTime(prev => !prev);
  };
  
  return (
    <Card className={cn("overflow-hidden shadow-md", className)}>
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
            Advanced Analytics
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Tabs 
              defaultValue={timePeriod} 
              value={timePeriod} 
              onValueChange={handleTimePeriodChange}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 p-1 rounded-lg">
                <TabsTrigger 
                  value="day"
                  className={timePeriod === 'day' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}
                >Day</TabsTrigger>
                <TabsTrigger 
                  value="week"
                  className={timePeriod === 'week' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}
                >Week</TabsTrigger>
                <TabsTrigger 
                  value="month"
                  className={timePeriod === 'month' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}
                >Month</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <ShadcnButton
              variant={isRealTime ? "default" : "outline"}
              size="sm"
              className={`ml-0 sm:ml-2 mt-2 sm:mt-0 rounded-xl transition-all ${
                isRealTime ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md' : 'border border-gray-200 dark:border-gray-700'
              }`}
              onClick={toggleRealTime}
            >
              {isRealTime ? (
                <span className="flex items-center">
                  <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Live Data
                </span>
              ) : "Enable Live Data"}
            </ShadcnButton>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Chart - Area & Line - With white background like Dashboard */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 h-[400px] overflow-hidden">
            <div className="mb-6">
              {/* Chart title */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-300">Sales & Visitor Overview</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Performance data analysis</p>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart
                data={salesData[timePeriod]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  labelStyle={{
                    fontWeight: 'bold',
                    marginBottom: '6px',
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  fill="url(#colorSales)" 
                  stroke="#3b82f6" 
                  yAxisId="left" 
                  name="Sales"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#a855f7" 
                  yAxisId="right" 
                  name="Visitors"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Bar 
                  dataKey="revenue" 
                  barSize={20} 
                  fill="url(#colorRevenue)" 
                  yAxisId="left" 
                  name="Revenue"
                  opacity={0.8}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Secondary Chart - Pie - With white background like Dashboard */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 h-[400px] overflow-hidden">
            <div className="mb-6">
              {/* Chart title */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-300">Traffic Sources</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visitor acquisition channels</p>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient id={`colorPie${index}`} x1="0" y1="0" x2="0" y2="1" key={`gradient-${index}`}>
                      <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius="65%"
                  innerRadius="40%"
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {trafficSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorPie${index % COLORS.length})`} stroke={COLORS[index % COLORS.length]} strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value, entry) => (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {value}: {entry.payload.value}%
                    </span>
                  )}
                  iconSize={10}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts Section - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Conversion Rates Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 h-[350px] overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-300">Conversion Rates</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Performance by channel</p>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Organic Search</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full min-w-[16px]" style={{ width: '2.4%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Direct Traffic</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">3.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full min-w-[16px]" style={{ width: '3.8%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Social Media</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">4.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-3 rounded-full min-w-[16px]" style={{ width: '4.2%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Campaigns</span>
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">7.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-400 h-3 rounded-full min-w-[16px]" style={{ width: '7.5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 h-[350px] overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-300">Device Breakdown</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">User session by device type</p>
            </div>
            <div className="space-y-4">
              {[
                { device: 'Mobile', percentage: 58, users: 11600 },
                { device: 'Desktop', percentage: 32, users: 6400 },
                { device: 'Tablet', percentage: 8, users: 1600 },
                { device: 'Other', percentage: 2, users: 400 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full" style={{
                      background: `linear-gradient(to right, var(--primary-${500 - index * 100 < 200 ? 200 : 500 - index * 100}), var(--primary-${400 - index * 100 < 200 ? 200 : 400 - index * 100}))`,
                      opacity: 1 - (index * 0.08)
                    }}></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.device}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.users.toLocaleString()}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedCharts;
