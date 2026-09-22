import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Verifying NEXA One Professional Report Navigation Architecture ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ ${message}`);
    failed++;
  }
}

// 1. Verify ScrollToTop exists and is mounted in App.jsx
const appContent = fs.readFileSync(path.join(__dirname, 'src/App.jsx'), 'utf-8');
assert(appContent.includes('<ScrollToTop />'), 'ScrollToTop is mounted inside App.jsx');

const scrollToTopContent = fs.readFileSync(path.join(__dirname, 'src/components/common/ScrollToTop.jsx'), 'utf-8');
assert(scrollToTopContent.includes("behavior: 'instant'") || scrollToTopContent.includes('behavior: "instant"'), 'ScrollToTop uses instant scroll on route change');
assert(scrollToTopContent.includes("behavior: 'smooth'") || scrollToTopContent.includes('behavior: "smooth"'), 'ScrollToTop uses smooth scroll for same-page anchors');

// 2. Verify single report navigation: Persistent Left Sidebar with 9 sections
const sidebarContent = fs.readFileSync(path.join(__dirname, 'src/components/report/ReportSidebar.jsx'), 'utf-8');
assert(sidebarContent.includes('REPORT_SECTIONS'), 'ReportSidebar maps all 9 REPORT_SECTIONS');
assert(sidebarContent.includes('REPORT'), 'ReportSidebar contains the REPORT category kicker');
assert(sidebarContent.includes('sidebar-nav-num'), 'ReportSidebar renders prominent section numbers');

// 3. Verify minimal Top Header without Overview / Analysis / Strategy / Sources
const topNavContent = fs.readFileSync(path.join(__dirname, 'src/components/report/ReportTopNav.jsx'), 'utf-8');
assert(!topNavContent.includes('>Overview<'), 'No Overview primary navigation in top nav');
assert(!topNavContent.includes('>Analysis<'), 'No Analysis primary navigation in top nav');
assert(!topNavContent.includes('>Strategy<'), 'No Strategy primary navigation in top nav');
assert(!topNavContent.includes('>Sources<'), 'No Sources primary navigation in top nav');
assert(!topNavContent.includes('Sign In') && !topNavContent.includes('Get Started'), 'No marketing / SaaS landing buttons in top nav');
assert(topNavContent.includes('Jump to section') || topNavContent.includes('Search report'), 'Top header includes Search / Jump to section utility');

// 4. Verify Search Modal utility coverage
const searchModalContent = fs.readFileSync(path.join(__dirname, 'src/components/report/ReportSearchModal.jsx'), 'utf-8');
assert(searchModalContent.includes('REPORT_SECTIONS'), 'Search utility indexes report sections');
assert(searchModalContent.includes('Q1 —') && searchModalContent.includes('Q5 —'), 'Search utility indexes analytical questions');
assert(searchModalContent.includes('Qualcomm') && searchModalContent.includes('Counterpoint'), 'Search utility indexes research authorities / sources');

// 5. Verify ReportShell integrates Left Sidebar + Main Viewport
const shellContent = fs.readFileSync(path.join(__dirname, 'src/components/report/ReportShell.jsx'), 'utf-8');
assert(shellContent.includes('<ReportSidebar'), 'ReportShell mounts persistent Left ReportSidebar');
assert(shellContent.includes('<ReportTopNav'), 'ReportShell mounts minimal ReportTopNav');
assert(shellContent.includes('<LocalSectionNav'), 'ReportShell mounts contextual LocalSectionNav');
assert(shellContent.includes('<ReportSectionNav'), 'ReportShell mounts bottom Previous/Next ReportSectionNav');

// 6. Verify Tokens, Dimensions, and Typography
const tokensContent = fs.readFileSync(path.join(__dirname, 'src/styles/tokens.css'), 'utf-8');
assert(tokensContent.includes('--sidebar-width: 250px;'), 'Sidebar width set to 250px (230-260px target)');
assert(/--header-height:\s*(60px|64px);/.test(tokensContent), 'Header height within 60-68px');
assert(tokensContent.includes('--content-max-width: 1200px;'), 'Content max-width set to 1200px');
assert(tokensContent.includes('--reading-width: 720px;'), 'Reading width set to 720px (680-760px target)');

// 7. Verify KPI dimensions and typography
const kpiContent = fs.readFileSync(path.join(__dirname, 'src/components/cards/KpiTile.css'), 'utf-8');
assert(kpiContent.includes('min-height: 110px') && kpiContent.includes('max-height: 145px'), 'KPI tile height controlled between 110-145px');

// 8. Verify ScatterPlot dimensions and chart constraints
const scatterContent = fs.readFileSync(path.join(__dirname, 'src/views/advertising/ScatterPlot.css'), 'utf-8');
assert(scatterContent.includes('max-height: 380px'), 'Scatter plot max height capped at 380px (340-380px target)');

const chartCardContent = fs.readFileSync(path.join(__dirname, 'src/components/charts/ChartCard.css'), 'utf-8');
assert(chartCardContent.includes('max-height: 420px'), 'Standard charts capped at max-height 420px');

// 9. Verify Question Mapping inside Section Header
const headerContent = fs.readFileSync(path.join(__dirname, 'src/components/report/ReportSectionHeader.jsx'), 'utf-8');
assert(headerContent.includes('Q1 — Is there a meaningful relationship between advertising expenditure and sales?'), 'Header includes Q1 mapping');
assert(headerContent.includes('Q2 — How do TV, social media and print compare in explaining sales?'), 'Header includes Q2 mapping');
assert(headerContent.includes('Q3 — What factors matter to customers when evaluating wireless headphones?'), 'Header includes Q3 mapping');
assert(headerContent.includes('Q4 — What market and macroeconomic conditions should NEXA One consider?'), 'Header includes Q4 mapping');
assert(headerContent.includes('Q5 — What marketing and advertising strategy should NEXA One consider for the next planning period?'), 'Header includes Q5 mapping');

// 10. Verify Local TOC mapping and anchor ID coverage
const viewFiles = [
  { file: 'src/views/overview/ExecutiveOverviewView.jsx', ids: ['overview', 'key-findings', 'model-evidence', 'customer-context', 'market-context', 'strategic-direction'] },
  { file: 'src/views/methodology/DataMethodologyView.jsx', ids: ['data-foundation', 'quality-audit', 'methodology', 'safeguards'] },
  { file: 'src/views/advertising/AdvertisingSalesView.jsx', ids: ['question', 'data-overview', 'advertising-spend', 'correlation', 'regression', 'interpretation', 'limitations'] },
  { file: 'src/views/channels/ChannelAnalysisView.jsx', ids: ['channel-evidence', 'correlation', 'regression', 'comparison', 'methodology', 'business-implications'] },
  { file: 'src/views/customer/CustomerDriversView.jsx', ids: ['research-scope', 'sound-quality', 'battery-life', 'comfort', 'price-value', 'call-quality', 'anc', 'supporting-factors', 'limitations'] },
  { file: 'src/views/market/MarketMacroView.jsx', ids: ['market', 'premiumization', 'tws-ows', 'affordability', 'macro', 'trade', 'supply-chain', 'manufacturing', 'synthesis', 'limitations'] },
  { file: 'src/views/strategy/StrategyDecisionView.jsx', ids: ['framework', 'positioning', 'market-watch', 'decision-logic', 'tradeoffs', 'risk-register', 'limitations'] },
  { file: 'src/views/recommendations/RecommendationsView.jsx', ids: ['core-actions', 'roadmap', 'measurement', 'governance', 'avoid-decisions', 'summary'] },
  { file: 'src/views/methodology/MethodologySourcesView.jsx', ids: ['source-register', 'traceability', 'coverage', 'boundaries'] },
];

for (const { file, ids } of viewFiles) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  for (const id of ids) {
    const hasId = content.includes(`id="${id}"`);
    assert(hasId, `View ${file} has anchor id="${id}"`);
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
