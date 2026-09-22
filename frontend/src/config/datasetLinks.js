/**
 * Approved Google Sheets Dataset Access Links for NEXA One Report.
 * Centralized registry for human-readable dataset access and audit traceability.
 * Note: The live analytical API uses validated local project data files;
 * these links provide transparent, external access to published workbook representations.
 */

export const DATASET_LINKS = {
  advertising: {
    id: 'advertising',
    label: 'Advertising Dataset',
    title: 'NEXA One Advertising Analysis Dataset',
    shortTitle: 'Advertising Dataset',
    format: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Beq43sYS4CsfiGT0R1xe7gJj9fkVvp3dURrOzfX_6B6zII9nGVnDplUdxEbzGg/pubhtml',
    description: '200 market-level observations with multi-channel spend (TV, Social Media, Print) and observed sales.',
    sectionRoute: '/report/advertising-sales',
  },
  customerResearch: {
    id: 'customer-research',
    label: 'Customer Research',
    title: 'NEXA One Customer Research Dataset',
    shortTitle: 'Customer Research Dataset',
    format: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSr2F0Q8mGgj71aMYSMhV-I7A7r7WxF_jL7YKZ0qtse-ZruIPajLSWiqSgT7GFAsw/pubhtml',
    description: '57 independent customer purchase and evaluation observations across 10 authoritative research studies.',
    sectionRoute: '/report/customer-purchase-drivers',
  },
  marketMacro: {
    id: 'market-macro',
    label: 'Market & Macro Research',
    title: 'NEXA One Market & Macro Research Dataset',
    shortTitle: 'Market & Macro Dataset',
    format: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTva6_i5TZp9R4nRlCEhtzY2TjViii2msFSi34o8lwdyf4GLiTV4BQF-TMf3knEJbIOKTfB03q_2f85/pubhtml',
    description: '38 external market signals, category proxies, and macroeconomic projections across 9 institutions.',
    sectionRoute: '/report/market-macro',
  },
};
