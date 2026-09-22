/**
 * API Service for NEXA One Analytical Backend
 */

export class DataIntegrityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataIntegrityError';
  }
}

/**
 * Validates the core overview dataset and regression metrics against validated tolerance limits.
 */
export function validateOverviewData(overview, regression) {
  if (!overview || !overview.dataset || !overview.model || !overview.correlations) {
    throw new DataIntegrityError('Overview API response is missing required data structure.');
  }

  // 1. Observations = 200
  if (overview.dataset.market_count !== 200) {
    throw new DataIntegrityError(
      `Observations validation failed: expected 200, received ${overview.dataset.market_count}`
    );
  }

  // 2. R² ~ 0.8972
  const r2 = overview.model.r_squared;
  if (Math.abs(r2 - 0.897210638178952) > 0.001) {
    throw new DataIntegrityError(
      `Model R² validation failed: expected ~0.8972, received ${r2}`
    );
  }

  // 3. Adjusted R² ~ 0.8962
  const adjR2 = overview.model.adjusted_r_squared;
  if (Math.abs(adjR2 - 0.896167091358434) > 0.001) {
    throw new DataIntegrityError(
      `Adjusted R² validation failed: expected ~0.8962, received ${adjR2}`
    );
  }

  // 4. TV correlation ~ 0.7822
  const tvCorr = overview.correlations.tv_sales;
  if (Math.abs(tvCorr - 0.782224424861606) > 0.001) {
    throw new DataIntegrityError(
      `TV correlation validation failed: expected ~0.7822, received ${tvCorr}`
    );
  }

  // 5. Social correlation ~ 0.5762
  const socialCorr = overview.correlations.social_media_sales;
  if (Math.abs(socialCorr - 0.576222574571055) > 0.001) {
    throw new DataIntegrityError(
      `Social Media correlation validation failed: expected ~0.5762, received ${socialCorr}`
    );
  }

  // 6. Print correlation ~ 0.2283
  const printCorr = overview.correlations.print_sales;
  if (Math.abs(printCorr - 0.228299026376165) > 0.001) {
    throw new DataIntegrityError(
      `Print correlation validation failed: expected ~0.2283, received ${printCorr}`
    );
  }

  // 7. Regression coefficients validation if regression object provided
  if (regression && regression.coefficients) {
    const tvCoeff = regression.coefficients.find((c) => c.variable === 'TV Ads')?.coefficient;
    const socialCoeff = regression.coefficients.find((c) => c.variable === 'Social Media Ads')?.coefficient;
    const printCoeff = regression.coefficients.find((c) => c.variable === 'Print Ads')?.coefficient;

    if (tvCoeff !== undefined && Math.abs(tvCoeff - 0.04576) > 0.002) {
      throw new DataIntegrityError(`TV coefficient validation failed: received ${tvCoeff}`);
    }
    if (socialCoeff !== undefined && Math.abs(socialCoeff - 0.1885) > 0.002) {
      throw new DataIntegrityError(`Social Media coefficient validation failed: received ${socialCoeff}`);
    }
    if (printCoeff !== undefined && Math.abs(printCoeff - (-0.0010)) > 0.002) {
      throw new DataIntegrityError(`Print coefficient validation failed: received ${printCoeff}`);
    }
  }

  return true;
}

/**
 * Validates Q1 Advertising and Sales detailed datasets.
 */
export function validateAdvertisingData(advertising, correlation, regression) {
  if (!advertising || !advertising.observations || !advertising.descriptive_statistics) {
    throw new DataIntegrityError('Advertising API response is missing observations or descriptive statistics.');
  }

  if (advertising.total_observations !== 200 || advertising.observations.length !== 200) {
    throw new DataIntegrityError(
      `Observations count mismatch: expected 200, received total=${advertising.total_observations}, length=${advertising.observations?.length}`
    );
  }

  if (!correlation || !correlation.matrix) {
    throw new DataIntegrityError('Correlation API response is missing matrix.');
  }

  const tvCorr = correlation.matrix['TV Ads']?.['Sales'];
  const socialCorr = correlation.matrix['Social Media Ads']?.['Sales'];
  const printCorr = correlation.matrix['Print Ads']?.['Sales'];

  if (Math.abs(tvCorr - 0.782224424861606) > 0.001) {
    throw new DataIntegrityError(`TV correlation mismatch in correlation API: ${tvCorr}`);
  }
  if (Math.abs(socialCorr - 0.576222574571055) > 0.001) {
    throw new DataIntegrityError(`Social correlation mismatch in correlation API: ${socialCorr}`);
  }
  if (Math.abs(printCorr - 0.228299026376165) > 0.001) {
    throw new DataIntegrityError(`Print correlation mismatch in correlation API: ${printCorr}`);
  }

  if (!regression || !regression.model || !regression.coefficients) {
    throw new DataIntegrityError('Regression API response is missing model or coefficients.');
  }

  if (Math.abs(regression.model.r_squared - 0.897210638178952) > 0.001) {
    throw new DataIntegrityError(`R² mismatch in regression API: ${regression.model.r_squared}`);
  }
  if (Math.abs(regression.model.adjusted_r_squared - 0.896167091358434) > 0.001) {
    throw new DataIntegrityError(`Adjusted R² mismatch in regression API: ${regression.model.adjusted_r_squared}`);
  }

  return true;
}

/**
 * Validates Q2 Channel Analysis dataset.
 */
export function validateChannelData(channelData, advertising, regression) {
  if (!channelData || !channelData.channels || channelData.channels.length !== 3) {
    throw new DataIntegrityError('Channel API response is missing required 3 channels.');
  }

  const tv = channelData.channels.find((c) => c.channel_name === 'TV' || c.variable_name === 'tv_ads');
  const social = channelData.channels.find((c) => c.channel_name === 'Social Media' || c.variable_name === 'social_media_ads');
  const print = channelData.channels.find((c) => c.channel_name === 'Print' || c.variable_name === 'print_ads');

  if (!tv || !social || !print) {
    throw new DataIntegrityError('One or more required channels (TV, Social Media, Print) missing in channel API.');
  }

  // Check correlations
  if (Math.abs(tv.sales_correlation - 0.782224424861606) > 0.001) {
    throw new DataIntegrityError(`TV correlation mismatch: ${tv.sales_correlation}`);
  }
  if (Math.abs(social.sales_correlation - 0.576222574571055) > 0.001) {
    throw new DataIntegrityError(`Social correlation mismatch: ${social.sales_correlation}`);
  }
  if (Math.abs(print.sales_correlation - 0.228299026376165) > 0.001) {
    throw new DataIntegrityError(`Print correlation mismatch: ${print.sales_correlation}`);
  }

  // Check regression coefficients
  if (Math.abs(tv.regression_coefficient - 0.04576) > 0.002) {
    throw new DataIntegrityError(`TV regression coefficient mismatch: ${tv.regression_coefficient}`);
  }
  if (Math.abs(social.regression_coefficient - 0.18853) > 0.002) {
    throw new DataIntegrityError(`Social regression coefficient mismatch: ${social.regression_coefficient}`);
  }
  if (Math.abs(print.regression_coefficient - (-0.00104)) > 0.002) {
    throw new DataIntegrityError(`Print regression coefficient mismatch: ${print.regression_coefficient}`);
  }

  // Check Print is not statistically significant at alpha = 0.05
  if (print.p_value <= 0.05) {
    throw new DataIntegrityError(`Print p-value expected > 0.05, received ${print.p_value}`);
  }

  // Check TV and Social are statistically significant
  if (tv.p_value > 0.05 || social.p_value > 0.05) {
    throw new DataIntegrityError(`TV and Social expected p-value <= 0.05`);
  }

  // Check advertising observation count if provided
  if (advertising) {
    if (advertising.total_observations !== 200 || advertising.observations.length !== 200) {
      throw new DataIntegrityError(`Advertising dataset observation count expected 200, received ${advertising.total_observations}`);
    }
  }

  return true;
}

/**
 * Fetches executive overview and regression model data from FastAPI backend.
 */
export async function fetchExecutiveOverview() {
  const [overviewRes, regressionRes] = await Promise.all([
    fetch('/api/overview'),
    fetch('/api/regression'),
  ]);

  if (!overviewRes.ok) {
    throw new Error(`Overview API failed with HTTP status ${overviewRes.status}`);
  }
  if (!regressionRes.ok) {
    throw new Error(`Regression API failed with HTTP status ${regressionRes.status}`);
  }

  const overview = await overviewRes.json();
  const regression = await regressionRes.json();

  validateOverviewData(overview, regression);

  return {
    overview,
    regression,
  };
}

/**
 * Fetches complete Q1 Advertising and Sales detailed analytical dataset.
 */
export async function fetchAdvertisingAnalysis() {
  const [advRes, corrRes, regRes] = await Promise.all([
    fetch('/api/advertising'),
    fetch('/api/correlation'),
    fetch('/api/regression'),
  ]);

  if (!advRes.ok) {
    throw new Error(`Advertising API failed with HTTP status ${advRes.status}`);
  }
  if (!corrRes.ok) {
    throw new Error(`Correlation API failed with HTTP status ${corrRes.status}`);
  }
  if (!regRes.ok) {
    throw new Error(`Regression API failed with HTTP status ${regRes.status}`);
  }

  const advertising = await advRes.json();
  const correlation = await corrRes.json();
  const regression = await regRes.json();

  validateAdvertisingData(advertising, correlation, regression);

  return {
    advertising,
    correlation,
    regression,
  };
}

/**
 * Fetches complete Q2 Channel Analysis dataset.
 */
export async function fetchChannelAnalysis() {
  const [channelsRes, advRes, regRes] = await Promise.all([
    fetch('/api/channels'),
    fetch('/api/advertising'),
    fetch('/api/regression'),
  ]);

  if (!channelsRes.ok) {
    throw new Error(`Channels API failed with HTTP status ${channelsRes.status}`);
  }
  if (!advRes.ok) {
    throw new Error(`Advertising API failed with HTTP status ${advRes.status}`);
  }
  if (!regRes.ok) {
    throw new Error(`Regression API failed with HTTP status ${regRes.status}`);
  }

  const channelData = await channelsRes.json();
  const advertising = await advRes.json();
  const regression = await regRes.json();

  validateChannelData(channelData, advertising, regression);

  return {
    channelData,
    advertising,
    regression,
  };
}

/**
 * Validates Q3 Customer Purchase Drivers dataset.
 */
export function validateCustomerDriversData(data) {
  if (!data) {
    throw new DataIntegrityError('Customer drivers API returned empty response.');
  }

  if (data.total_evidence_records !== 57) {
    throw new DataIntegrityError(
      `Customer drivers total evidence count mismatch: expected 57, received ${data.total_evidence_records}`
    );
  }

  if (!data.research_evidence || data.research_evidence.length !== 57) {
    throw new DataIntegrityError(
      `Research evidence list length mismatch: expected 57 records, received ${data.research_evidence ? data.research_evidence.length : 0}`
    );
  }

  if (!data.source_register || data.source_register.length !== 10) {
    throw new DataIntegrityError(
      `Source register count mismatch: expected 10 sources, received ${data.source_register ? data.source_register.length : 0}`
    );
  }

  if (!data.factor_synthesis || data.factor_synthesis.length === 0) {
    throw new DataIntegrityError('Factor synthesis list is missing or empty.');
  }

  return true;
}

/**
 * Fetches complete Q3 Customer Purchase Drivers dataset.
 */
export async function fetchCustomerDrivers() {
  const response = await fetch('/api/customer-drivers');
  if (!response.ok) {
    throw new Error(`Customer drivers API failed with HTTP status ${response.status}`);
  }

  const data = await response.json();
  validateCustomerDriversData(data);
  return data;
}

/**
 * Validates Q4 Market and Macro Environment dataset.
 */
export function validateMarketTrendsData(data) {
  if (!data) {
    throw new DataIntegrityError('Market trends API returned empty response.');
  }

  if (data.total_evidence_records !== 38) {
    throw new DataIntegrityError(
      `Market trends total evidence count mismatch: expected 38, received ${data.total_evidence_records}`
    );
  }

  if (!data.market_evidence || data.market_evidence.length !== 38) {
    throw new DataIntegrityError(
      `Market evidence list length mismatch: expected 38 records, received ${data.market_evidence ? data.market_evidence.length : 0}`
    );
  }

  if (!data.source_register || data.source_register.length !== 9) {
    throw new DataIntegrityError(
      `Source register count mismatch: expected 9 sources, received ${data.source_register ? data.source_register.length : 0}`
    );
  }

  if (!data.trend_synthesis || data.trend_synthesis.length !== 8) {
    throw new DataIntegrityError(
      `Trend synthesis count mismatch: expected 8 trend areas, received ${data.trend_synthesis ? data.trend_synthesis.length : 0}`
    );
  }

  return true;
}

/**
 * Fetches complete Q4 Market and Macro Environment dataset.
 */
export async function fetchMarketTrends() {
  const response = await fetch('/api/market-trends');
  if (!response.ok) {
    throw new Error(`Market trends API failed with HTTP status ${response.status}`);
  }

  const data = await response.json();
  validateMarketTrendsData(data);
  return data;
}

/**
 * Validates Q5 Strategy Decision dataset.
 */
export function validateStrategyData(strategyData, customerData, marketData) {
  if (!strategyData || !strategyData.advertising_evidence || !strategyData.channel_evidence) {
    throw new DataIntegrityError('Strategy API returned invalid or empty structure.');
  }

  const adv = strategyData.advertising_evidence;
  if (adv.sample_size !== 200) {
    throw new DataIntegrityError(`Sample size mismatch: expected 200, received ${adv.sample_size}`);
  }

  if (Math.abs(adv.r_squared - 0.897210638178952) > 0.001) {
    throw new DataIntegrityError(`R² mismatch in strategy data: ${adv.r_squared}`);
  }

  if (strategyData.channel_evidence.length !== 3) {
    throw new DataIntegrityError(`Channel evidence count mismatch: expected 3, received ${strategyData.channel_evidence.length}`);
  }

  const tv = strategyData.channel_evidence.find((c) => c.channel === 'TV' || c.variable === 'tv_ads');
  const social = strategyData.channel_evidence.find((c) => c.channel === 'Social Media' || c.variable === 'social_media_ads');
  const print = strategyData.channel_evidence.find((c) => c.channel === 'Print' || c.variable === 'print_ads');

  if (!tv || !social || !print) {
    throw new DataIntegrityError('Missing TV, Social Media, or Print in strategy channel evidence.');
  }

  if (Math.abs(tv.sales_correlation - 0.782224424861606) > 0.002) {
    throw new DataIntegrityError(`TV correlation mismatch in strategy: ${tv.sales_correlation}`);
  }

  if (Math.abs(social.sales_correlation - 0.576222574571055) > 0.002) {
    throw new DataIntegrityError(`Social correlation mismatch in strategy: ${social.sales_correlation}`);
  }

  if (Math.abs(print.sales_correlation - 0.228299026376165) > 0.002) {
    throw new DataIntegrityError(`Print correlation mismatch in strategy: ${print.sales_correlation}`);
  }

  if (print.p_value <= 0.05) {
    throw new DataIntegrityError(`Print coefficient must be non-significant at α=0.05; received p=${print.p_value}`);
  }

  if (customerData && customerData.total_evidence_records !== 57) {
    throw new DataIntegrityError(`Customer evidence count mismatch: expected 57, received ${customerData.total_evidence_records}`);
  }

  if (marketData && marketData.total_evidence_records !== 38) {
    throw new DataIntegrityError(`Market evidence count mismatch: expected 38, received ${marketData.total_evidence_records}`);
  }

  return true;
}

/**
 * Fetches complete Q5 Strategy Decision dataset including linked Q1-Q4 context.
 */
export async function fetchStrategyData() {
  const [stratRes, custRes, mktRes, srcRes] = await Promise.all([
    fetch('/api/strategy'),
    fetch('/api/customer-drivers'),
    fetch('/api/market-trends'),
    fetch('/api/sources'),
  ]);

  if (!stratRes.ok) {
    throw new Error(`Strategy API failed with status ${stratRes.status}`);
  }
  if (!custRes.ok) {
    throw new Error(`Customer drivers API failed with status ${custRes.status}`);
  }
  if (!mktRes.ok) {
    throw new Error(`Market trends API failed with status ${mktRes.status}`);
  }
  if (!srcRes.ok) {
    throw new Error(`Sources API failed with status ${srcRes.status}`);
  }

  const strategyData = await stratRes.json();
  const customerData = await custRes.json();
  const marketData = await mktRes.json();
  const sourcesData = await srcRes.json();

  validateStrategyData(strategyData, customerData, marketData);

  return {
    strategyData,
    customerData,
    marketData,
    sourcesData,
  };
}

/**
 * Validates Section 08 Recommendations & Action Plan dataset.
 */
export function validateRecommendationsData(strategyData, customerData, marketData) {
  // Enforce underlying analytical evidence guarantees
  validateStrategyData(strategyData, customerData, marketData);

  if (!strategyData.recommendations || strategyData.recommendations.length !== 9) {
    throw new DataIntegrityError(
      `Recommendations count mismatch: expected 9, received ${strategyData.recommendations?.length || 0}`
    );
  }

  const expectedIds = ['R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09'];
  expectedIds.forEach((id, idx) => {
    if (strategyData.recommendations[idx].id !== id) {
      throw new DataIntegrityError(
        `Recommendation ID mismatch at index ${idx}: expected ${id}, received ${strategyData.recommendations[idx].id}`
      );
    }
  });

  if (!strategyData.action_plan_phases || strategyData.action_plan_phases.length !== 5) {
    throw new DataIntegrityError(
      `Action plan phases mismatch: expected 5 phases, received ${strategyData.action_plan_phases?.length || 0}`
    );
  }

  if (!strategyData.action_plan_table || strategyData.action_plan_table.length !== 6) {
    throw new DataIntegrityError(
      `Action plan table rows mismatch: expected 6 rows, received ${strategyData.action_plan_table?.length || 0}`
    );
  }

  if (!strategyData.measurement_hierarchy || strategyData.measurement_hierarchy.length !== 5) {
    throw new DataIntegrityError(
      `Measurement hierarchy levels mismatch: expected 5 levels, received ${strategyData.measurement_hierarchy?.length || 0}`
    );
  }

  if (!strategyData.management_checklist || strategyData.management_checklist.length !== 10) {
    throw new DataIntegrityError(
      `Management checklist count mismatch: expected 10 items, received ${strategyData.management_checklist?.length || 0}`
    );
  }

  if (!strategyData.avoid_decisions || strategyData.avoid_decisions.length !== 7) {
    throw new DataIntegrityError(
      `Avoid decisions count mismatch: expected 7 items, received ${strategyData.avoid_decisions?.length || 0}`
    );
  }

  return true;
}

/**
 * Fetches complete Section 08 Recommendations & Action Plan dataset.
 */
export async function fetchRecommendationsData() {
  const data = await fetchStrategyData();
  validateRecommendationsData(data.strategyData, data.customerData, data.marketData);
  return data;
}

/**
 * Validates Section 02 Data & Methodology data.
 */
export function validateDataMethodologyData(qualityData, advData, regData) {
  if (!qualityData || !qualityData.metrics) {
    throw new DataIntegrityError('Data quality API returned empty or invalid structure.');
  }

  const rowCount = qualityData.metrics.row_count ?? qualityData.metrics.total_observations;
  if (rowCount !== 200) {
    throw new DataIntegrityError(
      `Observation count mismatch in data quality: expected 200, received ${rowCount}`
    );
  }

  const missingCells = qualityData.metrics.missing_source_cells ?? qualityData.metrics.missing_values_count ?? 0;
  if (missingCells !== 0) {
    throw new DataIntegrityError(
      `Missing values detected: expected 0, received ${missingCells}`
    );
  }

  if (advData.total_observations !== 200) {
    throw new DataIntegrityError(
      `Observation count mismatch in advertising data: expected 200, received ${advData.total_observations}`
    );
  }

  if (Math.abs(regData.model.r_squared - 0.897210638178952) > 0.001) {
    throw new DataIntegrityError(`R² mismatch in methodology data: ${regData.model.r_squared}`);
  }

  return true;
}

/**
 * Fetches Section 02 Data & Methodology dataset.
 */
export async function fetchDataMethodology() {
  const [qualityRes, advRes, regRes] = await Promise.all([
    fetch('/api/data-quality'),
    fetch('/api/advertising'),
    fetch('/api/regression'),
  ]);

  if (!qualityRes.ok || !advRes.ok || !regRes.ok) {
    throw new Error('Failed to load data & methodology resources.');
  }

  const qualityData = await qualityRes.json();
  const advData = await advRes.json();
  const regData = await regRes.json();

  validateDataMethodologyData(qualityData, advData, regData);

  return {
    qualityData,
    advData,
    regData,
  };
}

/**
 * Validates Section 09 Methodology & Sources data.
 */
export function validateMethodologySourcesData(sourcesData) {
  if (!sourcesData || !sourcesData.sources) {
    throw new DataIntegrityError('Sources API returned empty or invalid structure.');
  }

  if (sourcesData.total_sources !== 20 || sourcesData.sources.length !== 20) {
    throw new DataIntegrityError(
      `Source count mismatch: expected 20 sources, received ${sourcesData.sources.length}`
    );
  }

  sourcesData.sources.forEach((s, idx) => {
    if (!s.source_name || !s.dataset_domain || !s.source_workbook) {
      throw new DataIntegrityError(`Source at index ${idx} missing required metadata.`);
    }
  });

  return true;
}

/**
 * Fetches Section 09 Methodology & Sources dataset.
 */
export async function fetchMethodologySources() {
  const res = await fetch('/api/sources');
  if (!res.ok) {
    throw new Error(`Sources API failed with status ${res.status}`);
  }

  const sourcesData = await res.json();
  validateMethodologySourcesData(sourcesData);

  return sourcesData;
}


