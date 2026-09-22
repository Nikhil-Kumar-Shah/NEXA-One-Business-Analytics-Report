import assert from 'node:assert';
import {
  TOTAL_SECTIONS,
  REPORT_SECTIONS,
  getSectionById,
  getSectionByPath,
  getSectionIndex,
  getPreviousSection,
  getNextSection,
} from './src/config/reportSections.js';

console.log('--- Running NEXA One Report Shell Unit Tests ---');

// 1. Verify TOTAL_SECTIONS
assert.strictEqual(TOTAL_SECTIONS, 9, 'Total sections must be exactly 9');
assert.strictEqual(REPORT_SECTIONS.length, 9, 'REPORT_SECTIONS array must contain exactly 9 sections');
console.log('✓ Section count verified (9 sections)');

// 2. Verify exact section numbers and ordering
const expectedSections = [
  { id: 'executive-overview', number: '01', title: 'Executive Overview', path: '/report/executive-overview' },
  { id: 'data-methodology', number: '02', title: 'Data & Methodology', path: '/report/data-methodology' },
  { id: 'advertising-sales', number: '03', title: 'Advertising & Sales', path: '/report/advertising-sales' },
  { id: 'channel-analysis', number: '04', title: 'Channel Analysis', path: '/report/channel-analysis' },
  { id: 'customer-purchase-drivers', number: '05', title: 'Customer Purchase Drivers', path: '/report/customer-purchase-drivers' },
  { id: 'market-macro', number: '06', title: 'Market & Macro', path: '/report/market-macro' },
  { id: 'strategy-decision', number: '07', title: 'Strategy Decision', path: '/report/strategy-decision' },
  { id: 'recommendations', number: '08', title: 'Recommendations', path: '/report/recommendations' },
  { id: 'methodology-sources', number: '09', title: 'Methodology & Sources', path: '/report/methodology-sources' },
];

REPORT_SECTIONS.forEach((section, index) => {
  const exp = expectedSections[index];
  assert.strictEqual(section.id, exp.id, `Section ${index} ID mismatch`);
  assert.strictEqual(section.number, exp.number, `Section ${index} number mismatch`);
  assert.strictEqual(section.title, exp.title, `Section ${index} title mismatch`);
  assert.strictEqual(section.path, exp.path, `Section ${index} path mismatch`);
  assert.ok(section.icon, `Section ${index} icon must exist`);
});
console.log('✓ All 9 section titles, numbers, IDs, and paths match specification exactly');

// 3. Verify getSectionById
expectedSections.forEach((exp) => {
  const found = getSectionById(exp.id);
  assert.strictEqual(found.id, exp.id);
  assert.strictEqual(found.title, exp.title);
});
// Verify aliases
assert.strictEqual(getSectionById('executive-summary').id, 'executive-overview');
assert.strictEqual(getSectionById('strategic-direction').id, 'strategy-decision');
console.log('✓ getSectionById works for all sections and aliases');

// 4. Verify getSectionByPath
expectedSections.forEach((exp) => {
  const found = getSectionByPath(exp.path);
  assert.strictEqual(found.id, exp.id);
  assert.strictEqual(found.path, exp.path);

  // Test trailing slash tolerance
  const foundWithSlash = getSectionByPath(exp.path + '/');
  assert.strictEqual(foundWithSlash.id, exp.id);
});
assert.strictEqual(getSectionByPath('/report').id, 'executive-overview');
assert.strictEqual(getSectionByPath('/report/executive-summary').id, 'executive-overview');
assert.strictEqual(getSectionByPath('/report/strategic-direction').id, 'strategy-decision');
console.log('✓ getSectionByPath works with, without trailing slash, and for aliases');

// 5. Verify Progress calculation
REPORT_SECTIONS.forEach((section, index) => {
  const idx = getSectionIndex(section.id);
  assert.strictEqual(idx, index);
  const currentStep = idx + 1;
  const progressPercent = Math.round((currentStep / TOTAL_SECTIONS) * 100);
  assert.strictEqual(currentStep, index + 1);
  assert.ok(progressPercent >= 11 && progressPercent <= 100);
});
console.log('✓ Progress calculations: 01 -> 1/9 (11%), 02 -> 2/9 (22%), ... 09 -> 9/9 (100%)');

// 6. Verify Previous / Next Section navigation links
// First section: Previous must be null, Next must be 02
const firstPrev = getPreviousSection('executive-overview');
const firstNext = getNextSection('executive-overview');
assert.strictEqual(firstPrev, null, 'First section previous must be null');
assert.strictEqual(firstNext.id, 'data-methodology', 'First section next must be 02');

// Middle section (05): Previous must be 04, Next must be 06
const midPrev = getPreviousSection('customer-purchase-drivers');
const midNext = getNextSection('customer-purchase-drivers');
assert.strictEqual(midPrev.id, 'channel-analysis');
assert.strictEqual(midNext.id, 'market-macro');

// Final section (09): Previous must be 08, Next must be null
const lastPrev = getPreviousSection('methodology-sources');
const lastNext = getNextSection('methodology-sources');
assert.strictEqual(lastPrev.id, 'recommendations');
assert.strictEqual(lastNext, null, 'Last section next must be null');
console.log('✓ Previous/Next chained sequence verified from 01 through 09 with proper boundaries');

// 7. Phase 5: Executive Overview Data Validation Tests
import { validateOverviewData, DataIntegrityError } from './src/services/api.js';

const mockValidOverview = {
  dataset: { market_count: 200, channels: ['TV', 'Social Media', 'Print'], total_sales: 2804.5, mean_sales: 14.0225 },
  model: {
    r_squared: 0.897210638178952,
    adjusted_r_squared: 0.896167091358434,
    f_statistic: 570.27,
    model_p_value: 1e-96,
  },
  correlations: {
    tv_sales: 0.782224424861606,
    social_media_sales: 0.576222574571055,
    print_sales: 0.228299026376165,
  },
  data_quality: { status: 'PASS', observations: 200 },
};

const mockValidRegression = {
  coefficients: [
    { variable: 'TV Ads', coefficient: 0.0457646 },
    { variable: 'Social Media Ads', coefficient: 0.18853 },
    { variable: 'Print Ads', coefficient: -0.001037 },
  ],
};

assert.strictEqual(validateOverviewData(mockValidOverview, mockValidRegression), true);
console.log('✓ Phase 5: Valid overview and regression data passes integrity verification');

// Test failure on incorrect observations
assert.throws(() => {
  validateOverviewData({ ...mockValidOverview, dataset: { market_count: 199 } }, mockValidRegression);
}, DataIntegrityError);
console.log('✓ Phase 5: DataIntegrityError raised on observation count deviation');

// Test failure on deviated correlation
assert.throws(() => {
  validateOverviewData({
    ...mockValidOverview,
    correlations: { ...mockValidOverview.correlations, tv_sales: 0.5 },
  }, mockValidRegression);
}, DataIntegrityError);
console.log('✓ Phase 5: DataIntegrityError raised on correlation deviation');

// 8. Phase 6: Advertising & Sales Data Validation Tests
import { validateAdvertisingData } from './src/services/api.js';

const mockValidAdv = {
  total_observations: 200,
  observations: Array.from({ length: 200 }, (_, i) => ({
    market_number: i + 1,
    tv_ads: 100 + i,
    social_media_ads: 20 + (i % 30),
    print_ads: 10 + (i % 20),
    sales: 10 + (i % 15),
    total_advertising: 130 + i,
    row_review_status: 'OK',
  })),
  descriptive_statistics: [{ metric: 'Mean', tv_ads: 147.04 }],
};

const mockValidCorr = {
  matrix: {
    'TV Ads': { 'Sales': 0.782224424861606 },
    'Social Media Ads': { 'Sales': 0.576222574571055 },
    'Print Ads': { 'Sales': 0.228299026376165 },
  },
};

const mockValidReg = {
  model: {
    r_squared: 0.897210638178952,
    adjusted_r_squared: 0.896167091358434,
  },
  coefficients: [
    { variable: 'TV Ads', coefficient: 0.04576 },
    { variable: 'Social Media Ads', coefficient: 0.18853 },
    { variable: 'Print Ads', coefficient: -0.00104 },
  ],
};

assert.strictEqual(validateAdvertisingData(mockValidAdv, mockValidCorr, mockValidReg), true);
console.log('✓ Phase 6: Valid advertising, correlation, and regression dataset passes validation');

// Test failure on observations count mismatch
assert.throws(() => {
  validateAdvertisingData({ ...mockValidAdv, total_observations: 195 }, mockValidCorr, mockValidReg);
}, DataIntegrityError);
console.log('✓ Phase 6: DataIntegrityError raised on observation count deviation in advertising dataset');

// Test failure on R² deviation
assert.throws(() => {
  validateAdvertisingData(mockValidAdv, mockValidCorr, {
    ...mockValidReg,
    model: { ...mockValidReg.model, r_squared: 0.75 },
  });
}, DataIntegrityError);
// 9. Phase 7: Channel Analysis Data Validation Tests
import { validateChannelData } from './src/services/api.js';

const mockValidChannelResponse = {
  channels: [
    {
      channel_name: 'TV',
      variable_name: 'tv_ads',
      sales_correlation: 0.782224424861606,
      regression_coefficient: 0.0457646,
      standard_error: 0.00139,
      t_statistic: 32.81,
      p_value: 1.58e-35,
      ci_lower: 0.0430,
      ci_upper: 0.0485,
    },
    {
      channel_name: 'Social Media',
      variable_name: 'social_media_ads',
      sales_correlation: 0.576222574571055,
      regression_coefficient: 0.18853,
      standard_error: 0.00861,
      t_statistic: 21.89,
      p_value: 9.77e-28,
      ci_lower: 0.1715,
      ci_upper: 0.2055,
    },
    {
      channel_name: 'Print',
      variable_name: 'print_ads',
      sales_correlation: 0.228299026376165,
      regression_coefficient: -0.001037,
      standard_error: 0.00587,
      t_statistic: -0.18,
      p_value: 0.8599,
      ci_lower: -0.0126,
      ci_upper: 0.0105,
    },
  ],
};

assert.strictEqual(validateChannelData(mockValidChannelResponse, mockValidAdv, mockValidReg), true);
console.log('✓ Phase 7: Valid channel analysis dataset passes validation');

// Test failure when missing channels
assert.throws(() => {
  validateChannelData({ channels: mockValidChannelResponse.channels.slice(0, 2) }, mockValidAdv, mockValidReg);
}, DataIntegrityError);
console.log('✓ Phase 7: DataIntegrityError raised when channel count is not 3');

// Test failure when TV correlation deviates
assert.throws(() => {
  const badTV = {
    channels: [
      { ...mockValidChannelResponse.channels[0], sales_correlation: 0.5 },
      mockValidChannelResponse.channels[1],
      mockValidChannelResponse.channels[2],
    ],
  };
  validateChannelData(badTV, mockValidAdv, mockValidReg);
}, DataIntegrityError);
console.log('✓ Phase 7: DataIntegrityError raised on TV correlation deviation');

// Test failure when Print Ads is incorrectly marked as significant (p <= 0.05)
assert.throws(() => {
  const badPrint = {
    channels: [
      mockValidChannelResponse.channels[0],
      mockValidChannelResponse.channels[1],
      { ...mockValidChannelResponse.channels[2], p_value: 0.01 },
    ],
  };
  validateChannelData(badPrint, mockValidAdv, mockValidReg);
}, DataIntegrityError);
console.log('✓ Phase 7: DataIntegrityError raised if Print Ads p-value is significant');

// 10. Phase 8: Customer Drivers Data Validation Tests
import { validateCustomerDriversData } from './src/services/api.js';

const mockValidCustomerDrivers = {
  total_evidence_records: 57,
  research_evidence: Array.from({ length: 57 }, (_, i) => ({
    source: `Source ${i % 10}`,
    year: 2020 + (i % 5),
    geography: i % 5 === 0 ? 'India' : 'Global',
    purchase_factor: 'Sound quality',
    reported_value: 60 + (i % 10),
    measure: '% respondents',
    evidence_type: 'Quantitative survey',
    research_note: 'Validated research note',
  })),
  source_register: Array.from({ length: 10 }, (_, i) => ({
    source: `Source ${i + 1}`,
    publication_year: 2019 + i,
    publisher: `Publisher ${i + 1}`,
    what_it_contributes: 'Survey on wireless headphones',
  })),
  factor_synthesis: [
    { factor: 'Sound quality', quantitative_observations: 4, qualitative_support: 'Yes' },
    { factor: 'Battery life', quantitative_observations: 3, qualitative_support: 'Yes' },
  ],
};

assert.strictEqual(validateCustomerDriversData(mockValidCustomerDrivers), true);
console.log('✓ Phase 8: Valid customer drivers dataset passes validation');

// Test failure when evidence count is not 57
assert.throws(() => {
  validateCustomerDriversData({
    ...mockValidCustomerDrivers,
    total_evidence_records: 56,
  });
}, DataIntegrityError);
console.log('✓ Phase 8: DataIntegrityError raised on evidence count mismatch');

// Test failure when source register length is not 10
assert.throws(() => {
  validateCustomerDriversData({
    ...mockValidCustomerDrivers,
    source_register: mockValidCustomerDrivers.source_register.slice(0, 9),
  });
}, DataIntegrityError);
console.log('✓ Phase 8: DataIntegrityError raised on source register length mismatch');

// Test failure when factor synthesis is empty
assert.throws(() => {
  validateCustomerDriversData({
    ...mockValidCustomerDrivers,
    factor_synthesis: [],
  });
}, DataIntegrityError);
console.log('✓ Phase 8: DataIntegrityError raised when factor synthesis is empty');

// 11. Phase 9: Market & Macro Environment Data Validation Tests
import { validateMarketTrendsData } from './src/services/api.js';

const mockValidMarketTrends = {
  total_evidence_records: 38,
  market_evidence: Array.from({ length: 38 }, (_, i) => ({
    source: `Source ${i % 9}`,
    year: 2026,
    geography: i % 2 === 0 ? 'India' : 'Global',
    market_sector: 'TWS market',
    indicator: 'Market growth',
    reported_value: 12,
    measure: '% YoY',
    evidence_type: 'Market tracker',
    research_note: 'Validated market note',
  })),
  source_register: Array.from({ length: 9 }, (_, i) => ({
    source: `Source ${i + 1}`,
    publication_year: 2026,
    publisher: `Publisher ${i + 1}`,
    what_it_contributes: 'Market tracker contribution',
  })),
  trend_synthesis: Array.from({ length: 8 }, (_, i) => ({
    trend_area: `Trend Area ${i + 1}`,
    direction: 'Expanding',
    observed_signal: 'Observed market signal',
  })),
};

assert.strictEqual(validateMarketTrendsData(mockValidMarketTrends), true);
console.log('✓ Phase 9: Valid market trends dataset passes validation');

// Test failure when evidence count is not 38
assert.throws(() => {
  validateMarketTrendsData({
    ...mockValidMarketTrends,
    total_evidence_records: 37,
  });
}, DataIntegrityError);
console.log('✓ Phase 9: DataIntegrityError raised on evidence count mismatch');

// Test failure when source register length is not 9
assert.throws(() => {
  validateMarketTrendsData({
    ...mockValidMarketTrends,
    source_register: mockValidMarketTrends.source_register.slice(0, 8),
  });
}, DataIntegrityError);
console.log('✓ Phase 9: DataIntegrityError raised on source register length mismatch');

// Test failure when trend synthesis length is not 8
assert.throws(() => {
  validateMarketTrendsData({
    ...mockValidMarketTrends,
    trend_synthesis: mockValidMarketTrends.trend_synthesis.slice(0, 7),
  });
}, DataIntegrityError);
console.log('✓ Phase 9: DataIntegrityError raised on trend synthesis length mismatch');

// 12. Phase 10: Strategy Decision Data Validation Tests
import { validateStrategyData } from './src/services/api.js';

const mockValidStrategy = {
  advertising_evidence: {
    sample_size: 200,
    r_squared: 0.897210638178952,
    adjusted_r_squared: 0.896167091358434,
  },
  channel_evidence: [
    {
      channel: 'TV',
      variable: 'tv_ads',
      sales_correlation: 0.782224424861606,
      coefficient: 0.0457646,
      p_value: 1.58e-35,
    },
    {
      channel: 'Social Media',
      variable: 'social_media_ads',
      sales_correlation: 0.576222574571055,
      coefficient: 0.18853,
      p_value: 9.77e-28,
    },
    {
      channel: 'Print',
      variable: 'print_ads',
      sales_correlation: 0.228299026376165,
      coefficient: -0.001037,
      p_value: 0.8599,
    },
  ],
};

assert.strictEqual(
  validateStrategyData(mockValidStrategy, mockValidCustomerDrivers, mockValidMarketTrends),
  true
);
console.log('✓ Phase 10: Valid strategy decision dataset passes validation');

// Test failure when sample size is not 200
assert.throws(() => {
  validateStrategyData(
    {
      ...mockValidStrategy,
      advertising_evidence: { ...mockValidStrategy.advertising_evidence, sample_size: 199 },
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 10: DataIntegrityError raised on sample size deviation in strategy data');

// Test failure when R² deviates
assert.throws(() => {
  validateStrategyData(
    {
      ...mockValidStrategy,
      advertising_evidence: { ...mockValidStrategy.advertising_evidence, r_squared: 0.75 },
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 10: DataIntegrityError raised on R² deviation in strategy data');

// Test failure when Print Ads is significant
assert.throws(() => {
  const badPrintStrategy = {
    ...mockValidStrategy,
    channel_evidence: [
      mockValidStrategy.channel_evidence[0],
      mockValidStrategy.channel_evidence[1],
      { ...mockValidStrategy.channel_evidence[2], p_value: 0.01 },
    ],
  };
  validateStrategyData(badPrintStrategy, mockValidCustomerDrivers, mockValidMarketTrends);
}, DataIntegrityError);
console.log('✓ Phase 10: DataIntegrityError raised if Print Ads is marked significant');

// Test failure when customer evidence count != 57
assert.throws(() => {
  validateStrategyData(
    mockValidStrategy,
    { ...mockValidCustomerDrivers, total_evidence_records: 55 },
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 10: DataIntegrityError raised on customer evidence count mismatch in strategy');

// Test failure when market evidence count != 38
assert.throws(() => {
  validateStrategyData(
    mockValidStrategy,
    mockValidCustomerDrivers,
    { ...mockValidMarketTrends, total_evidence_records: 30 }
  );
}, DataIntegrityError);
console.log('✓ Phase 10: DataIntegrityError raised on market evidence count mismatch in strategy');

// 13. Phase 11: Recommendations & Action Plan Data Validation Tests
import { validateRecommendationsData } from './src/services/api.js';

const mockValidRecData = {
  ...mockValidStrategy,
  recommendations: [
    { id: 'R01', title: 'Maintain Strong Attention on TV' },
    { id: 'R02', title: 'Maintain Strong Attention on Social Media' },
    { id: 'R03', title: 'Reconsider Print Investment' },
    { id: 'R04', title: 'Build Product-Centered Messaging' },
    { id: 'R05', title: 'Make Value Explicit' },
    { id: 'R06', title: 'Test Before Major Budget Reallocation' },
    { id: 'R07', title: 'Monitor Emerging Open-Ear Competition' },
    { id: 'R08', title: 'Monitor Affordability and Supply-Chain Conditions' },
    { id: 'R09', title: 'Use a Recurring Evidence Review' },
  ],
  action_plan_phases: [
    { phase: 'PHASE A', title: 'Immediate Planning' },
    { phase: 'PHASE B', title: 'Campaign Preparation' },
    { phase: 'PHASE C', title: 'Campaign Execution' },
    { phase: 'PHASE D', title: 'Performance Review' },
    { phase: 'PHASE E', title: 'Next Allocation Decision' },
  ],
  action_plan_table: [
    { action: 'Review channel evidence' },
    { action: 'Design controlled channel tests' },
    { action: 'Develop product-value messaging' },
    { action: 'Launch measured campaigns' },
    { action: 'Review incremental performance' },
    { action: 'Update strategy' },
  ],
  measurement_hierarchy: [
    { level: 'LEVEL 1', title: 'Business Outcome' },
    { level: 'LEVEL 2', title: 'Channel Performance' },
    { level: 'LEVEL 3', title: 'Message Response' },
    { level: 'LEVEL 4', title: 'Market Context' },
    { level: 'LEVEL 5', title: 'Decision Quality' },
  ],
  management_checklist: Array.from({ length: 10 }, (_, i) => `Checklist item ${i + 1}`),
  avoid_decisions: Array.from({ length: 7 }, (_, i) => `Avoid decision ${i + 1}`),
};

assert.strictEqual(
  validateRecommendationsData(mockValidRecData, mockValidCustomerDrivers, mockValidMarketTrends),
  true
);
console.log('✓ Phase 11: Valid recommendations & action plan dataset passes validation');

// Test failure when recommendations count != 9
assert.throws(() => {
  validateRecommendationsData(
    {
      ...mockValidRecData,
      recommendations: mockValidRecData.recommendations.slice(0, 8),
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 11: DataIntegrityError raised on recommendation count mismatch');

// Test failure when recommendation ID order is wrong
assert.throws(() => {
  const badIdRecs = [...mockValidRecData.recommendations];
  badIdRecs[0] = { id: 'R99', title: 'Invalid ID' };
  validateRecommendationsData(
    {
      ...mockValidRecData,
      recommendations: badIdRecs,
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 11: DataIntegrityError raised on recommendation ID sequence mismatch');

// Test failure when action plan phases != 5
assert.throws(() => {
  validateRecommendationsData(
    {
      ...mockValidRecData,
      action_plan_phases: mockValidRecData.action_plan_phases.slice(0, 4),
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 11: DataIntegrityError raised on action plan phases mismatch');

// Test failure when action plan table rows != 6
assert.throws(() => {
  validateRecommendationsData(
    {
      ...mockValidRecData,
      action_plan_table: mockValidRecData.action_plan_table.slice(0, 5),
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 11: DataIntegrityError raised on action plan table rows mismatch');

// Test failure when measurement hierarchy != 5
assert.throws(() => {
  validateRecommendationsData(
    {
      ...mockValidRecData,
      measurement_hierarchy: mockValidRecData.measurement_hierarchy.slice(0, 4),
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 11: DataIntegrityError raised on measurement hierarchy levels mismatch');

// Test failure when management checklist != 10
assert.throws(() => {
  validateRecommendationsData(
    {
      ...mockValidRecData,
      management_checklist: mockValidRecData.management_checklist.slice(0, 9),
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 11: DataIntegrityError raised on management checklist count mismatch');

// Test failure when avoid decisions != 7
assert.throws(() => {
  validateRecommendationsData(
    {
      ...mockValidRecData,
      avoid_decisions: mockValidRecData.avoid_decisions.slice(0, 6),
    },
    mockValidCustomerDrivers,
    mockValidMarketTrends
  );
}, DataIntegrityError);
console.log('✓ Phase 11: DataIntegrityError raised on avoid decisions count mismatch');

// 14. Phase 12: Data & Methodology and Methodology Sources Data Validation Tests
import {
  validateDataMethodologyData,
  validateMethodologySourcesData,
} from './src/services/api.js';

const mockQuality = {
  status: 'PASS',
  metrics: {
    total_observations: 200,
    missing_values_count: 0,
    duplicate_rows_count: 0,
    outliers_flagged: 2,
  },
};

const mockSources = {
  total_sources: 20,
  sources: Array.from({ length: 20 }, (_, i) => ({
    source_id: `SRC-${i + 1}`,
    source_name: `Source Authority ${i + 1}`,
    publisher: `Publisher ${i + 1}`,
    dataset_domain: i === 0 ? 'Advertising Analytics' : i < 11 ? 'Customer Research' : 'Market & Macro',
    source_workbook: `Workbook_${i + 1}.xlsx`,
    source_sheet: 'Sheet1',
    what_it_contributes: 'Analytical empirical contribution',
  })),
};

assert.strictEqual(validateDataMethodologyData(mockQuality, mockValidAdv, mockValidReg), true);
console.log('✓ Phase 12: Valid data methodology dataset passes validation');

assert.strictEqual(validateMethodologySourcesData(mockSources), true);
console.log('✓ Phase 12: Valid methodology sources dataset passes validation (20 sources)');

// Test failure when data quality observations != 200
assert.throws(() => {
  validateDataMethodologyData(
    { ...mockQuality, metrics: { ...mockQuality.metrics, total_observations: 198 } },
    mockValidAdv,
    mockValidReg
  );
}, DataIntegrityError);
console.log('✓ Phase 12: DataIntegrityError raised on observation count mismatch in data quality');

// Test failure when missing values > 0
assert.throws(() => {
  validateDataMethodologyData(
    { ...mockQuality, metrics: { ...mockQuality.metrics, missing_values_count: 1 } },
    mockValidAdv,
    mockValidReg
  );
}, DataIntegrityError);
console.log('✓ Phase 12: DataIntegrityError raised when missing values are present');

// Test failure when sources count != 20
assert.throws(() => {
  validateMethodologySourcesData({
    total_sources: 19,
    sources: mockSources.sources.slice(0, 19),
  });
}, DataIntegrityError);
console.log('✓ Phase 12: DataIntegrityError raised when sources count != 20');

console.log('ALL UNIT TESTS PASSED SUCCESSFULLY (100%)');








