export type FinancialHealthGrade = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'HIGH_RISK_DISTRESSED';
export type ProfitabilityStatus = 'PROFITABLE_GROWTH' | 'PROFITABLE_STABLE' | 'CYCLICAL' | 'LOSS_MAKING';
export type InvestmentSuitability = 'INVESTMENT_GRADE' | 'SWING_ONLY' | 'SPECULATIVE_RISK' | 'STRICT_AVOID';

export interface StockFundamentalProfile {
  symbol: string;
  nameAr: string;
  peRatio: number; // Negative for loss-making
  profitabilityStatus: ProfitabilityStatus;
  financialHealthGrade: FinancialHealthGrade;
  debtRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  dividendYieldPct: number;
  investmentSuitability: InvestmentSuitability;
  headlineSummary: string;
  baladiAdvice: string;
  financialRedFlags?: string[];
}

export const EGX_FUNDAMENTAL_DATABASE: Record<string, StockFundamentalProfile> = {
  COMI: {
    symbol: 'COMI',
    nameAr: 'البنك التجاري الدولي (CIB)',
    peRatio: 6.8,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 4.8,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'أقوى مؤسسة مالية وبنك استثماري في مصر • أرباح قياسية تتجاوز 50 مليار جنيه',
    baladiAdvice: 'سهم استثماري من الطراز الأول للمحافظ الكبيرة؛ بنك بيكسب مليارات ومكرر ربحيته رخيص جداً ومغري، وعنده ملاءة مالية حديدية تحميه في أصعب الأزمات.',
  },
  SWDY: {
    symbol: 'SWDY',
    nameAr: 'السويدي إليكتريك',
    peRatio: 7.2,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 5.5,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'عملاق صناعي تصديري بتدفقات نقدية دولارية قوية وعقود مشاريع بمليارات الدولارات',
    baladiAdvice: 'شركة تصديرية من العيار الثقيل، أرباحها بتنمو بقوة وعندها بنية تحتية وشغل في الخليج وأفريقيا، ومالياتها ممتازة جداً.',
  },
  TMGH: {
    symbol: 'TMGH',
    nameAr: 'مجموعة طلعت مصطفى القابضة',
    peRatio: 14.5,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'GOOD',
    debtRisk: 'MODERATE',
    dividendYieldPct: 2.5,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'أكبر مطور عقاري في الشرق الأوسط • مبيعات تاريخية وشراكات دولية (رأس الحكمة)',
    baladiAdvice: 'شركة عملاقة بمحفظة أراضي تاريخية ومبيعات خيالية؛ لكن السهم عمل طفرات سعرية سابقة ومكرر ربحيته أعلى من السوق، فالدخول لازم يكون عند ارتكازات قوية مش في القمم.',
  },
  CCAP: {
    symbol: 'CCAP',
    nameAr: 'شركة القلعة للاستشارات المالية',
    peRatio: -1, // Losses / high debt
    profitabilityStatus: 'LOSS_MAKING',
    financialHealthGrade: 'HIGH_RISK_DISTRESSED',
    debtRisk: 'CRITICAL',
    dividendYieldPct: 0.0,
    investmentSuitability: 'SPECULATIVE_RISK',
    headlineSummary: '⚠️ شركة مأزومة مالياً • مديونية ضخمة وخسائر مرحلة بالمليارات وبلا توزيعات أرباح',
    baladiAdvice: 'أنا مش هغشك يا صاحبي عشان أقولك اشتري وخلاص: سهم القلعة مالياً مأزوم ومحمل بديون ثقيلة ونزاعات إعادة هيكلة، ولا يوزع مليم أرباح. السهم لا يصلح نهائياً للاستثمار طويل أو متوسط الأجل؛ حركته مضاربية سريعة للأفراد فقط مع ضرورة وقف خسارة فوري!',
    financialRedFlags: [
      'خسائر مرحلة متراكمة ومديونية دولارية بالمليارات',
      'الشركة لا توزع أي أرباح نقدية على المساهمين',
      'أي صعود للسهم هو مضاربة بحتة وعرضة لتصريف مفاجئ'
    ]
  },
  FWRY: {
    symbol: 'FWRY',
    nameAr: 'فوري لتكنولوجيا البنوك والمدفوعات الإلكترونية',
    peRatio: 32.5,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'GOOD',
    debtRisk: 'LOW',
    dividendYieldPct: 1.2,
    investmentSuitability: 'SWING_ONLY',
    headlineSummary: 'رائد التكنولوجيا المالية والمدفوعات الرقمية • نمو أرباح سريع ولكن تقييم مالي مرتفع',
    baladiAdvice: 'شركة ممتازة ونموها صاروخي، لكن مكرر ربحيتها فوق 32 ضعف يعني السعر سابق أرباحه كتير؛ تنفع مضاربة سوينج عند الدعوم، لكن بلاش شراء في القمم.',
  },
  SKPC: {
    symbol: 'SKPC',
    nameAr: 'سيدي كرير للبتروكيماويات (سيدبك)',
    peRatio: 7.5,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 9.8,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'شركة بتروكيماويات قيادية • توزيعات أرباح نقدية سخية وملاءة مالية مرتفعة',
    baladiAdvice: 'سهم توزيعات أرباح ذهبي؛ بتوزع عوائد كاش ممتازة ومكرر ربحيتها رخيص ومالياتها نظيفة بدون ديون مقلقة.',
  },
  ABUK: {
    symbol: 'ABUK',
    nameAr: 'أبو قير للأسمدة والصناعات الكيماوية',
    peRatio: 8.2,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 8.5,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'صانع الأسمدة الأكبر • أرباح دولارية قوية وتوزيعات دورية للمساهمين',
    baladiAdvice: 'من أأمن وأقوى أسهم البورصة المصرية؛ ماليات قوية جداً وتوزيعات أرباح نقدية سنوية ممتازة.',
  },
  ORWE: {
    symbol: 'ORWE',
    nameAr: 'النساجون الشرقيون للسجاد',
    peRatio: 7.0,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 9.2,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'إمبراطورية صناعة السجاد العالمية • أكثر من 60% صادرات وتدفقات نقدية بالعملات الأجنبية',
    baladiAdvice: 'سهم دفاعي ممتاز ومحبوب للصناديق؛ شركة بتصدر للعالم كله وبتوزع كاش ممتاز سنوياً للمستثمر.',
  },
  EKHO: {
    symbol: 'EKHO',
    nameAr: 'القابضة المصرية الكويتية',
    peRatio: 8.0,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 7.0,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'محفظة استثمارات طاقة وبتروكيماويات وتأمين بالدولار • ماليات صلبة وأرباح مستقرة',
    baladiAdvice: 'سهم استثماري دولاري قوي؛ تنوع استثماري وأرباح مستقرة جداً وتوزيعات بالدولار أو الجنيه.',
  },
  ETEL: {
    symbol: 'ETEL',
    nameAr: 'المصرية للاتصالات (WE)',
    peRatio: 7.4,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'GOOD',
    debtRisk: 'MODERATE',
    dividendYieldPct: 6.2,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'احتكار البنية التحتية للإنترنت وكوابل الاتصالات البحرية • حيازة 45% في فودافون مصر',
    baladiAdvice: 'شركة البنية التحتية للبلد؛ بتمتلك كنز كوابل بحرية وحصة فودافون، ومالياتها قوية وتوزيعاتها مستمرة.',
  }
};

/**
 * Get fundamental profile for any stock (with smart dynamic heuristics for unlisted)
 */
export function getStockFundamentalProfile(symbol: string, sector?: string): StockFundamentalProfile {
  const clean = symbol.replace('EGX:', '').toUpperCase();
  if (EGX_FUNDAMENTAL_DATABASE[clean]) {
    return EGX_FUNDAMENTAL_DATABASE[clean];
  }

  // Heuristic based on sector and ticker
  const isHighRiskSector = (sector || '').includes('مضاربات') || (sector || '').includes('استصلاح') || clean.startsWith('ARAB');
  
  if (isHighRiskSector) {
    return {
      symbol: clean,
      nameAr: clean,
      peRatio: -1,
      profitabilityStatus: 'LOSS_MAKING',
      financialHealthGrade: 'HIGH_RISK_DISTRESSED',
      debtRisk: 'HIGH',
      dividendYieldPct: 0.0,
      investmentSuitability: 'SPECULATIVE_RISK',
      headlineSummary: 'سهم مضاربي عالي المخاطر • تقلبات حادة وأداء مالي متذبذب أو ضعيف',
      baladiAdvice: 'السهم ده مضاربي بحت وتحركاته مبنية على سيولة الأفراد السريعة مش على أرباح قوية؛ احذر الدخول بمبالغ كبيرة والتزم بوقف الخسارة فوراً.'
    };
  }

  return {
    symbol: clean,
    nameAr: clean,
    peRatio: 9.5,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'GOOD',
    debtRisk: 'MODERATE',
    dividendYieldPct: 5.0,
    investmentSuitability: 'SWING_ONLY',
    headlineSummary: 'أداء مالي متوازن واستقرار تشغيلي ضمن قطاع الشركة',
    baladiAdvice: 'ماليات الشركة متوازنة ولا تعاني من ديون حرجة؛ مناسب للمضاربة السوينج مع مراعاة اتجاه السوق العام.'
  };
}
