import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Info, TrendingDown } from 'lucide-react';
import { Badge } from './ui/badge';

export function FormulasDocumentation() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Weight Tracker - Formula Documentation</h1>
        <p className="text-gray-600">Understanding how the calculations work</p>
      </div>

      {/* Moving Average - DEMA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-blue-600" />
            Double Exponential Moving Average (DEMA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge className="mb-3">What is it?</Badge>
            <p className="text-sm text-gray-700">
              The DEMA is a smoothed trend line that filters out daily weight fluctuations caused by water retention, 
              food volume, and other temporary factors. It shows your true weight trend over time.
            </p>
          </div>

          <div>
            <Badge variant="outline" className="mb-3">Formula</Badge>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3 font-mono text-sm">
              <div>
                <p className="text-gray-600 mb-1">Step 1: Calculate EMA (Exponential Moving Average)</p>
                <p className="font-medium">EMA_today = (Weight_today × α) + (EMA_yesterday × (1 - α))</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Where α (smoothing factor) is:</p>
                <p className="font-medium">α = 2 / (n + 1)</p>
                <p className="text-xs text-gray-500 mt-1">n = period (typically 7 days for weekly smoothing)</p>
              </div>
              <div className="border-t pt-3 mt-3">
                <p className="text-gray-600 mb-1">Step 2: Calculate DEMA (Double Exponential Moving Average)</p>
                <p className="font-medium">DEMA = (2 × EMA_n) - EMA(EMA_n)</p>
                <p className="text-xs text-gray-500 mt-1">
                  This applies the EMA calculation twice to further smooth the data
                </p>
              </div>
            </div>
          </div>

          <div>
            <Badge variant="secondary" className="mb-3">How it's calculated</Badge>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>First, we calculate a simple EMA using today's weight and yesterday's EMA</li>
              <li>The smoothing factor (α = 2/(7+1) = 0.25 for 7-day period) determines how much weight to give recent data</li>
              <li>Then we apply EMA again on the EMA values to get the DEMA</li>
              <li>DEMA responds faster to real changes than a simple moving average, while still filtering noise</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Why DEMA?</p>
                <p>
                  DEMA is more responsive than a simple moving average, making it better at tracking actual 
                  body composition changes while still smoothing out daily fluctuations. This is why it's 
                  preferred for weight tracking applications.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            Weekly Rate of Change
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge className="mb-3">What is it?</Badge>
            <p className="text-sm text-gray-700">
              The weekly rate shows how much weight you're gaining or losing per week. It's calculated using 
              linear regression on the DEMA trend line, not on raw weight data.
            </p>
          </div>

          <div>
            <Badge variant="outline" className="mb-3">Formula</Badge>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3 font-mono text-sm">
              <div>
                <p className="text-gray-600 mb-1">Linear Regression Formula:</p>
                <p className="font-medium">y = mx + b</p>
                <p className="text-xs text-gray-500 mt-1">Where m is the slope (rate of change)</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Slope calculation:</p>
                <p className="font-medium">m = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)</p>
                <p className="text-xs text-gray-500 mt-1">
                  x = days from start, y = DEMA values, x̄ = mean of days, ȳ = mean of DEMA values
                </p>
              </div>
              <div className="border-t pt-3 mt-3">
                <p className="text-gray-600 mb-1">Weekly Rate:</p>
                <p className="font-medium">Weekly Rate = m × 7</p>
                <p className="text-xs text-gray-500 mt-1">
                  Multiply the daily slope by 7 to get the weekly rate
                </p>
              </div>
            </div>
          </div>

          <div>
            <Badge variant="secondary" className="mb-3">How it's calculated</Badge>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>We use the last 7-14 DEMA values (trend line, not raw weights)</li>
              <li>Apply linear regression to find the line of best fit through these points</li>
              <li>The slope of this line tells us the daily rate of change</li>
              <li>Multiply by 7 to convert to weekly rate</li>
              <li>Positive = gaining weight, Negative = losing weight</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-medium mb-1">Why use DEMA for rate calculation?</p>
                <p>
                  Using DEMA instead of raw weights ensures the weekly rate isn't affected by daily fluctuations. 
                  This gives a more accurate picture of your actual progress trend.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Percentage of Weight Lost/Gained */}
      <Card>
        <CardHeader>
          <CardTitle>Percentage of Weight Change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge className="mb-3">What is it?</Badge>
            <p className="text-sm text-gray-700">
              This shows the rate of weekly change as a percentage relative to your current DEMA trend. It indicates how fast you're changing weight relative to your current body weight trend.
            </p>
          </div>

          <div>
            <Badge variant="outline" className="mb-3">Formula</Badge>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              <p className="font-medium">% Change = (Weekly Rate / Moving Average) × 100</p>
              <div className="mt-3 text-xs text-gray-600">
                <p>• Based on DEMA-calculated weekly rate (2 decimals)</p>
                <p>• Normalized by current moving average</p>
                <p>• Shows percentage rate of change per week</p>
              </div>
            </div>
          </div>

          <div>
            <Badge variant="secondary" className="mb-3">Example</Badge>
            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
              <p>Moving Average (DEMA): 78.5 kg</p>
              <p>Weekly Rate: -0.50 kg/week</p>
              <p className="font-medium text-green-600">% Change = (-0.50 / 78.5) × 100 = -0.6%/week</p>
              <p className="text-xs text-gray-600 mt-2">This means 0.6% weight loss per week relative to current trend</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Exclusion */}
      <Card>
        <CardHeader>
          <CardTitle>Data Exclusion System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge className="mb-3">What is it?</Badge>
            <p className="text-sm text-gray-700">
              You can exclude specific weight entries from calculations (DEMA and weekly rate) while keeping them 
              visible in your history. This is useful for outliers like post-cheat meal weigh-ins or entries taken 
              under unusual circumstances.
            </p>
          </div>

          <div>
            <Badge variant="secondary" className="mb-3">How it works</Badge>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Click on any weight entry row to toggle exclusion</li>
              <li>Excluded entries show an orange circle in the top-right corner</li>
              <li>Excluded weights are NOT used in DEMA or weekly rate calculations</li>
              <li>The entry remains visible in your history for reference</li>
              <li>You can re-include the entry at any time by clicking again</li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">When to exclude data?</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>After a cheat meal or refeed day</li>
                  <li>During menstrual cycle (for female clients)</li>
                  <li>After unusually high sodium intake</li>
                  <li>If you weighed in at a different time than usual</li>
                  <li>Any entry you know isn't representative of your true progress</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Coding */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge className="mb-3">Weekly Rate Colors</Badge>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-700 border-green-200 border">-0.5 kg/week</Badge>
                <span className="text-sm text-gray-700">Negative rate (losing weight) = Light green</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-100 text-red-700 border-red-200 border">+0.3 kg/week</Badge>
                <span className="text-sm text-gray-700">Positive rate (gaining weight) = Light red</span>
              </div>
            </div>
          </div>

          <div>
            <Badge className="mb-3 mt-6">Target Rate Badge</Badge>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">Target</Badge>
                <span className="text-sm text-gray-700">Target for losing weight = Blue</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-100 text-orange-700 border-orange-300 border">Target</Badge>
                <span className="text-sm text-gray-700">Target for gaining weight = Orange</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-100 text-purple-700 border-purple-300 border">Target</Badge>
                <span className="text-sm text-gray-700">Target for maintaining = Purple</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Different borders and colors</p>
                <p>
                  The Target badge has a thicker, more distinct border and different color palette than the 
                  Weekly Rate badge, making it easy to distinguish between your actual rate and your target at a glance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle>Quick Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p><strong>DEMA (Moving Average):</strong> Smooths daily fluctuations using double exponential smoothing to show true trend</p>
            <p><strong>Weekly Rate:</strong> Linear regression on DEMA values, showing kg/lbs change per week</p>
            <p><strong>% Change:</strong> Percentage rate of change per week relative to DEMA trend (Weekly Rate / Moving Average × 100)</p>
            <p><strong>Exclusion:</strong> Click any row to exclude outliers from calculations while keeping them visible</p>
            <p><strong>Color Coding:</strong> Green = weight loss, Red = weight gain, Target badges have distinct borders and colors</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
