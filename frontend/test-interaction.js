import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Verifying NEXA One Phase 10 / Interaction Requirements ---');

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

// 1. Shared Table Interaction
const dataTableJsx = fs.readFileSync(path.join(__dirname, 'src/components/tables/DataTable.jsx'), 'utf-8');
const dataTableCss = fs.readFileSync(path.join(__dirname, 'src/components/tables/DataTable.css'), 'utf-8');
assert(dataTableJsx.includes('onRowClick'), 'DataTable supports onRowClick callback');
assert(dataTableJsx.includes('highlightRow'), 'DataTable supports highlightRow prop');
assert(dataTableJsx.includes('onKeyDown') && dataTableJsx.includes('Enter') && dataTableJsx.includes(' '), 'DataTable rows support keyboard accessibility');
assert(dataTableCss.includes('.report-table tr.is-clickable'), 'DataTable CSS has is-clickable styling');
assert(dataTableCss.includes('.report-table tr.highlight-row'), 'DataTable CSS has highlight-row active state');

// 2. Section 03: Advertising & Sales Interaction
const advViewJsx = fs.readFileSync(path.join(__dirname, 'src/views/advertising/AdvertisingSalesView.jsx'), 'utf-8');
const advViewCss = fs.readFileSync(path.join(__dirname, 'src/views/advertising/AdvertisingSalesView.css'), 'utf-8');
const scatterJsx = fs.readFileSync(path.join(__dirname, 'src/views/advertising/ScatterPlot.jsx'), 'utf-8');
const scatterCss = fs.readFileSync(path.join(__dirname, 'src/views/advertising/ScatterPlot.css'), 'utf-8');

assert(advViewJsx.includes('Explore the relationship'), 'Section 03 has "Explore the relationship" heading');
assert(advViewJsx.includes('useSearchParams'), 'Section 03 synchronizes channel state with URL search params');
assert(advViewJsx.includes("'all'") && advViewJsx.includes("'tv'") && advViewJsx.includes("'social'") && advViewJsx.includes("'print'"), 'Section 03 supports All, TV, Social Media, and Print channel options');
assert(advViewJsx.includes('Correlation does not establish causation'), 'Section 03 retains non-causal statistical warning');
assert(advViewJsx.includes('rel-evidence-card'), 'Section 03 features dynamic statistical evidence card updating on channel switch');

assert(scatterJsx.includes('Market #'), 'Scatter plot tooltip includes Market #');
assert(scatterJsx.includes('TV Ads') && scatterJsx.includes('Social Media Ads') && scatterJsx.includes('Print Ads') && scatterJsx.includes('Total Advertising') && scatterJsx.includes('Observed Sales'), 'Scatter plot tooltip includes all required observation fields');
assert(scatterJsx.includes('onPointSelect') || scatterJsx.includes('selectedPoint'), 'Scatter plot supports point click selection');
assert(scatterJsx.includes('Observation details'), 'Scatter plot displays Observation details card on selection');
assert(scatterCss.includes('.scatter-point-selected') || scatterCss.includes('.scatter-point-selection-ring'), 'Scatter plot has visual selection ring');

// 3. Section 04: Channel Analysis Interaction
const channelViewJsx = fs.readFileSync(path.join(__dirname, 'src/views/channels/ChannelAnalysisView.jsx'), 'utf-8');
assert(channelViewJsx.includes('Channel Evidence Explorer'), 'Section 04 includes Channel Evidence Explorer');
assert(channelViewJsx.includes('selectedChannel') && channelViewJsx.includes('onRowClick'), 'Section 04 synchronizes table selection with channel explorer');
assert(channelViewJsx.includes('Pearson correlation') && channelViewJsx.includes('Regression coefficient') && channelViewJsx.includes('p-value'), 'Section 04 displays dynamic statistical evidence from backend');
assert(!channelViewJsx.includes('efficiency score') && !channelViewJsx.includes('channel ranking') && !channelViewJsx.includes('winner'), 'Section 04 avoids subjective channel scores or rankings');

// 4. Section 05: Customer Purchase Drivers Interaction
const customerViewJsx = fs.readFileSync(path.join(__dirname, 'src/views/customer/CustomerDriversView.jsx'), 'utf-8');
assert(customerViewJsx.includes('Research Explorer'), 'Section 05 includes Research Explorer');
assert(customerViewJsx.includes('factorFilter') && customerViewJsx.includes('geoFilter') && customerViewJsx.includes('yearFilter') && customerViewJsx.includes('sourceFilter'), 'Section 05 supports Factor, Geography, Year, and Source filters');
assert(customerViewJsx.includes('total_evidence_records'), 'Section 05 displays total evidence baseline from validated service');
assert(customerViewJsx.includes('ResearchEvidenceCard'), 'Section 05 provides Customer Evidence Card on row selection');
assert(customerViewJsx.includes('single pooled customer preference score') || customerViewJsx.includes('not statistically pooled'), 'Section 05 retains research methodology and pooling warning');

// 5. Section 06: Market & Macro Interaction
const marketViewJsx = fs.readFileSync(path.join(__dirname, 'src/views/market/MarketMacroView.jsx'), 'utf-8');
assert(marketViewJsx.includes('Market Evidence Explorer'), 'Section 06 includes Market Evidence Explorer');
assert(marketViewJsx.includes('themeFilter') && marketViewJsx.includes('sourceFilter') && marketViewJsx.includes('yearFilter') && marketViewJsx.includes('typeFilter'), 'Section 06 supports Theme, Source, Year, and Type filters');
assert(marketViewJsx.includes('38') || marketViewJsx.includes('total_evidence_records'), 'Section 06 displays total observation baseline of 38');
assert(marketViewJsx.includes('Category Proxy') && marketViewJsx.includes('Direct Evidence'), 'Section 06 distinguishes category proxy vs direct evidence');
assert(marketViewJsx.includes('Methodological Proxy Rule') || marketViewJsx.includes('mm-proxy-warning-banner'), 'Section 06 retains proxy warning');

// 6. Section 07: Strategy Interaction
const strategyViewJsx = fs.readFileSync(path.join(__dirname, 'src/views/strategy/StrategyDecisionView.jsx'), 'utf-8');
assert(strategyViewJsx.includes('Evidence Lens'), 'Section 07 includes Evidence Lens');
assert(strategyViewJsx.includes('advertising') && strategyViewJsx.includes('customer') && strategyViewJsx.includes('market'), 'Section 07 allows inspecting Advertising, Customer, and Market evidence lenses');
assert(!strategyViewJsx.includes('simulate') && !strategyViewJsx.includes('Expected sales =') && !strategyViewJsx.includes('ROI ='), 'Section 07 prohibits fake simulation games or unvalidated ROI formulas');

// 7. Section 09: Methodology & Sources Interaction
const sourcesViewJsx = fs.readFileSync(path.join(__dirname, 'src/views/methodology/MethodologySourcesView.jsx'), 'utf-8');
assert(sourcesViewJsx.includes('ms-registry-controls'), 'Section 09 includes Source Explorer filter controls');
assert(sourcesViewJsx.includes('yearFilter'), 'Section 09 includes Year filter select');
assert(sourcesViewJsx.includes('searchTerm') && sourcesViewJsx.includes('domainFilter'), 'Section 09 supports search query and domain filtering');

console.log(`\nPhase 10 Interaction Check: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
