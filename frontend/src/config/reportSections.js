import {
  FileText,
  Database,
  TrendingUp,
  BarChart2,
  Users,
  Globe,
  Compass,
  CheckSquare,
  BookOpen,
} from 'lucide-react';

export const TOTAL_SECTIONS = 9;

export const REPORT_SECTIONS = [
  {
    id: 'executive-overview',
    number: '01',
    title: 'Executive Overview',
    path: '/report/executive-overview',
    questionNumber: null,
    questionText: null,
    icon: FileText,
  },
  {
    id: 'data-methodology',
    number: '02',
    title: 'Data & Methodology',
    path: '/report/data-methodology',
    questionNumber: null,
    questionText: null,
    icon: Database,
  },
  {
    id: 'advertising-sales',
    number: '03',
    title: 'Advertising & Sales',
    path: '/report/advertising-sales',
    questionNumber: 'Q1',
    questionText: 'Is there a meaningful relationship between advertising expenditure and sales?',
    icon: TrendingUp,
  },
  {
    id: 'channel-analysis',
    number: '04',
    title: 'Channel Analysis',
    path: '/report/channel-analysis',
    questionNumber: 'Q2',
    questionText: 'How do TV, social media and print compare in explaining sales?',
    icon: BarChart2,
  },
  {
    id: 'customer-purchase-drivers',
    number: '05',
    title: 'Customer Purchase Drivers',
    path: '/report/customer-purchase-drivers',
    questionNumber: 'Q3',
    questionText: 'What factors matter to customers when evaluating wireless headphones?',
    icon: Users,
  },
  {
    id: 'market-macro',
    number: '06',
    title: 'Market & Macro',
    path: '/report/market-macro',
    questionNumber: 'Q4',
    questionText: 'What market and macroeconomic conditions should NEXA One consider?',
    icon: Globe,
  },
  {
    id: 'strategy-decision',
    number: '07',
    title: 'Strategy Decision',
    path: '/report/strategy-decision',
    questionNumber: 'Q5',
    questionText: 'What marketing and advertising strategy should NEXA One consider for the next planning period?',
    icon: Compass,
  },
  {
    id: 'recommendations',
    number: '08',
    title: 'Recommendations',
    path: '/report/recommendations',
    questionNumber: null,
    questionText: null,
    icon: CheckSquare,
  },
  {
    id: 'methodology-sources',
    number: '09',
    title: 'Methodology & Sources',
    path: '/report/methodology-sources',
    questionNumber: null,
    questionText: null,
    icon: BookOpen,
  },
];

export function getSectionById(id) {
  if (!id) return REPORT_SECTIONS[0];
  if (id === 'executive-overview' || id === 'executive-summary') {
    return REPORT_SECTIONS[0];
  }
  if (id === 'customer-drivers' || id === 'customer-purchase-drivers') {
    return REPORT_SECTIONS[4];
  }
  if (id === 'market-macro-environment' || id === 'market-macro') {
    return REPORT_SECTIONS[5];
  }
  if (id === 'strategy-decision' || id === 'strategic-direction' || id === 'strategy') {
    return REPORT_SECTIONS[6];
  }
  return REPORT_SECTIONS.find((s) => s.id === id) || REPORT_SECTIONS[0];
}

export function getSectionByPath(pathname) {
  if (!pathname) return REPORT_SECTIONS[0];
  const cleanPath = pathname.replace(/\/$/, '');
  if (
    cleanPath === '' ||
    cleanPath === '/report' ||
    cleanPath === '/report/executive-overview' ||
    cleanPath === '/report/executive-summary'
  ) {
    return REPORT_SECTIONS[0];
  }
  if (
    cleanPath === '/report/strategy' ||
    cleanPath === '/report/strategy-decision' ||
    cleanPath === '/report/strategic-direction'
  ) {
    return REPORT_SECTIONS[6];
  }
  return REPORT_SECTIONS.find((s) => s.path === cleanPath) || REPORT_SECTIONS[0];
}

export function getSectionIndex(id) {
  const section = getSectionById(id);
  const idx = REPORT_SECTIONS.findIndex((s) => s.id === section.id);
  return idx >= 0 ? idx : 0;
}

export function getPreviousSection(id) {
  const idx = getSectionIndex(id);
  return idx > 0 ? REPORT_SECTIONS[idx - 1] : null;
}

export function getNextSection(id) {
  const idx = getSectionIndex(id);
  return idx < REPORT_SECTIONS.length - 1 ? REPORT_SECTIONS[idx + 1] : null;
}
