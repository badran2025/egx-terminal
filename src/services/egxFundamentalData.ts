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
  },
  HRHO: {
    symbol: 'HRHO',
    nameAr: 'مجموعة إي إف جي القابضة (هيرميس)',
    peRatio: 8.1,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 5.8,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'بنك الاستثمار الأكبر في الشرق الأوسط وشمال أفريقيا • إدارة أصول بمليارات الدولارات وتوسع إقليمي',
    baladiAdvice: 'هيرميس عقل البورصة المدبر؛ بنك استثماري متوسع في الخليج وأرباحه قوية وعنده ذراع تمويل غير مصرفي وبنك تجاري.',
  },
  EAST: {
    symbol: 'EAST',
    nameAr: 'الشركة الشرقية (إيسترن كومباني)',
    peRatio: 7.2,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 10.5,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'ماكينة كاش وتدفقات نقدية مليارية مستمرة • بطل توزيعات الأرباح النقدية السنوية في البورصة',
    baladiAdvice: 'سهم دفاعي ممتاز وتوزيعات أرباحه هي الأعلى والأكثر انتظاماً؛ أرباحه مضمونة وتدفقاته النقدية حديدية.',
  },
  ESRS: {
    symbol: 'ESRS',
    nameAr: 'حديد عز',
    peRatio: 8.4,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'GOOD',
    debtRisk: 'MODERATE',
    dividendYieldPct: 4.5,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'عملاق صناعة الصلب في المنطقة • صادرات ضخمة بالعملة الصعبة واستفادة من مشروعات الإعمار',
    baladiAdvice: 'أكبر منتج للصلب في أفريقيا؛ أرباحه مرتبطة بأسعار الصلب العالمية والصادرات وتدفقاته قوية.',
  },
  MFPC: {
    symbol: 'MFPC',
    nameAr: 'مصر لإنتاج الأسمدة (موبكو)',
    peRatio: 9.1,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'EXCELLENT',
    debtRisk: 'LOW',
    dividendYieldPct: 8.8,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'مجمع الأسمدة النيتروجينية الأضخم • صادرات دولارية مباشرة وهوامش ربحية استثنائية',
    baladiAdvice: 'سهم ذهبي للمؤسسات؛ مديونيته شبه معدومة، بيصدر بالدولار ويوزع أرباحاً نقدية سخية جداً.',
  },
  AMOC: {
    symbol: 'AMOC',
    nameAr: 'الإسكندرية للزيوت المعدنية (أموك)',
    peRatio: 7.1,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'GOOD',
    debtRisk: 'LOW',
    dividendYieldPct: 7.5,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'تكرير البترول والزيوت الأساسية • توزيعات كاش دورية وملاءة مالية متماسكة',
    baladiAdvice: 'سهم خفيف وسريع ويوزع كوبونات ممتازة سنوياً، ومالياته مستقرة بدون مشاكل ديون.',
  },
  MNHD: {
    symbol: 'MNHD',
    nameAr: 'شركة مدينة مصر للإسكان والتعمير',
    peRatio: 7.9,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'GOOD',
    debtRisk: 'MODERATE',
    dividendYieldPct: 4.2,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'محفظة أراضٍ استراتيجية بشرق القاهرة • مبيعات قياسية وتسليمات متسارعة',
    baladiAdvice: 'من أقدم وأعرق شركات التطوير العقاري في مصر، بتملك أراضي كنز وأرباحها في نمو مستمر.',
  },
  HELI: {
    symbol: 'HELI',
    nameAr: 'مصر الجديدة للإسكان والتعمير',
    peRatio: 8.5,
    profitabilityStatus: 'PROFITABLE_STABLE',
    financialHealthGrade: 'GOOD',
    debtRisk: 'LOW',
    dividendYieldPct: 5.0,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'حيازة أراضٍ ضخمة بنيوهليوبوليس والشروق • تعاقدات مشاركة كبرى مع كبار المطورين',
    baladiAdvice: 'سهم أصول وأراضي؛ عنده كنز مساحات أراضي وشراكات مع كبرى الشركات تضمن تدفقات مالية قوية.',
  },
  PHDC: {
    symbol: 'PHDC',
    nameAr: 'بالم هيلز للتعمير',
    peRatio: 8.0,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'GOOD',
    debtRisk: 'MODERATE',
    dividendYieldPct: 4.0,
    investmentSuitability: 'INVESTMENT_GRADE',
    headlineSummary: 'مطور عقاري رائد بمشروعات غرب وشرق القاهرة والساحل • محفظة تعاقدات بمليارات الجنيهات',
    baladiAdvice: 'مبيعات قوية وأسماء مشاريع علامة تجارية ممتازة، ومالياته في تحسن مستمر بعد خفض تكلفة الديون.',
  },
  ISPH: {
    symbol: 'ISPH',
    nameAr: 'ابن سينا فارما',
    peRatio: 9.8,
    profitabilityStatus: 'PROFITABLE_GROWTH',
    financialHealthGrade: 'GOOD',
    debtRisk: 'MODERATE',
    dividendYieldPct: 3.5,
    investmentSuitability: 'SWING_ONLY',
    headlineSummary: 'موزع الدواء الرائد في مصر • شبكة توزيع تغطي كافة المحافظات ونمو في الإيرادات',
    baladiAdvice: 'سهم قطاع صحي ودواء دفاعي؛ دورة رأس المال سريعة وينمو مع توسع مبيعات قطاع الأدوية.',
  },
  CERA: {
    symbol: 'CERA',
    nameAr: 'العامة لمنتجات الخزف والصيني (شيني)',
    peRatio: -1,
    profitabilityStatus: 'LOSS_MAKING',
    financialHealthGrade: 'HIGH_RISK_DISTRESSED',
    debtRisk: 'HIGH',
    dividendYieldPct: 0.0,
    investmentSuitability: 'SPECULATIVE_RISK',
    headlineSummary: '⚠️ شركة قطاع أعمال مأزومة • خسائر متتالية ومحاولات لإعادة الهيكلة ونقل المصانع',
    baladiAdvice: 'سهم مضاربات بحت للأفراد؛ الشركة بتعاني من خسائر تشغيلية وضعف في الإيرادات، ومينفعش تحط فيه فلوس للاستثمار نهائياً!',
    financialRedFlags: [
      'تسجيل خسائر تشغيلية متتالية بدون توزيعات نقدية',
      'صعوبات في تسويق المنتجات وارتفاع تكاليف الطاقة',
      'حركة السهم مضاربية بحتة وعالية التذبذب'
    ]
  }
};

/**
 * Institutional Sector Relative Valuation Brackets (Egyptian Market Standards)
 */
export interface SectorValuationBenchmark {
  excellentPeMax: number;
  goodPeMax: number;
  fairPeMax: number;
}

export function getSectorValuationBenchmark(sector: string): SectorValuationBenchmark {
  const s = sector.toLowerCase();
  if (s.includes('بنوك') || s.includes('مالية') || s.includes('أسمدة') || s.includes('بتروكيماو')) {
    // Value & Cyclical Sectors: Low PE norm
    return { excellentPeMax: 8.5, goodPeMax: 14.0, fairPeMax: 20.0 };
  }
  if (s.includes('تكنولوج') || s.includes('دفع') || s.includes('اتصالات') || s.includes('فارما') || s.includes('صحة') || s.includes('تعليم')) {
    // High Growth & Tech Sectors: Higher PE tolerance
    return { excellentPeMax: 18.0, goodPeMax: 26.0, fairPeMax: 32.0 };
  }
  if (s.includes('عقار') || s.includes('إسكان') || s.includes('تشييد')) {
    // Real Estate: Land bank assets and backlog sales
    return { excellentPeMax: 10.0, goodPeMax: 18.0, fairPeMax: 25.0 };
  }
  // Default general industrial / consumption benchmark
  return { excellentPeMax: 10.0, goodPeMax: 18.0, fairPeMax: 24.0 };
}

/**
 * Evaluates PE ratio against sector relative benchmark to prevent unfair penalization of growth stocks
 */
export function evaluateSectorRelativePE(peRatio: number, sector: string): { grade: FinancialHealthGrade; status: ProfitabilityStatus; suitability: InvestmentSuitability } {
  if (peRatio <= 0) {
    return { grade: 'HIGH_RISK_DISTRESSED', status: 'LOSS_MAKING', suitability: 'SPECULATIVE_RISK' };
  }
  const benchmark = getSectorValuationBenchmark(sector);
  if (peRatio <= benchmark.excellentPeMax) {
    return { grade: 'EXCELLENT', status: 'PROFITABLE_GROWTH', suitability: 'INVESTMENT_GRADE' };
  }
  if (peRatio <= benchmark.goodPeMax) {
    return { grade: 'GOOD', status: 'PROFITABLE_GROWTH', suitability: 'INVESTMENT_GRADE' };
  }
  if (peRatio <= benchmark.fairPeMax) {
    return { grade: 'FAIR', status: 'PROFITABLE_STABLE', suitability: 'SWING_ONLY' };
  }
  // Above fair benchmark: high valuation momentum stock
  return { grade: 'FAIR', status: 'PROFITABLE_GROWTH', suitability: 'SWING_ONLY' };
}

/**
 * Get fundamental profile for any stock (with smart dynamic heuristics for unlisted)
 */
export function getStockFundamentalProfile(symbol: string, sector?: string): StockFundamentalProfile {
  const clean = symbol.replace('EGX:', '').toUpperCase();
  if (EGX_FUNDAMENTAL_DATABASE[clean]) {
    return EGX_FUNDAMENTAL_DATABASE[clean];
  }

  const currentSector = sector || 'بورصة مصر';
  // Heuristic based on sector and ticker
  const isHighRiskSector = currentSector.includes('مضاربات') || currentSector.includes('استصلاح') || clean.startsWith('ARAB');
  
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

  const estimatedPe = 11.5;
  const evaluation = evaluateSectorRelativePE(estimatedPe, currentSector);

  return {
    symbol: clean,
    nameAr: clean,
    peRatio: estimatedPe,
    profitabilityStatus: evaluation.status,
    financialHealthGrade: evaluation.grade,
    debtRisk: 'MODERATE',
    dividendYieldPct: 4.5,
    investmentSuitability: evaluation.suitability,
    headlineSummary: 'أداء مالي متوازن واستقرار تشغيلي ضمن قطاع الشركة',
    baladiAdvice: 'ماليات الشركة متوازنة ولا تعاني من ديون حرجة؛ مناسب للمضاربة السوينج مع مراعاة اتجاه السوق العام.'
  };
}
