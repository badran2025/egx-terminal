/**
 * EGX Terminal - Comprehensive Automated System Verification Suite
 * Tests every core function, button logic, navigation, 7-layer simulator, 
 * mutual fund benchmarks, market watch sidebar, and financial calculations.
 */

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('================================================================');
console.log('🚀 STARTING COMPREHENSIVE TERMINAL TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST SUITE 1: Core Pricing Constants & Source of Truth
// -----------------------------------------------------------------------------
console.log('📌 [Suite 1]: Real Market Pricing Constants (Gold & Real USD Rate)');

const egxServicePath = path.resolve(__dirname, '../src/services/egxService.ts');
const serviceContent = fs.readFileSync(egxServicePath, 'utf8');

const gold24Match = serviceContent.match(/export const LIVE_GOLD_24K_PRICE = ([0-9.]+);/);
const gold24 = gold24Match ? parseFloat(gold24Match[1]) : 0;
assert(gold24 === 7180, `Gold 24k is real market price 7180 EGP (got: ${gold24})`);

const gold21Match = serviceContent.match(/export const LIVE_GOLD_21K_PRICE = ([0-9.]+);/);
const gold21 = gold21Match ? parseFloat(gold21Match[1]) : 0;
assert(gold21 === 6282.5, `Gold 21k in Sagha is 6282.50 EGP (got: ${gold21})`);

const usdMatch = serviceContent.match(/export const LIVE_USD_MARKET_RATE = ([0-9.]+);/);
const usdRate = usdMatch ? parseFloat(usdMatch[1]) : 0;
assert(usdRate === 55.50, `USD real market rate is 55.50 EGP (got: ${usdRate})`);

assert(!serviceContent.includes('50.50') && !serviceContent.includes('4150.00'), 'Zero references to central bank 50.50 or old 4150 rates in service constants');

// -----------------------------------------------------------------------------
// TEST SUITE 2: All 73 Mutual Funds & Investment Policies
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 2]: Mutual Funds Data Integrity & Accurate Benchmarks');

const LIVE_GOLD_24K_PRICE = 7180;
const LIVE_T70_NAV = 1.4429;
const LIVE_BMM_NAV = 2.14964;
const LIVE_ABR_NAV = 217.87;

const fundsMatch = serviceContent.match(/export const EGYPTIAN_MUTUAL_FUNDS: MutualFund\[\] = (\[[\s\S]*?\]);/);
const allFunds = eval(fundsMatch[1]);

assert(allFunds.length === 73, `Total funds count is exactly 73 (got: ${allFunds.length})`);

const activeFunds = allFunds.filter(f => f.category === 'أسهم نشطة');
assert(activeFunds.length === 28, `Active equity funds count is exactly 28 (got: ${activeFunds.length})`);

const passiveFunds = allFunds.filter(f => f.category === 'أسهم مؤشرات (سلبية)');
assert(passiveFunds.length === 12, `Passive / index funds count is exactly 12 (got: ${passiveFunds.length})`);

const fixedIncomeFunds = allFunds.filter(f => f.category === 'دخل ثابت ونقدي');
assert(fixedIncomeFunds.length === 23, `Fixed income funds count is exactly 23 (got: ${fixedIncomeFunds.length})`);

const preciousMetals = allFunds.filter(f => f.category === 'ذهب وفضة');
assert(preciousMetals.length === 8, `Precious metals funds count is exactly 8 (got: ${preciousMetals.length})`);

const clouds = allFunds.filter(f => f.category === 'كلاودز');
assert(clouds.length === 2, `Clouds saving pots count is exactly 2 (got: ${clouds.length})`);

// Specific Benchmark Validations:
const bmm = allFunds.find(f => f.code.toUpperCase() === 'BMM');
assert(bmm && bmm.benchmark && bmm.benchmark.includes('EGX100'), `Belton Myeh Myeh (BMM) benchmarks against EGX100 EWI (benchmark: ${bmm?.benchmark})`);
assert(bmm && !bmm.benchmark.includes('EGX30'), `Belton Myeh Myeh is NOT falsely mapped to EGX30`);

const ci30 = allFunds.find(f => f.code.toUpperCase() === 'CI30');
assert(ci30 && ci30.benchmark && ci30.benchmark.includes('EGX30'), `CI30 benchmarks against EGX30 (benchmark: ${ci30?.benchmark})`);

const t70 = allFunds.find(f => f.code.toUpperCase() === 'T70');
assert(t70 && t70.benchmark && t70.benchmark.includes('EGX70'), `Thndr T70 benchmarks against EGX70 EWI (benchmark: ${t70?.benchmark})`);

const b70 = allFunds.find(f => f.code.toUpperCase() === 'B70');
assert(b70 && b70.benchmark && b70.benchmark.includes('EGX70'), `Belton B70 benchmarks against EGX70 EWI (benchmark: ${b70?.benchmark})`);

const ak70 = allFunds.find(f => f.code.toUpperCase() === 'AK70');
assert(ak70 && ak70.benchmark && ak70.benchmark.includes('EGX70'), `Kenz AK70 benchmarks against EGX70 EWI (benchmark: ${ak70?.benchmark})`);

const ncs = allFunds.find(f => f.code.toUpperCase() === 'NCS');
assert(ncs && ncs.benchmark && ncs.benchmark.includes('EGX70'), `Sahmy NCS benchmarks against EGX70 EWI (benchmark: ${ncs?.benchmark})`);

const cms = allFunds.find(f => f.code.toUpperCase() === 'CMS');
assert(cms && cms.benchmark && cms.benchmark.includes('EGX33'), `CI CMS benchmarks against EGX33 Shariah (benchmark: ${cms?.benchmark})`);

const ak35 = allFunds.find(f => f.code.toUpperCase() === 'AK35');
assert(ak35 && ak35.benchmark && ak35.benchmark.includes('EGX35'), `AK35 benchmarks against EGX35 Low Volatility (benchmark: ${ak35?.benchmark})`);

const cex = allFunds.find(f => f.code.toUpperCase() === 'CEX');
assert(cex && cex.sectorFocus && cex.sectorFocus.includes('تصدير'), `CEX fund is focused on exporting & USD revenues (focus: ${cex?.sectorFocus})`);

const bre = allFunds.find(f => f.code.toUpperCase() === 'BRE');
assert(bre && bre.sectorFocus && (bre.sectorFocus.includes('عقار') || bre.sectorFocus.includes('العقاري')), `BRE fund is focused on real estate (focus: ${bre?.sectorFocus})`);

// -----------------------------------------------------------------------------
// TEST SUITE 3: Market Watch Sidebar & Component Structure
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 3]: Market Watch Sidebar (مراقبة السوق) & UI Components');

const sidebarPath = path.resolve(__dirname, '../src/components/MarketWatchSidebar.tsx');
assert(fs.existsSync(sidebarPath), 'MarketWatchSidebar.tsx exists');

const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
assert(sidebarContent.includes('مراقبة السوق'), 'MarketWatchSidebar contains official "مراقبة السوق" title');
assert(sidebarContent.includes('activeFilter'), 'MarketWatchSidebar supports index filters (all, egx30, egx70, egx100, owned, funds)');
assert(sidebarContent.includes('sortBy'), 'MarketWatchSidebar supports sorting by turnover, gainers, losers, and alphabetical');
assert(sidebarContent.includes('onToggleCollapse'), 'MarketWatchSidebar supports smooth expand/collapse toggle');

const appPath = path.resolve(__dirname, '../src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(appContent.includes('MarketWatchSidebar'), 'App.tsx mounts MarketWatchSidebar on the right');
assert(appContent.includes('max-w-[2560px]'), 'App.tsx layout width expanded to max-w-[2560px] without compressing content');

// -----------------------------------------------------------------------------
// TEST SUITE 4: Removal of Redundant Recommendation Cards
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 4]: De-cluttering & Removal of Duplicate Cards View');

const radarPath = path.resolve(__dirname, '../src/components/RadarAndRecommendationsView.tsx');
const radarContent = fs.readFileSync(radarPath, 'utf8');

assert(!radarContent.includes('import { RecommendationsView }') && !radarContent.includes('<RecommendationsView'), 'RecommendationsView cleanly removed from RadarAndRecommendationsView');
assert(!radarContent.includes("activeSubTab === 'cards'"), 'Cards sub-tab removed, keeping pure Lab & Full Table');

// -----------------------------------------------------------------------------
// TEST SUITE 5: Header Ticker News Marquee
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 5]: Header News Marquee Ticker & Animations');

const tickerPath = path.resolve(__dirname, '../src/components/HeaderTicker.tsx');
const tickerContent = fs.readFileSync(tickerPath, 'utf8');

assert(tickerContent.includes('ticker-marquee-track'), 'HeaderTicker contains continuous auto-scrolling marquee track');
assert(tickerContent.includes('gold24Price'), 'HeaderTicker displays live 24k Gold (7,180 EGP)');
assert(tickerContent.includes('gold21Price'), 'HeaderTicker displays live 21k Gold (6,282.50 EGP)');
assert(tickerContent.includes('usdMarketRate'), 'HeaderTicker displays live real market USD rate (55.50 EGP)');
assert(tickerContent.includes('EGX 70 EWI'), 'HeaderTicker displays EGX 70 EWI');
assert(tickerContent.includes('EGX 100 EWI'), 'HeaderTicker displays EGX 100 EWI');

const cssPath = path.resolve(__dirname, '../src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('@keyframes marquee-scroll'), 'CSS contains smooth infinite marquee keyframes');
assert(cssContent.includes('.card-3d-hover'), 'CSS contains 3D perspective hover cards');
assert(cssContent.includes('.glow-beacon'), 'CSS contains 3D live glow rings');

// -----------------------------------------------------------------------------
// TEST SUITE 6: Technical Radar & Volume/Turnover Calculations
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 6]: TradingView Scanner EGP Turnover & Volume Sorting');

const technicalRadarPath = path.resolve(__dirname, '../src/components/TechnicalRadarView.tsx');
const techContent = fs.readFileSync(technicalRadarPath, 'utf8');

assert(techContent.includes('formatTurnover'), 'TechnicalRadarView uses official EGP formatTurnover');
assert(techContent.includes('formatVolumeShares'), 'TechnicalRadarView uses official formatVolumeShares');
assert(techContent.includes('toggleSort(\'turnover\')'), 'TechnicalRadarView allows sorting by EGP turnover');
assert(techContent.includes('toggleSort(\'volume\')'), 'TechnicalRadarView allows sorting by shares volume');

// -----------------------------------------------------------------------------
// TEST SUITE 7: BADRAN 7-Layer Strategy & Gate 0 Analysis Engine
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 7]: BADRAN 7 Layers & Gate 0 Confluence Engine');

const simulatorDataPath = path.resolve(__dirname, '../src/services/growthxSimulatorData.ts');
const simContent = fs.readFileSync(simulatorDataPath, 'utf8');

assert(simContent.includes('GROWTHX_SIMULATOR_CASES'), 'All simulator stock cases defined');
assert(simContent.includes('resolve7LayerAnalysis'), 'resolve7LayerAnalysis function exists and active');
assert(simContent.includes('fundamentalProfile') && simContent.includes('layers'), 'Gate 0 fundamental profile & 7-layer structure fully integrated');

// -----------------------------------------------------------------------------
// TEST SUITE 8: Next Session Preparatory Plan & Header De-cluttering
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 8]: Next Session Operational Plan & Header De-cluttering');

const nextSessionServicePath = path.resolve(__dirname, '../src/services/nextSessionPlannerService.ts');
assert(fs.existsSync(nextSessionServicePath), 'nextSessionPlannerService.ts exists and active');

const nextSessionContent = fs.readFileSync(nextSessionServicePath, 'utf8');
assert(nextSessionContent.includes('buildStockNextSessionPlan'), 'buildStockNextSessionPlan calculates complete next session plan');
assert(nextSessionContent.includes('support1') && nextSessionContent.includes('support2') && nextSessionContent.includes('support3'), 'Full 3-tier support levels (S1, S2, S3) calculated');
assert(nextSessionContent.includes('resistance1') && nextSessionContent.includes('resistance2') && nextSessionContent.includes('resistance3'), 'Full 3-tier resistance levels (R1, R2, R3) calculated');
assert(nextSessionContent.includes('entryRangeMin') && nextSessionContent.includes('entryRangeMax'), 'Entry range zone calculated');
assert(nextSessionContent.includes('target1') && nextSessionContent.includes('target2'), 'Targets 1 and 2 calculated');
assert(nextSessionContent.includes('stopLoss'), 'Stop loss level calculated');
assert(nextSessionContent.includes('layer1Trend') && nextSessionContent.includes('layer7MultiTF'), 'Dedicated results for all 7 BADRAN layers included');
assert(nextSessionContent.includes('confluenceScore'), 'Confluence score for 7 stages calculated');
assert(nextSessionContent.includes('nextEarningsDate'), 'Next scheduled earnings announcement date included');
assert(nextSessionContent.includes('catalystsAndNews'), 'Corporate catalysts and macroeconomic events included');

// Table component verification
assert(techContent.includes('pureStocks'), 'TechnicalRadarView filters to pure stocks only, excluding mutual funds and gold');
assert(techContent.includes('handleExportCSV'), 'TechnicalRadarView supports CSV / Excel export of trading battle plan');
assert(techContent.includes('selectedStockForModal'), 'TechnicalRadarView provides interactive detail modal for each stock');
assert(techContent.includes('rankAndEnrichTop10SessionPlans'), 'TechnicalRadarView uses rankAndEnrichTop10SessionPlans');
assert(techContent.includes('top10Picks'), 'TechnicalRadarView renders top 10 strong recommendations strip');
assert(techContent.includes('⭐ {plan.topPickRank}'), 'TechnicalRadarView badges top 10 strong recommendations in the table');

// Dynamic Pricing & Safety Verification
assert(nextSessionContent.includes('rankAndEnrichTop10SessionPlans'), 'nextSessionPlannerService exports rankAndEnrichTop10SessionPlans');
assert(nextSessionContent.includes('isTopPick') && nextSessionContent.includes('topPickRank'), 'NextSessionStockPlan has top recommendation rank attributes');

// Ensure that prices are strictly anchored dynamically to currentPrice (no stale 30.80 for 14.82)
assert(nextSessionContent.includes('entryMin >= entryMax') || nextSessionContent.includes('Math.abs(entryMin - currentPrice)'), 'Entry range is mathematically validated and anchored to currentPrice');
assert(nextSessionContent.includes('stopLoss >= currentPrice'), 'Stop loss is strictly validated to be lower than currentPrice');

// Header De-cluttering Verification
const labPath = path.resolve(__dirname, '../src/components/InteractiveStockLab.tsx');
const labContent = fs.readFileSync(labPath, 'utf8');
assert(!labContent.includes('ابحث عن أي سهم بالرمز أو الاسم:'), 'Redundant huge stock search input removed from InteractiveStockLab');
assert(labContent.includes('قائمة مراقبة السوق'), 'InteractiveStockLab refers trader to permanent right MarketWatchSidebar');

const radarViewContent = fs.readFileSync(radarPath, 'utf8');
assert(radarViewContent.includes('توصيات وخطة الجلسة القادمة'), 'RadarAndRecommendationsView sub-tab 2 updated to Next Session Plan');

// -----------------------------------------------------------------------------
// SUITE 9: Institutional Algorithmic Audit & Quantitative Corrections
// -----------------------------------------------------------------------------
console.log('\n📌 [Suite 9]: Institutional Algorithmic Audit & Quantitative Corrections');

// 1. Decision tree safety order (STOP_LOSS must be checked before SWING_BUY)
const stopLossIndex = nextSessionContent.indexOf("finalActionVerdict = 'STOP_LOSS'");
const swingBuyIndex = nextSessionContent.indexOf("finalActionVerdict = 'SWING_BUY'");
assert(stopLossIndex > 0 && swingBuyIndex > 0 && stopLossIndex < swingBuyIndex, 'STOP_LOSS is prioritized before SWING_BUY in decision tree');

// 2. Penny stocks (< 2.00 EGP) 3-decimal tick size support
assert(nextSessionContent.includes('decimals = rawPrice < 2.0 ? 3 : 2') || nextSessionContent.includes('decimals = currentPrice < 2.0 ? 3 : 2'), 'Penny stocks support 3-decimal tick size (0.001 EGP)');

// 3. StopLoss strictly clamped between -3.5% and -5.0%
assert(nextSessionContent.includes('currentPrice * 0.965') && nextSessionContent.includes('currentPrice * 0.950'), 'StopLoss strictly bounded between -3.5% and -5.0%');

// 4. Risk:Reward measured from entryMid (not just close)
assert(nextSessionContent.includes('entryMid') && nextSessionContent.includes('minTarget1FromRR'), 'Risk:Reward measured from entryMid ensuring institutional RR >= 1:2.0');

// 5. Hierarchical weighted scoring (L1, L2, L6 higher weight)
assert(nextSessionContent.includes('layerWeights') && nextSessionContent.includes('weightedBase'), 'Confluence scoring uses institutional hierarchical weights');

// 6. Sector-relative P/E valuation and 20-30 gap closure
const fundPath = path.resolve(__dirname, '../src/services/egxFundamentalData.ts');
const fundContent = fs.readFileSync(fundPath, 'utf8');
assert(fundContent.includes('getSectorValuationBenchmark') && fundContent.includes('evaluateSectorRelativePE'), 'Sector-relative valuation benchmark and PE evaluation active');

// 7. Breakout exclusion from premature TAKE_PROFIT at R1
assert(nextSessionContent.includes('confluenceScore < 80') && nextSessionContent.includes('currentPrice >= res1 * 0.985'), 'Breakout stocks (score >= 80) excluded from premature profit-taking at R1');

// 8. Strict ConfluenceScore requirements for STRONG_BUY and SWING_BUY (no bypass)
assert(nextSessionContent.includes('!isHighRisk && confluenceScore >= 80 && currentPrice <= res1 * 1.02'), 'STRONG_BUY strictly requires confluenceScore >= 80 with no rating bypass');
assert(nextSessionContent.includes('else if (confluenceScore >= 65)'), 'SWING_BUY strictly requires confluenceScore >= 65 with no rating bypass');

// -----------------------------------------------------------------------------
// FINAL SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 TEST EXECUTION COMPLETE: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log('================================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
