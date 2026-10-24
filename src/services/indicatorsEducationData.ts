export interface IndicatorGuide {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'smart_money' | 'egx_custom' | 'moving_averages' | 'volume_liquidity' | 'momentum_volatility';
  categoryLabel: string;
  badgeColor: string;
  difficulty: string;
  type: 'اتجاه (Trend)' | 'سيولة وحيتان (Smart Money)' | 'زخم (Momentum)' | 'تقلب ومساحة حركة (Volatility/RTM)' | 'دعوم ومقاومات (S/R)';
  tradingViewSearchTerm: string;
  tradingViewScriptUrl?: string;
  author?: string;
  overview: string;
  objective: string;
  whenToUse: string;
  whyUseIt: string;
  howToUseStepByStep: {
    step: string;
    description: string;
  }[];
  extractedInsights: string[];
  recommendedSettings: string;
  confluenceWith: string[];
  pitfallsAndFalseSignals: string[];
  pineScriptSnippet?: string;
}

export const INDICATORS_KNOWLEDGE_BASE: IndicatorGuide[] = [
  // ==========================================
  // 1. SMART MONEY CONCEPTS & GROWTHX FRAMEWORK
  // ==========================================
  {
    id: 'loken_smart_money',
    nameEn: 'Loken Smart Money / SMC Concepts',
    nameAr: 'مؤشر لوكن للأموال الذكية وهيكل السوق (SMC)',
    category: 'smart_money',
    categoryLabel: 'الأموال الذكية والمؤسسات (SMC)',
    badgeColor: 'bg-md-primary-container text-md-on-primary-container',
    difficulty: 'متقدم / شغل حيتان',
    type: 'سيولة وحيتان (Smart Money)',
    tradingViewSearchTerm: 'Smart Money Concepts [LuxAlgo] / Loken SMC',
    author: 'Smart Money / GrowthX',
    overview: 'بص يا صاحبي، ده المؤشر اللي بيكشفلك على الشارت إيه اللي في دماغ صناع السوق والمؤسسات الكبيرة. بيرسم لوحده خطوط كسر الهيكل (BOS) وتغير الاتجاه (CHoCH)، ويحددلك الأماكن اللي الحيتان بينزلوا يسحبوا فيها السيولة من إيد الأفراد.',
    objective: 'الهدف إنك متدخلش ضد الحوت، ومتكونش إنت الطعم اللي الحوت بياكله لما يضرب وقف الخسارة!',
    whenToUse: 'بنستخدمه أول ما نفتح الشارت عشان نعرف: هل السهم في سكة صاعدة معتمدة من المؤسسات، ولا دي مجرد حركة وهمية بتجر رجلك للشراء في القمة؟',
    whyUseIt: 'لأن الدعوم والمقاومات القديمة بتاعة الكتب كل الناس عارفاها، والحيتان بيستغلوها عشان يصطادوا الأفراد. المؤشر ده بيوريك الأماكن الحقيقية اللي الحوت حاطط فيها طلبات الشراء المليونية.',
    howToUseStepByStep: [
      { step: '1. رصد تغير الشخصية (CHoCH)', description: 'أول ما السهم يكون نازل، وفجأة يخترق قمة هابطة سابقة ويطلع علامة CHoCH، ده أول جرس إنذار إن السهم هيبدأ يقلب صاعد.' },
      { step: '2. تأكيد كسر الهيكل (BOS)', description: 'ظهور علامة BOS معناه السهم كسر السقف وبيكمل صعود، وبيعمل قمم وقيعان صاعدة ورا بعض.' },
      { step: '3. استنى منطقة الخصم (Discount Zone)', description: 'إياك تجري ورا السهم أول ما يعمل BOS؛ استناه لما يريح لتحت خط النص (منطقة التخفيضات) عشان تاخده برخيص.' },
      { step: '4. الدخول مع سحب السيولة', description: 'ادخل لما تلاقي السهم كسر القاع الصغير الصبح ورجع ارتد بطلقة لفوق، وحط وقفك تحت القاع على طول.' }
    ],
    extractedInsights: [
      'بيعرفك الاتجاه الحقيقي بتاع الصناديق مش بتاع الأفراد',
      'بيحددلك فين مصايد ضرب الوقف (Liquidity Sweeps)',
      'بيقولك إمتى السهم غالي (Premium) فما تشتريش، وإمتى رخيص (Discount) فتبدأ تجمع'
    ],
    recommendedSettings: 'فريم 4 ساعات وفريم يومي لمعرفة الاتجاه العام، وفريم ربع ساعة أو ساعة عشان توقيت الدخول الدقيق.',
    confluenceWith: ['Order Blocks', 'MCDX Plus', 'Volume Profile', 'Golden Cross'],
    pitfallsAndFalseSignals: [
      'إياك تاخد إشارة BOS على فريمات صغيرة زي دقيقة أو 5 دقايق أول ربع ساعة من الجلسة لأنها بتبقى فخاخ ومليانة شوشرة.',
      'لازم الشمعة تقفل بجسمها فوق الخط مش مجرد ديل شمعة يلمس وينزل.'
    ]
  },
  {
    id: 'order_blocks',
    nameEn: 'Order Blocks (OB)',
    nameAr: 'كتل أوامر الحيتان وصناع السوق (Order Blocks)',
    category: 'smart_money',
    categoryLabel: 'الأموال الذكية والمؤسسات (SMC)',
    badgeColor: 'bg-md-primary-container text-md-on-primary-container',
    difficulty: 'متقدم / مؤسسي',
    type: 'سيولة وحيتان (Smart Money)',
    tradingViewSearchTerm: 'Order Block Detector / Institutional Footprint',
    author: 'GrowthX / SMC Standards',
    overview: 'الأوردر بلوك (Order Block) ده يا صاحبي هو آخر شمعة هابطة نزلت قبل ما السهم ينفجر لفوق بطلقة صاروخية. المنطقة دي هي اللي دخلت فيها المحافظ المليارية واشترت كميات ضخمة.',
    objective: 'الهدف إنك تحدد بالمليم النطاق السعري اللي الحوت هيرجع يريح عنده عشان يكمل شيل باقي الكمية (Mitigation)، فتدخل معاه وإنت حاطط وقف خسارة ضيق جداً ومكسب مستهدف كبير.',
    whenToUse: 'بنستخدمه عشان نحط أوامر الشراء المعلقة (Limit Orders) في ثاندر؛ مش بنجري ورا السهم وهو بيجري، بنقف مستنينه عند الأوردر بلوك.',
    whyUseIt: 'لأن البنوك الكبيرة مينفعش تشتري 10 مليون سهم في دقيقة واحدة وإلا السهم هيطير فجأة؛ فبيشتروا جزء ويسيبوا السهم يهدى ويرجع لنفس الدور عشان يلموا الباقي.',
    howToUseStepByStep: [
      { step: '1. دوّر على الشمعة اللي فجرت الحركة', description: 'شوف آخر شمعة حمراء جه بعدها شمعة خضراء عملاقة كسرت قمة قديمة وعملت فجوة سعرية (Fair Value Gap).' },
      { step: '2. رسم مستطيل الأوردر بلوك', description: 'المؤشر بيرسم لوحده مستطيل على الشمعة دي ويمده لقدام كأنه أرضية دور جديدة في العمارة.' },
      { step: '3. الدخول الذهبي مع إعادة الاختبار', description: 'أول ما السعر يرجع يلمس المستطيل ده ويهدي، دي بتبقى أفضل نقطة شراء بأقل مخاطرة.' },
      { step: '4. ضبط وقف الخسارة', description: 'وقفك بيكون تحت قاع المستطيل بكام قرش، وأول هدف هو القمة اللي نزل منها.' }
    ],
    extractedInsights: [
      'سعر الدخول المؤسسي المحسوب بالقرش بدل ما تشتري عشوائي',
      'وقف خسارة آمن ومحمي بطلبات شراء الصناديق',
      'معرفة هل الأوردر بلوك ده طازة (Fresh) ولا تم اختباره كذا مرة'
    ],
    recommendedSettings: 'الفريم اليومي (1D) هو الأصدق في أسهم البورصة المصرية عشان تتفادى ذيول الإشاعات.',
    confluenceWith: ['Loken Smart Money', 'Fair Value Gap (FVG)', 'MCDX Plus', 'VWMA'],
    pitfallsAndFalseSignals: [
      'لو السهم رجع للأوردر بلوك أكتر من مرتين أو تلاتة بيضعف وممكن يتكسر.',
      'لو السهم كسر المستطيل وقفل تحته، المستطيل ده بيتحول لسقف مقاومة خرساني (Breaker Block) بيمنع الطلوع.'
    ]
  },
  {
    id: 'l3_gemini',
    nameEn: 'L3 Gemini / L3 GrowthX',
    nameAr: 'مؤشر L3 جيميني ومستويات السيولة الرائدة (L3 System)',
    category: 'smart_money',
    categoryLabel: 'الأموال الذكية والمؤسسات (SMC)',
    badgeColor: 'bg-md-tertiary-container text-md-on-tertiary-container',
    difficulty: 'متوسط',
    type: 'زخم (Momentum)',
    tradingViewSearchTerm: 'L3 Gemini / GrowthX Indicator',
    tradingViewScriptUrl: 'https://www.tradingview.com/u/RaniaEsmael-GrowthX/#published-scripts',
    author: 'Rania Esmael (GrowthX)',
    overview: 'ده مؤشر ابتكره فريق مدرسة GrowthX عشان يستبدل مؤشر RSI القديم بتاع سنة 1978. بيقيس تدفق السيولة والزخم على 3 مستويات (Level 1, Level 2, Level 3) بمعادلة هجينة بتكشفلك هل في مشتري حقيقي بيشيل في الخفاء ولا لأ.',
    objective: 'الهدف إنه يديك إشارة دخول صريحة قبل ما الانفجار السعري يحصل، ويمنعك تشتري في أسهم ميتة بتتحرك بالعرض من غير بنزين.',
    whenToUse: 'بنستخدمه كـ "زناد إطلاق" (Trigger) لما السهم يقرب من دعم أو أوردر بلوك عشان نتأكد إن في عزم شراء كافي هيرفعه.',
    whyUseIt: 'لأن الـ RSI العادي بيفضل عاطيك تشبع شراء والسهم طالع 40% وإنت برة؛ مؤشر L3 بيوريك هل السيولة لسه داخلة ولا بدأت تخرج بجد.',
    howToUseStepByStep: [
      { step: '1. مراقبة لون خط L3', description: 'أول ما خط المؤشر يقلب من رمادي أو أحمر لأخضر زاهي ويعدي خط الصفر، دي علامة استعداد.' },
      { step: '2. التقاطع الصاعد', description: 'تقاطع خط السيولة السريع فوق الخط المتوسط بيدي إشارة دخول مؤكدة.' },
      { step: '3. رصد الدايفرجنس المخفي', description: 'لو السعر نزل عمل قاع جديد بس مؤشر L3 رفض ينزل وعمل قاع أعلى، دي أقوى إشارة إن البياع خلص والطلوع وشيك.' },
      { step: '4. جني الأرباح الذكي', description: 'أول ما خط L3 يبدأ ينحني لتحت من القمة، بيع نص كميتك وأمن مكسبك.' }
    ],
    extractedInsights: [
      'تأكيد حقيقي إن المشتري دايس بنزين مش مجرد شمعة خضراء صدفة',
      'كشف الانفراجات الإيجابية الخفية بدقة',
      'معرفة اللحظة اللي السهم بيتحرر فيها من النطاق العرضي الممل'
    ],
    recommendedSettings: 'إعدادات GrowthX القياسية، فريم اليومي وفريم 4 ساعات للأسهم وفريم الساعة للمضاربة السريعة.',
    confluenceWith: ['Room to Move', 'Order Blocks', 'Trend Signals', 'MCDX Plus'],
    pitfallsAndFalseSignals: [
      'متعتمدش عليه لوحده في سوق نايم تماماً، لازم تدمجه مع أرضية دعم أو أوردر بلوك.'
    ]
  },
  {
    id: 'room_to_move',
    nameEn: 'Room to Move (RTM)',
    nameAr: 'مؤشر مساحة الحركة ونطاق التحرر السعري (Room to Move)',
    category: 'smart_money',
    categoryLabel: 'الأموال الذكية والمؤسسات (SMC)',
    badgeColor: 'bg-md-secondary-container text-md-on-secondary-container',
    difficulty: 'متوسط',
    type: 'تقلب ومساحة حركة (Volatility/RTM)',
    tradingViewSearchTerm: 'Room to Move / RTM Indicator GrowthX',
    tradingViewScriptUrl: 'https://www.tradingview.com/u/RaniaEsmael-GrowthX/#published-scripts',
    author: 'Rania Esmael (GrowthX)',
    overview: 'بص يا صاحبي، ده المفهوم اللي بيميز المتداول المحترف عن الهاوي! فكرته زي عمارة الأدوار بالظبط: السهم واقف في الدور الكام؟ والسقف الخرساني اللي فوق دماغه (المقاومة) على بعد قد إيه؟ لو السقف على بعد 1% يبقى مينفعش تشتري لأن راسك هتتفتح، لكن لو السقف على بعد 15% يبقى عندك "مساحة حركة واسعة" تكسب فيها براحتك!',
    objective: 'الهدف إنك متدخلش أي صفقة نسبة المكسب فيها للمخاطرة أقل من 1:2.5؛ يعني لو هتخاطر بجنيه وقف خسارة، لازم يكون قدامك سكة تكسب 2.5 جنيه على الأقل.',
    whenToUse: 'بنستخدمه قبل ما تدوس على زرار الشراء في أي سهم، عشان تتأكد إن الطريق قدامه سالك ومفيش مطبات خرسانية قريبة.',
    whyUseIt: 'لأن كتير من الناس بيشوفوا إشارة شراء ممتازة ويشتروا، وفجأة السهم يخبط في مقاومة تاريخية أو متوسط 200 يوم بعد نص جنيه وينزل بيهم.',
    howToUseStepByStep: [
      { step: '1. قياس مسافة السقف القادم', description: 'احسب المسافة بين سعر دخولك وأقرب قمة سابقة أو متوسط كبير أو سقف دور.' },
      { step: '2. حساب وقف الخسارة', description: 'حط الوقف تحت أقرب أرضية دور (دعم) متينة.' },
      { step: '3. تطبيق شرط النسبة الذهبية', description: 'لو مساحة الحركة أكبر من ضعف ونصف وقف الخسارة، الصفقة مقبولة وخضراء.' },
      { step: '4. الرفض الصارم للصفقات الضيقة', description: 'لو السقف قريب والمساحة ضيقة، بنكنسل الصفقة حتى لو كل المؤشرات التانية بتقول شراء!' }
    ],
    extractedInsights: [
      'حساب نسبة العائد إلى المخاطرة (Risk to Reward) بالمليم',
      'تجنب الشراء تحت الأسقف الخرسانية للمقاومات',
      'معرفة المستهدفات الواقعية لجني الأرباح'
    ],
    recommendedSettings: 'قياس المسافات على الفريم اليومي وفريم 4 ساعات.',
    confluenceWith: ['AI Support & Resistance', 'Order Blocks', 'ATR', 'Multi-TF'],
    pitfallsAndFalseSignals: [
      'متحسبش مقاومات فريم 5 دقايق كسقف حقيقي؛ السقف الحقيقي هو اللي باين على الفريم اليومي والأسبوعي.'
    ]
  },
  {
    id: 'multi_tf',
    nameEn: 'Multi-Timeframe Analysis (Multi-TF)',
    nameAr: 'مؤشر ومفهوم تعدد الأطر الزمنية (Multi-Timeframe)',
    category: 'smart_money',
    categoryLabel: 'الأموال الذكية والمؤسسات (SMC)',
    badgeColor: 'bg-md-primary-container text-md-on-primary-container',
    difficulty: 'متقدم / مؤسسي',
    type: 'اتجاه (Trend)',
    tradingViewSearchTerm: 'Multi Timeframe Matrix / Multi-TF Dashboard',
    author: 'GrowthX Standards',
    overview: 'دي نظرة "الطيارة الهليكوبتر" يا صاحبي! مينفعش تبص في شبر مية على فريم 5 دقايق وتنسى إن السهم على الفريم الأسبوعي بيغرق، أو العكس إن السهم على الأسبوعي صاروخ وإنت خايف من ترييحة 10 دقايق! بنربط فريم الأسبوع + اليوم + الساعة في نظام واحد متكامل.',
    objective: 'الهدف إنك تتداول دايماً في اتجاه التيار الأكبر، ومتاخدش قرارات متهورة مبنية على ضوضاء الفريمات الصغيرة.',
    whenToUse: 'مع كل صفقة جديدة، لازم تعدي السهم على الفريمات التلاتة بالترتيب.',
    whyUseIt: 'لأن الفريم الأكبر بيكسب دايماً؛ لو فريم الساعة عاطي بيع بس الفريم الأسبوعي واليومي صاعدين بارتكاز على دعم، البيع بتاع الساعة ده بيبقى مجرد ترييحة لشراء فرصة ذهبية!',
    howToUseStepByStep: [
      { step: '1. الفريم الأسبوعي (Weekly)', description: 'بنعرف منه الاتجاه العام للدورة: هل السهم في سوق صاعد ولا هابط؟' },
      { step: '2. الفريم اليومي (Daily)', description: 'بنحدد منه أرضية الدور (الدعم) والسقف (المقاومة) ومناطق الأوردر بلوك.' },
      { step: '3. فريم الساعة (1-Hour)', description: 'ده زرار التنفيذ والزناد: بندخل مع أول شمعة ارتدادية خضراء تأكد انتهاء الترييحة.' }
    ],
    extractedInsights: [
      'توافق 3 اتجاهات مع بعض بيزود نسبة نجاح الصفقة لأكتر من 80%',
      'تصفية الخوف والهلع من حركات النصف ساعة الأولى',
      'تحديد أفضل نقاط الدخول بأقل مخاطرة ممكنة'
    ],
    recommendedSettings: 'مثلث القوة: Weekly (اتجاه) + Daily (هيكل ومستويات) + 1H (دخول وتوقيت).',
    confluenceWith: ['Loken Smart Money', 'Golden Cross', 'Room to Move'],
    pitfallsAndFalseSignals: [
      'تجنب الدخول عكس اتجاه الفريم الأسبوعي حتى لو شفت شمعة ليمونة خضراء على فريم 15 دقيقة.'
    ]
  },
  {
    id: 'mcdx_plus',
    nameEn: 'MCDX Plus (Banker vs Retailer)',
    nameAr: 'مؤشر سيولة الحيتان والأفراد (MCDX Plus Banker Chips)',
    category: 'smart_money',
    categoryLabel: 'الأموال الذكية والمؤسسات (SMC)',
    badgeColor: 'bg-md-primary-container text-md-on-primary-container',
    difficulty: 'متوسط إلى متقدم',
    type: 'سيولة وحيتان (Smart Money)',
    tradingViewSearchTerm: 'MCDX Plus / Banker vs Retailer',
    author: 'Smart Money / Retail Sentiment',
    overview: 'ده مؤشر "أشعة إكس" للسهم يا صاحبي! بيقسم السيولة اللي جوة السهم لتلات ألوان زي إشارات المرور: اللون الأحمر بيمثل فلوس البانكرز والمؤسسات الكبيرة (Bankers)، واللون الأصفر بيمثل فلوس المضاربين الساخنين (Hot Money)، واللون الأخضر بيمثل فلوس الأفراد العاديين العالقين (Retailers).',
    objective: 'الهدف إنك تركب مع الحيتان لما تكون عواميدهم الحمرا طاغية، وتهرب من السهم لما تلاقي العواميد الخضراء بتاعة الأفراد هي اللي مالية الشاشة.',
    whenToUse: 'بنستخدمه عشان نقيس بنزين العربية الحقيقي: هل الحركة اللي طالعة دي وراها بنوك، ولا شوية جروبات تليجرام وأفراد بيجروا ورا بعض وهيتصرف عليهم؟',
    whyUseIt: 'لأن الأفراد دايماً بيشتروا في القمة ويبيعوا في القاع؛ المؤشر ده بيحميك من إنك تكون مع قطيع الأفراد ويخليك واقف في صف الصناديق.',
    howToUseStepByStep: [
      { step: '1. شرط الأمان الذهبي (Banker > 50%)', description: 'القاعدة الصارمة: متدخلش أي سهم إلا لما تكون العواميد الحمراء واصلة 50% أو أكتر من حجم المؤشر.' },
      { step: '2. رصد انكماش الأفراد', description: 'تأكد إن اللون الأخضر بتاع الأفراد بينزل لتحت خط الـ 20%، وده معناه إن الأفراد يئسوا وباعوا والحوت جمع منهم.' },
      { step: '3. إشارة الخروج والهروب', description: 'لو العواميد الحمراء بدأت تنزل وتكسر تحت خط 50% واللون الأخضر بدأ يزيد، اعرف إن الحيتان بيخرجوا ولازم تخرج معاهم.' }
    ],
    extractedInsights: [
      'نسبة التملك المؤسسي الحقيقي في الجلسة الحالية',
      'كشف عمليات التصريف الخفية قبل ما السهم ينهار',
      'معرفة هل السهم تحت سيطرة صناع السوق أم مضاربات أفراد عشوائية'
    ],
    recommendedSettings: 'الفريم اليومي (1D) هو المعيار الأساسي لقراءة سيولة البانكرز في السوق المصري.',
    confluenceWith: ['Volume Profile', 'L3 Gemini', 'Golden Cross', 'Order Blocks'],
    pitfallsAndFalseSignals: [
      'لو السهم صعد يوم أو اتنين والعواميد الحمراء صفر أو أقل من 20%، اعرف إن ده فخ تصريفي وصعود كاذب متشتريش فيه.'
    ]
  },
  {
    id: 'lux_algo',
    nameEn: 'LuxAlgo (Signals & Price Action Concepts)',
    nameAr: 'مؤشرات لوكس ألجو الذكية (LuxAlgo Suite)',
    category: 'smart_money',
    categoryLabel: 'الأموال الذكية والمؤسسات (SMC)',
    badgeColor: 'bg-md-primary-container text-md-on-primary-container',
    difficulty: 'مبتدئ إلى متقدم',
    type: 'اتجاه (Trend)',
    tradingViewSearchTerm: 'Signals & Overlays / Price Action Concepts by LuxAlgo',
    author: 'LuxAlgo',
    overview: 'حزمة مؤشرات خوارزمية بتنضف الشارت وترسم عليه مناطق الدعم والمقاومة الديناميكية، وبتلون الشموع حسب قوة الزخم، مع إشارات بيع وشراء استرشادية واقتراح لمستويات جني الأرباح ووقف الخسارة.',
    objective: 'الهدف إنه يسهل عليك قراءة الشارت ويشيل التردد والخوف؛ بيوريك بنظرة واحدة هل السهم تحت سحابة خضراء صاعدة ولا سحابة حمراء هابطة.',
    whenToUse: 'بنستخدمه للمضاربة اليومية والسوينج كفلتر بصري مريح للأعصاب.',
    whyUseIt: 'لأنه بيختصر وقت كبير في رسم الخطوط اليدوية وبيرسم قنوات التقلب ومستويات الـ Take Profit والـ Stop Loss بناءً على حركة السهم الحقيقية.',
    howToUseStepByStep: [
      { step: '1. استنى إغلاق شمعة الإشارة', description: 'لو ظهرت إشارة Buy، اوعى تتسرع؛ استنى لما الشمعة تقفل تماماً عشان تتأكد إن الإشارة ثابتة ومش هتعيد رسم نفسها.' },
      { step: '2. بص على سحابة الاتجاه (Trend Cloud)', description: 'تأكد إن الشموع بتتداول فوق السحابة الخضراء مش تحتها.' },
      { step: '3. الالتزام بالأهداف المقترحة', description: 'المؤشر بيحطلك خطوط TP1 و TP2 و Stop Loss، التزم بيهم كخطة تداول واضحة.' }
    ],
    extractedInsights: [
      'إشارات بصرية مباشرة بتحدد مسار الحركة',
      'تلوين الشموع حسب الزخم المؤسسي',
      'خطوط دعم ومقاومة ديناميكية محسوبة تلقائياً'
    ],
    recommendedSettings: 'ضبط حساسية الإشارة (Signal Sensitivity) بين 12 و 15 لتقليل الإشارات الكاذبة في السوق المصري.',
    confluenceWith: ['MCDX Plus', 'L3 Gemini', 'Golden Cross'],
    pitfallsAndFalseSignals: [
      'متشتريش على أي إشارة Buy تظهر والسهم بيتداول تحت متوسط 200 يوم.'
    ]
  },

  // ==========================================
  // 2. EGX CUSTOM SCRIPTS & TAMER ZAKY SCRIPTS
  // ==========================================
  {
    id: 'trend_signals_tz',
    nameEn: 'Trend Signals - [Tamer Zaky]',
    nameAr: 'مؤشر إشارات الاتجاه المخصص للبورصة المصرية - تامر زكي',
    category: 'egx_custom',
    categoryLabel: 'سكربتات البورصة المصرية ومجتمع التداول',
    badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    difficulty: 'مبتدئ إلى متوسط',
    type: 'اتجاه (Trend)',
    tradingViewSearchTerm: 'Trend Signals - [Tamer Zaky]',
    author: 'Tamer Zaky (EGX Trading Community)',
    overview: 'سكربت معمول ومبرمج خصيصاً على مقاس حركة وتذبذب أسهم البورصة المصرية وتطبيق ثاندر. بيتابع تحول الاتجاه وبيديك أسهم خضراء للشراء وأسهم حمراء للبيع مع خط ترند ديناميكي بيمشي تحت الشموع.',
    objective: 'الهدف إنه يحميك من التذبذبات اليومية الوهمية في السوق المصري، ويخليك راكب الموجه من أولها ومطمن.',
    whenToUse: 'بنستخدمه لتحديد لحظة بداية الحركة الصاعدة في أسهم EGX30 و EGX70.',
    whyUseIt: 'لأن المؤشرات الأجنبية معمولة لأسواق سريعة جداً زي الفوركس والنازداك وممكن تديك إشارات كتير ورا بعض تلخبطك؛ السكربت ده متظبط على هدوء وتذبذب البورصة المصرية.',
    howToUseStepByStep: [
      { step: '1. ظهور سهم الشراء الأخضر', description: 'استنى إغلاق جلسة التداول مع ثبات السهم الأخضر فوق خط الترند.' },
      { step: '2. خط الترند كحزام أمان', description: 'طول ما السهم بيتداول فوق خط الترند الأخضر، إنت مكمل في الصفقة ومش قلقان.' },
      { step: '3. البيع والخروج', description: 'أول ما يظهر سهم أحمر أو يكسر السهم خط الترند بإغلاق يومي، بتخرج وتأمن فلوسك.' }
    ],
    extractedInsights: [
      'تحديد بداية ونهاية الموجات الصاعدة في الأسهم المصرية',
      'وقف خسارة متحرك (Trailing Stop) بيتحرك مع السهم لفوق',
      'تصفية الشائعات والأخبار اللحظية المضللة'
    ],
    recommendedSettings: 'الفريم اليومي وفريم الساعة لأسهم البورصة المصرية.',
    confluenceWith: ['EGX Activity', 'Liquidity Sweeps', 'MCDX Plus'],
    pitfallsAndFalseSignals: [
      'في الاتجاهات العرضية المملة، السكربت ممكن يديك إشارات دخول وخروج قريبة من بعض؛ ساعتها اعتمد على الدعم والمقاومة.'
    ]
  },
  {
    id: 'orb_tz',
    nameEn: 'ORB (Opening Range Breakout) - [Tamer Zaky]',
    nameAr: 'مؤشر كسر نطاق الافتتاح الصباحي (ORB) - تامر زكي',
    category: 'egx_custom',
    categoryLabel: 'سكربتات البورصة المصرية ومجتمع التداول',
    badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    difficulty: 'متوسط / مضاربة سريعة',
    type: 'زخم (Momentum)',
    tradingViewSearchTerm: 'ORB - [Tamer Zaky]',
    author: 'Tamer Zaky',
    overview: 'ده سلاح صائد الفرص الصباحية في البورصة المصرية! بياخد أعلى سعر وأقل سعر السهم عملهم في أول ربع ساعة أو نص ساعة من الجلسة (من 10:00 لـ 10:30 صباحاً) ويرسم بيهم مستطيل. لو السهم كسر المستطيل ده لفوق، بيبقى في هجمة شرائية قوية هتكمل باقي اليوم.',
    objective: 'الهدف إنك تصطاد الأسهم اللي عليها طلب قوي مع بداية الجلسة وتركب معاها الرالي قبل ما تقفل على ارتفاع.',
    whenToUse: 'يومياً بين الساعة 10:15 والساعة 11:30 صباحاً مع فتح تداولات البورصة المصرية.',
    whyUseIt: 'لأن الحيتان والمؤسسات الكبيرة في السوق المصري بيحطوا أوامرهم التقيلة في أول نصف ساعة؛ المؤشر بيكشف اتجاههم بدري جداً.',
    howToUseStepByStep: [
      { step: '1. رسم نطاق الصباح تلقائياً', description: 'المؤشر بيحدد أعلى نقطة وأقل نقطة لأول 15 إلى 30 دقيقة.' },
      { step: '2. انتظار كسر القمة الصباحية (Breakout)', description: 'أول ما شمعة 5 دقايق تقفل فوق الخط العلوي للمستطيل بفوليوم عالي، بتدوس شراء فوراً.' },
      { step: '3. وقف الخسارة الصارم', description: 'وقفك بيكون منتصف المستطيل أو قاعه؛ لو السهم رجع جوة النطاق بتخرج بأقل خسارة.' }
    ],
    extractedInsights: [
      'اكتشاف الأسهم النجمية الصاعدة من أول ربع ساعة في الجلسة',
      'تحديد مستوى دخول فوري للمضارب اليومي',
      'حساب وقف خسارة دقيق مبني على تذبذب الصباح'
    ],
    recommendedSettings: 'فريم 5 دقائق أو 15 دقيقة، بنطاق زمني 15M / 30M.',
    confluenceWith: ['EGX Activity', 'Trend Signals', 'Volume Profile'],
    pitfallsAndFalseSignals: [
      'لو السهم كسر فوق النطاق ورجع قفل جواه بسرعة، ده كسر كاذب (Fakeout) ولازم تفعل وقفك فوراً.'
    ]
  },
  {
    id: 'rmi_trend_tz',
    nameEn: 'RMI Trend - [Tamer Zaky]',
    nameAr: 'مؤشر الزخم النسبي للاتجاه (RMI Trend) - تامر زكي',
    category: 'egx_custom',
    categoryLabel: 'سكربتات البورصة المصرية ومجتمع التداول',
    badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    difficulty: 'متوسط',
    type: 'زخم (Momentum)',
    tradingViewSearchTerm: 'RMI Trend - [Tamer Zaky]',
    author: 'Tamer Zaky',
    overview: 'الـ RMI (Relative Momentum Index) ده النسخة المطورة من الـ RSI الكلاسيكي؛ ميزته إنه بيضيف عنصر "الزمن والسرعة" للمعادلة، فبيمنع التذبذبات العشوائية ويكشفلك قوة الدفعة الحقيقية للسهم.',
    objective: 'الهدف تصفية الإشارات المتسرعة اللي كانت بتخلي الناس تبيع بدري أو تشتري في قمم وهمية.',
    whenToUse: 'بنستخدمه لتأكيد استمرارية الصعود أثناء الترندات القوية.',
    whyUseIt: 'لأنه أنعم بكتير من RSI العادي، ومش بيطلع وينزل زي المجنون مع كل شمعة حمراء صغيرة.',
    howToUseStepByStep: [
      { step: '1. صعود المؤشر فوق خط الـ 50', description: 'تجاوز مستوى 50 للأعلى بيعني إن الزخم الصاعد هو اللي مسيطر.' },
      { step: '2. الارتداد من خط الـ 50 كدعم', description: 'في الاتجاهات القوية، المؤشر بينزل يلمس الـ 50 ويرتد لفوق، دي بتبقى فرصة تعزيز شراء ممتازة.' },
      { step: '3. رصد مناطق التشبع الحقيقية', description: 'البيع بيكون لما المؤشر يكسر تحت 70 بعد ما يعمل قمة مزدوجة واضحة.' }
    ],
    extractedInsights: [
      'تحديد قوة واستمرارية الموجة الصاعدة',
      'نقاط دخول آمنة مع تصحيحات خط المنتصف (50 Line Rebounds)'
    ],
    recommendedSettings: 'الفترة 14 مع معامل الزخم 5 على الفريم اليومي.',
    confluenceWith: ['AI Support & Resistance', 'Trend Signals', 'VWMA'],
    pitfallsAndFalseSignals: [
      'لا تعتبر وصول المؤشر لـ 70 إشارة بيع فورية؛ في الأسهم الصاعدة الصاروخية ممكن يفضل فوق الـ 70 لأسابيع.'
    ]
  },
  {
    id: 'liquidity_sweeps_tz',
    nameEn: 'Liquidity - [Tamer Zaky]',
    nameAr: 'مؤشر سحب السيولة ومصائد الحيتان - تامر زكي',
    category: 'egx_custom',
    categoryLabel: 'سكربتات البورصة المصرية ومجتمع التداول',
    badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    difficulty: 'متقدم / شغل محترفين',
    type: 'سيولة وحيتان (Smart Money)',
    tradingViewSearchTerm: 'Liquidity - [Tamer Zaky]',
    author: 'Tamer Zaky',
    overview: 'السكربت ده معمول عشان يكشف "حركات الغدر" بتاعة السوق! لما السهم ينزل الصبح يكسر قاع مهم بنص جنيه أو بجنيه، الناس تترعب وتبيع بخسارة، وفجأة تلاقي السهم سحب كل العروض دي وارتد بطلقة لفوق. السكربت بيرسم علامة فورية إن دي مصيدة سحب سيولة مش كسر حقيقي.',
    objective: 'الهدف إنك متكونش الضحية اللي بتبيع في القاع للحوت، بالعكس تشتري مع الحوت في نفس لحظة الارتداد!',
    whenToUse: 'عند القيعان المهمة ومستويات الدعم لما تلاقي السعر بيكسرها بذيل شمعة ويرجع بسرعة.',
    whyUseIt: 'لأن أكثر من 70% من كسور القيعان الصباحية في البورصة المصرية بتكون مصايد سحب سيولة لجمع الأسهم برخيص قبل الانطلاق.',
    howToUseStepByStep: [
      { step: '1. ظهور علامة الـ Sweep', description: 'المؤشر بيحط علامة على الشمعة اللي كسرت القاع ورجعت قفلت فوقه.' },
      { step: '2. الشراء مع شمعة التأكيد', description: 'ادخل شراء فوراً مع إغلاق الشمعة فوق القاع المكسور.' },
      { step: '3. وقف الخسارة المحمي', description: 'حط وقفك تحت ديل الشمعة اللي سحبت السيولة؛ ده أقوى وقف خسارة في التحليل الفني.' }
    ],
    extractedInsights: [
      'اكتشاف القيعان الحقيقية بدقة متناهية',
      'تجنب البيع بالخسارة تحت وطأة الخوف الصباحي',
      'اقتناص صفقات سريعة بنسبة أرباح عالية جداً'
    ],
    recommendedSettings: 'فريم 15 دقيقة وفريم ساعة وفريم يومي.',
    confluenceWith: ['Order Blocks', 'MCDX Plus', 'Room to Move'],
    pitfallsAndFalseSignals: [
      'لو الشمعة كسرت القاع وقفلت تحته بجسم كامل دون ارتداد، ده كسر حقيقي هابط وليس سحب سيولة؛ اوعى تشتري ضده.'
    ]
  },
  {
    id: 'ai_sr_tz',
    nameEn: 'AI Support & Resistance - [Tamer Zaky]',
    nameAr: 'مؤشر الدعوم والمقاومات بالذكاء الاصطناعي - تامر زكي',
    category: 'egx_custom',
    categoryLabel: 'سكربتات البورصة المصرية ومجتمع التداول',
    badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    difficulty: 'مبتدئ إلى متوسط',
    type: 'دعوم ومقاومات (S/R)',
    tradingViewSearchTerm: 'AI Support & Resistance - [Tamer Zaky]',
    author: 'Tamer Zaky',
    overview: 'سكربت ذكي بيحلل تاريخ السهم كله ويطلعلك "أرضيات الأدوار" (الدعوم) و"الأسقف الخرسانية" (المقاومات) الحقيقية تلقائياً من غير ما تقعد ترسم خطوط بإيدك وتتلخبط.',
    objective: 'الهدف إنك تشوف خريطة العمارة بوضوح: إنت واقف في الدور الكام، والسقف اللي فوقك فين، والأرضية اللي تحتك فين.',
    whenToUse: 'على أي سهم تفكر تشتريه عشان تعرف مستويات الدخول وجني الأرباح ووقف الخسارة.',
    whyUseIt: 'لأنه بيقيم قوة المستوى بناءً على عدد المرات اللي السعر خبط فيها وحجم التداول اللي حصل عندها، مش مجرد خط عشوائي.',
    howToUseStepByStep: [
      { step: '1. الشراء عند الأرضيات الخضراء', description: 'اشترِ لما السهم يقرب من خط الدعم الأخضر ويثبت فوقه.' },
      { step: '2. البيع عند الأسقف الحمراء', description: 'بيع وجني أرباحك لما السهم يقرب من خط المقاومة الأحمر.' },
      { step: '3. كسر السقف يتحول لأرضية', description: 'لو السهم كسر السقف الأحمر وقفل فوقه، السقف ده بيتحول لأرضية دور جديدة بتشتري عليها مع أول ترييحة.' }
    ],
    extractedInsights: [
      'خريطة بصرية واضحة لأدوار السهم',
      'تحديد الأهداف السعرية الواقعية بدقة',
      'معرفة مستويات وقف الخسارة المنطقية'
    ],
    recommendedSettings: 'الفريم اليومي وفريم 4 ساعات.',
    confluenceWith: ['Room to Move', 'Volume Profile', 'ORB'],
    pitfallsAndFalseSignals: [
      'المستوى اللي اتخبط فيه السعر 5 أو 6 مرات بيبدأ يضعف وممكن يتكسر في أي لحظة؛ راقب الفوليوم دايماً.'
    ]
  },
  {
    id: 'egx_activity_tz',
    nameEn: 'EGX Activity - [Tamer Zaky]',
    nameAr: 'مؤشر نشاط وسيولة السوق المصري - تامر زكي',
    category: 'egx_custom',
    categoryLabel: 'سكربتات البورصة المصرية ومجتمع التداول',
    badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    difficulty: 'متوسط',
    type: 'سيولة وحيتان (Smart Money)',
    tradingViewSearchTerm: 'EGX Activity - [Tamer Zaky]',
    author: 'Tamer Zaky',
    overview: 'مؤشر الرادار اللي بيرصد السيولة غير المعتادة (Unusual Volume) في أسهم البورصة المصرية. أول ما سهم يدخل عليه فوليوم مفاجئ يفوق المعتاد بـ 3 أو 4 أضعاف، المؤشر بيديك إنذار فوري.',
    objective: 'الهدف إنك تعرف السهم اللي الصناديق بتلم فيه في الخفاء قبل ما الخبر ينزل في الجرايد ويطير السهم.',
    whenToUse: 'أثناء جلسة التداول اليومية لصيد الأسهم النشطة اللي بتتحرك فيها السيولة الساخنة.',
    whyUseIt: 'لأن السعر ممكن يكذب، بس الفوليوم عمره ما بيكذب! الفوليوم هو البصمة الوحيدة اللي الصناديق متقدرش تخفيها.',
    howToUseStepByStep: [
      { step: '1. تنبيه النشاط الاستثنائي', description: 'المؤشر بيظهر عمود ملون بألوان زاهية بيعكس انفجار الفوليوم.' },
      { step: '2. فحص موقع السهم في العمارة', description: 'لو النشاط ده حصل والسهم عند أرضية دور (دعم)، دي إشارة تجميع وشراء قوية جداً.' },
      { step: '3. الحذر عند القمم', description: 'لو النشاط ده حصل بعد صعود كبير والسهم خابط في سقف، ده ممكن يكون تصريف وتخفيف كميات.' }
    ],
    extractedInsights: [
      'رصد الدخول المؤسسي المفاجئ في بدايته',
      'التفرقة بين التجميع الحقيقي والتداول الخامل'
    ],
    recommendedSettings: 'فريم الساعة والفريم اليومي.',
    confluenceWith: ['MCDX Plus', 'ORB', 'Trend Signals'],
    pitfallsAndFalseSignals: [
      'لو الفوليوم عالي جداً بس الشمعة قفلت بديل علوي طويل لأسفل، ده بيع وتصريف متشتريش معاه.'
    ]
  },

  // ==========================================
  // 3. MOVING AVERAGES & MAJOR CROSSOVERS
  // ==========================================
  {
    id: 'golden_cross',
    nameEn: 'EMA 50 / 200 Golden Cross',
    nameAr: 'التقاطع الذهبي التاريخي وتقاطع الموت (Golden & Death Cross)',
    category: 'moving_averages',
    categoryLabel: 'المتوسطات والتقاطعات الكبرى',
    badgeColor: 'bg-md-secondary-container text-md-on-secondary-container',
    difficulty: 'مبتدئ إلى متوسط',
    type: 'اتجاه (Trend)',
    tradingViewSearchTerm: 'EMA 50 / 200 Golden Cross',
    overview: 'بص يا صاحبي، ده "عمود الخيمة" في أسواق المال العالمية كلها! التقاطع الذهبي بيحصل لما المتوسط المتحرك الأسي لـ 50 يوم (EMA 50) يقطع لفوق متوسط 200 يوم (EMA 200). ده إعلان رسمي إن السهم دخل في سوق صاعد تاريخي هيمتد لشهور أو سنين. والعكس هو تقاطع الموت (Death Cross) لما الـ 50 يكسر تحت الـ 200.',
    objective: 'الهدف إنك تعرف الاتجاه الكلي للاستثمار طويل الأجل وتكون في أمان تام مع الصناديق الكبيرة.',
    whenToUse: 'للمستثمرين والمتداولين السوينج اللي مش عاوزين يقعدوا قدام الشاشة كل دقيقة؛ بتركب السهم وتسيبه يكبر في محفظتك.',
    whyUseIt: 'لأن خوارزميات كل البنوك وصناديق الاستثمار في العالم مبرمجة تضخ سيولة شراء ضخمة أول ما يحصل التقاطع ده!',
    howToUseStepByStep: [
      { step: '1. رصد اقتراب الخطين', description: 'راقب متوسط 50 وهو بينحني لفوق ويقرب يلمس متوسط 200.' },
      { step: '2. حدوث التقاطع الذهبي', description: 'يتقاطع الخطين وتأكد إن السعر نفسه بيتداول فوقهم هما الاتنين.' },
      { step: '3. الشراء مع إعادة الاختبار (The Golden Retest)', description: 'أحسن وقت تشتري فيه مش يوم التقاطع، بل لما السهم يريح بعدها بكام يوم ويلمس متوسط 50 دون ما يكسره.. دي نقطة الدخول الذهبية!' },
      { step: '4. صمام الأمان والخروج', description: 'طول ما السهم فوق متوسط 50 يوم إنت مطمن؛ بتخرج لو كسر متوسط 50 بإغلاق أسبوعي.' }
    ],
    extractedInsights: [
      'تأكيد انطلاق موجة صعود رئيسية تاريخية',
      'تحديد صمام الأمان العام (فوق 200 = شراء وتجميع / تحت 200 = حذر وتخفيف)',
      'معرفة الأسهم القيادية اللي هتسوق السوق كله'
    ],
    recommendedSettings: 'المتوسط المتحرك الأسي (EMA) للفترات 50 و 200 على الفريم اليومي (1D).',
    confluenceWith: ['Loken Smart Money', 'MCDX Plus', 'Volume Profile'],
    pitfallsAndFalseSignals: [
      'المؤشر ده بطيء بطبيعته؛ متدورش بيه على قاع السهم في الأول، هو معمول عشان يديك "الأمان والاستمرارية".'
    ]
  },
  {
    id: 'vwma',
    nameEn: 'VWMA (Volume Weighted Moving Average)',
    nameAr: 'المتوسط المتحرك المرجح بحجم التداول (VWMA)',
    category: 'moving_averages',
    categoryLabel: 'المتوسطات والتقاطعات الكبرى',
    badgeColor: 'bg-md-secondary-container text-md-on-secondary-container',
    difficulty: 'متوسط',
    type: 'اتجاه (Trend)',
    tradingViewSearchTerm: 'VWMA (Volume Weighted Moving Average)',
    author: 'Standard Technical Analysis',
    overview: 'المتوسطات العادية بتحسب الأسعار بس، لكن الـ VWMA بيحسب السعر مضروب في الفوليوم! يعني الجلسة اللي فيها تداول بـ 100 مليون جنيه بيديها وزن وأهمية 10 أضعاف الجلسة اللي فيها تداول بـ 10 مليون بس.',
    objective: 'الهدف إنه يكشفلك السعر العادل الحقيقي اللي المؤسسات اشترت بيه، ويفضح الكسور الوهمية اللي بتحصل بفوليوم ضعيف.',
    whenToUse: 'بنستخدمه مع كسر المقاومات والدعوم عشان نتأكد إن الكسر حقيقي.',
    whyUseIt: 'لأنه بيكشف على طول لو كان في شمعة خضراء طالعة من غير فوليوم؛ وقتها الـ VWMA بيفضل تحت السعر ومش بيصدق الحركة.',
    howToUseStepByStep: [
      { step: '1. مقارنة الـ VWMA مع المتوسط العادي (SMA 20)', description: 'لو خط الـ VWMA أعلى من خط الـ SMA، ده معناه إن السيولة الكبيرة بتشتري بأسعار أعلى (تجميع صاعد).' },
      { step: '2. الارتكاز على الخط كدعم', description: 'في الاتجاهات الصاعدة، خط VWMA بيكون زي المغناطيس؛ السعر بينزل يلمسه ويرتد منه بقوة.' },
      { step: '3. كسر الخط بإغلاق', description: 'كسر خط VWMA لأسفل بفوليوم عالي هو جرس إنذار صريح لبدء تصحيح.' }
    ],
    extractedInsights: [
      'تصفية الكسور الكاذبة في القمم والقيعان',
      'تحديد مستوى السعر العادل للمؤسسات'
    ],
    recommendedSettings: 'الفترة 20 على الفريم اليومي وفريم الساعة.',
    confluenceWith: ['Volume Profile', 'Bollinger Bands', 'Order Blocks'],
    pitfallsAndFalseSignals: [
      'في الأيام اللي السوق كله نايم فيها والفوليوم ميت، المؤشر ده بيبقى زيه زي المتوسط العادي.'
    ]
  },
  {
    id: 'guppy_mma',
    nameEn: 'GMMA (Guppy Multiple Moving Average)',
    nameAr: 'شبكة متوسطات جوبي المتعددة (Guppy MMA)',
    category: 'moving_averages',
    categoryLabel: 'المتوسطات والتقاطعات الكبرى',
    badgeColor: 'bg-md-secondary-container text-md-on-secondary-container',
    difficulty: 'متوسط إلى متقدم',
    type: 'اتجاه (Trend)',
    tradingViewSearchTerm: 'Guppy Multiple Moving Average (GMMA)',
    author: 'Daryl Guppy',
    overview: 'ابتكره المتداول الأسترالي داريل جوبي؛ عبارة عن شبكتين من المتوسطات: شبكة قصيرة الأجل (3, 5, 8, 10, 12, 15) بتمثل عواطف الأفراد والمضاربين اللحظيين، وشبكة طويلة الأجل (30, 35, 40, 45, 50, 60) بتمثل سلوك وتمركز الصناديق والمستثمرين الكبار.',
    objective: 'الهدف إنك تفصل بين تذبذبات الأفراد الخايفة وقرارات المؤسسات الهادية، وتعرف إمتى الصناديق بتدعم السهم.',
    whenToUse: 'بنستخدمه لمتابعة الاتجاهات القوية واقتناص أفضل فرص الركوب مع التراجعات.',
    whyUseIt: 'لأنه بيوريك بصرياً حالة "التشابك والانفراج"؛ لما الشبكتين يفتحوا لفوق زي المروحة، اعرف إن الرالي شغال ومستمر بقوة.',
    howToUseStepByStep: [
      { step: '1. انفراج الشبكة المؤسسية', description: 'تأكد إن خطوط الشبكة الطويلة (المؤسسات) واسعة وماشية لفوق بانتظام.' },
      { step: '2. ارتداد شبكة الأفراد', description: 'لما تلاقي خطوط الأفراد القصيرة نزلت لمست خطوط المؤسسات وارتدت منها لفوق، دي أفضل نقطة شراء سوينج.' },
      { step: '3. التحذير من الانعكاس', description: 'لو خطوط الأفراد كسرت الشبكة المؤسسية كلها ونزلت تحتها، اخرج فوراً لأن الاتجاه اتغير.' }
    ],
    extractedInsights: [
      'معرفة هل الصناديق لسه بتدعم السهم ولا بتصرف',
      'تحديد أفضل نقاط الدخول مع التصحيحات (Dip Buying)'
    ],
    recommendedSettings: 'الإعدادات الكلاسيكية لجوبي (12 خط متوسط) على الفريم اليومي.',
    confluenceWith: ['MCDX Plus', 'L3 Gemini', 'Trend Signals'],
    pitfallsAndFalseSignals: [
      'في الأسواق العرضية الضيقة، الشبكات بتتشابك في بعضها زي خيوط الصوف وتديك إشارات كاذبة؛ استخدمه بس في الأسهم اللي فيها ترند.'
    ]
  },

  // ==========================================
  // 4. VOLUME & LIQUIDITY (المراية الثالثة وبنزين العربية)
  // ==========================================
  {
    id: 'volume_profile',
    nameEn: 'Volume Profile (Visible Range & Fixed Range)',
    nameAr: 'مؤشر بروفايل السيولة ونقطة السيطرة (Volume Profile & POC)',
    category: 'volume_liquidity',
    categoryLabel: 'السيولة وملف الحجم (Volume Profile)',
    badgeColor: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300',
    difficulty: 'متقدم / شغل مؤسسات',
    type: 'سيولة وحيتان (Smart Money)',
    tradingViewSearchTerm: 'Volume Profile Fixed Range / VPVR',
    author: 'Market Profile Standards',
    overview: 'الفوليوم العادي بيبينلك الفوليوم اللي حصل في "اليوم الفلاني"، لكن الـ Volume Profile بيوريك الفوليوم اللي حصل عند "السعر الفلاني"! يعني بيرسم عواميد أفقية جنب الشارت بتكشفلك بالقرش: إيه هو أكتر سعر البورصة المصرية اتداولت عليه في السهم ده؟ النقطة دي اسمها نقطة السيطرة (POC - Point of Control).',
    objective: 'الهدف إنك تعرف الأسعار اللي الحيتان بيعتبروها قيمة عادلة للسهم، وتبعد عن الفراغات السعرية اللي مفيهاش سيولة.',
    whenToUse: 'بنستخدمه لتحديد الدعوم والمقاومات الفولاذية ومناطق المغناطيس السعري.',
    whyUseIt: 'لأن السعر لما يهرب بعيد عن منطقة الـ POC بيرجع لها تاني زي المغناطيس؛ ولو كسرها وثبت فوقها بينطلق للدور اللي بعده مباشرة.',
    howToUseStepByStep: [
      { step: '1. تحديد خط الـ POC الأحمر', description: 'ده السعر اللي اتنفذ عليه أعلى كمية أسهم؛ بيعتبر أقوى دعم أو مقاومة للسهم.' },
      { step: '2. منطقة القيمة العادلة (Value Area - VAH & VAL)', description: 'المنطقة اللي حصل فيها 70% من التداول؛ لو السعر نزل تحت الـ VAL دي منطقة خصم ممتازة للشراء.' },
      { step: '3. الفراغات منخفضة الفوليوم (LVN)', description: 'المناطق اللي مفيهاش عواميد فوليوم أفقية؛ السهم بيطير فيها بسرعة الصاروخ ومفيش حاجة توقفه.' }
    ],
    extractedInsights: [
      'السعر الدقيق اللي متمركزة فيه محافظ الصناديق (POC)',
      'مناطق المغناطيس السعري ومناطق الانفجار السريع'
    ],
    recommendedSettings: 'بروفايل النطاق المرئي (VPVR) على الفريم اليومي وفريم 4 ساعات.',
    confluenceWith: ['Order Blocks', 'MCDX Plus', 'AI Support & Resistance'],
    pitfallsAndFalseSignals: [
      'لو السهم كسر خط الـ POC بإغلاق قوي لأسفل، متتمسكش بالسهم لأن الـ POC هيتحول لسد خرساني يمنع الطلوع.'
    ]
  },
  {
    id: 'pivot_points_standard',
    nameEn: 'Pivot Points (Standard / Camarilla)',
    nameAr: 'مؤشر النقاط المحورية اليومية والأسبوعية (Pivot Points)',
    category: 'volume_liquidity',
    categoryLabel: 'السيولة وملف الحجم (Volume Profile)',
    badgeColor: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300',
    difficulty: 'مبتدئ إلى متوسط',
    type: 'دعوم ومقاومات (S/R)',
    tradingViewSearchTerm: 'Pivot Points Standard / Camarilla',
    overview: 'دي الحسبة الرياضية الصباحية اللي بيبدأ بيها كل مدير محفظة في البنوك المصرية يومه! بياخد أعلى سعر وأقل سعر وسعر إغلاق جلسة إمبارح، ويطلع بيهم خط نقطة الارتكاز (P) ومستويات الدعم الثلاثة (S1, S2, S3) ومستويات المقاومة الثلاثة (R1, R2, R3).',
    objective: 'الهدف إنك تعرف نطاق تداول اليوم المتوقع وتعرف السهم رخيص ولا غالي بالنسبة لتداولات إمبارح.',
    whenToUse: 'يومياً للمضاربين ومديري الصفقات السريعة مع افتتاح الجلسة.',
    whyUseIt: 'لأن المستويات دي بتتحسب رياضياً وثابتة طول الجلسة ومش بتتغير ولا بتعيد رسم نفسها أبداً.',
    howToUseStepByStep: [
      { step: '1. موقع السعر من خط الارتكاز (Pivot Point P)', description: 'طول ما السهم بيتداول فوق خط الـ P، الجلسة إيجابية والمشتري مسيطر.' },
      { step: '2. الشراء عند S1 و S2', description: 'ارتداد السهم من مستوى الدعم الأول S1 هو أفضل مكان للدخول الصباحي.' },
      { step: '3. البيع وجني الربح عند R1 و R2', description: 'أول ما السهم يلمس المقاومة الأولى R1، بيع جزء من كميتك لأن دي مستهدفات الصناديق.' }
    ],
    extractedInsights: [
      'مستويات رياضية ثابتة ومحترمة جداً من خوارزميات التداول',
      'تحديد سقف وقاع حركة الجلسة اليومية المتوقعة'
    ],
    recommendedSettings: 'النوع (Traditional أو Camarilla) بإطار زمني Daily للمضاربة و Weekly للسوينج.',
    confluenceWith: ['ORB', 'VWMA', 'AI Support & Resistance'],
    pitfallsAndFalseSignals: [
      'في أيام الأخبار الاقتصادية القوية وتعويم العملة، السهم ممكن يكسر كل مستويات المقاومة R1 و R2 و R3 في دقائق؛ ساعتها اعتمد على الفوليوم.'
    ]
  },

  // ==========================================
  // 5. MOMENTUM & VOLATILITY (مرايا الزخم والتذبذب والضغط)
  // ==========================================
  {
    id: 'bollinger_bands',
    nameEn: 'Bollinger Bands (%B & BandWidth Squeeze)',
    nameAr: 'مؤشر أشرطة بولنجر ومصيدة الانضغاط (Bollinger Bands Squeeze)',
    category: 'momentum_volatility',
    categoryLabel: 'الزخم والتقلب والانفراجات',
    badgeColor: 'bg-purple-500/15 text-purple-800 dark:text-purple-300',
    difficulty: 'متوسط',
    type: 'تقلب ومساحة حركة (Volatility/RTM)',
    tradingViewSearchTerm: 'Bollinger Bands %B / BandWidth',
    author: 'John Bollinger',
    overview: 'البولنجر باند ده هو "السوستة المضغوطة" في التحليل الفني! عبارة عن متوسط متحرك في النص، وحواليه شريطين علوي وسفلي بيقيسوا التقلب الإحصائي للسهم. لما الشريطين ينضغطوا ويقربوا من بعض أوي، اعرف إن في انفجار سعري ضخم بيجهز في الكواليس!',
    objective: 'الهدف إنك تكتشف السهم قبل ما ينفجر ويطير، وتركب معاه أول ما السوستة تفلت.',
    whenToUse: 'بنستخدمه لما نلاقي سهم نايم في رينج ضيق بقاله أسبوعين تلاتة والناس زهقت منه.',
    whyUseIt: 'لأن فترات الهدوء الشديد دايماً بيتبعها عواصف سعرية؛ البولنجر بيقيسلك بالمليم إمتى العاصفة دي هتبدأ.',
    howToUseStepByStep: [
      { step: '1. رصد انضغاط الحزمة (The Squeeze)', description: 'راقب مؤشر BandWidth لما ينزل لأدنى مستوى في شهرين؛ دي علامة إن السوستة مشدودة لأقصى درجة.' },
      { step: '2. اتساع الحزمة للأعلى (Expansion Breakout)', description: 'أول ما الشموع تكسر الشريط العلوي للبولنجر والخطوط تفتح لبرة، بتدوس شراء فوراً.' },
      { step: '3. ركوب الشريط (Riding the Upper Band)', description: 'في الراليات القوية، السهم بيفضل ماشي بمحاذاة الشريط العلوي؛ استمر في الصفقة طالما السعر فوق الخط الأوسط.' }
    ],
    extractedInsights: [
      'توقع الانفجارات السعرية قبل حدوثها',
      'تحديد مناطق التشبع والارتداد في المسارات العرضية'
    ],
    recommendedSettings: 'الفترة 20 والانحراف المعياري 2.0 على الفريم اليومي وفريم 4 ساعات.',
    confluenceWith: ['Keltner Channels', 'L3 Gemini', 'MCDX Plus'],
    pitfallsAndFalseSignals: [
      'انضغاط البولنجر بيقولك إن في انفجار هيحصل، بس مش بيحدد لوحده الاتجاه؛ لازم تدمجه مع الاتجاه العام (EMA) عشان تتأكد إن الانفجار لفوق مش لتحت.'
    ]
  },
  {
    id: 'atr_fibonacci',
    nameEn: 'ATR (Average True Range) & Trailing Stop',
    nameAr: 'مؤشر مدى التذبذب الحقيقي وحزام الأمان (ATR Stop Loss)',
    category: 'momentum_volatility',
    categoryLabel: 'الزخم والتقلب والانفراجات',
    badgeColor: 'bg-purple-500/15 text-purple-800 dark:text-purple-300',
    difficulty: 'متوسط',
    type: 'تقلب ومساحة حركة (Volatility/RTM)',
    tradingViewSearchTerm: 'Average True Range (ATR) / Chandelier Exit',
    author: 'J. Welles Wilder',
    overview: 'ده "حزام الأمان" ومقياس المسافات في عربية التداول يا صاحبي! الـ ATR مش بيحدد السهم طالع ولا نازل، هو بيقيسلك السهم ده "بيتحرك كام جنيه في اليوم في المتوسط؟". يعني لو سهم الـ ATR بتاعه 2 جنيه، مينفعش تحط وقف خسارة 20 قرش لأنه هيتضرب في أول 5 دقايق صدفة!',
    objective: 'الهدف إنك تظبط وقف الخسارة بحيث يكون بعيد كفاية عن تذبذب السوق العادي، وقريب كفاية عشان يحمي محفظتك من الخسائر الكبيرة.',
    whenToUse: 'مع كل صفقة بتفتحها في ثاندر، لازم تحسب الـ ATR عشان تحط رقم وقف الخسارة المظبوط.',
    whyUseIt: 'لأنه بيلغي العواطف والتخمين العشوائي؛ كل سهم له شخصية وتذبذب خاص بيه، والـ ATR بيفصل لكل سهم حزام أمان على مقاسه.',
    howToUseStepByStep: [
      { step: '1. قراءة رقم الـ ATR', description: 'بص على المؤشر، لو السهم سعره 50 جنيه والـ ATR بتاعه 1.5 جنيه.' },
      { step: '2. حساب وقف الخسارة (1.5x ATR)', description: 'اضرب الـ ATR في 1.5 (يعني 2.25 جنيه) واطرحه من سعر الدخول، يبقى وقفك عند 47.75 جنيه.' },
      { step: '3. حساب المستهدف (3x ATR)', description: 'اضرب الـ ATR في 3 واجمعه على سعر الدخول (يعني 4.5 جنيه ربح مستهدف)، يبقى هدفك 54.50 جنيه (نسبة 1:2 ممتازة).' }
    ],
    extractedInsights: [
      'حساب وقف خسارة احترافي لا ينضرب عشوائياً',
      'تحديد الأهداف الواقعية لحركة السهم اليومية'
    ],
    recommendedSettings: 'الفترة القياسية 14 على الفريم اليومي وفريم الساعة.',
    confluenceWith: ['Room to Move', 'AI Support & Resistance', 'Order Blocks'],
    pitfallsAndFalseSignals: [
      'إياك تستخدم رقم وقف خسارة ثابت لكل الأسهم (زي 2% في كل سهم)؛ السهم الهادي يختلف تماماً عن سهم المضاربات العنيف.'
    ]
  },
  {
    id: 'williams_r',
    nameEn: 'Williams %R',
    nameAr: 'مؤشر ويليامز السريع لصيد القيعان (Williams %R)',
    category: 'momentum_volatility',
    categoryLabel: 'الزخم والتقلب والانفراجات',
    badgeColor: 'bg-purple-500/15 text-purple-800 dark:text-purple-300',
    difficulty: 'مبتدئ إلى متوسط',
    type: 'زخم (Momentum)',
    tradingViewSearchTerm: 'Williams %R',
    author: 'Larry Williams',
    overview: 'ابتكره المتداول الأسطوري لاري ويليامز؛ مؤشر سريع جداً بيتحرك بين 0 و -100. ميزته الكبرى إنه غالباً بيغير اتجاهه ويعمل قاع قبل ما السعر نفسه يغير اتجاهه بيوم أو يومين، فبيعتبر مؤشر قيادي (Leading Indicator) بيسبق حركة الشموع.',
    objective: 'الهدف إنك تصطاد قيعان الترييحة السريعة بدري جداً قبل ما السوق كله يلاحظ.',
    whenToUse: 'في صفقات السوينج والمضاربة السريعة لما السهم يكون في ترند صاعد وريح كام يوم.',
    whyUseIt: 'لأنه بيرصد إرهاق البائعين ووصولهم لحالة استنزاف مفرطة (أقل من -80).',
    howToUseStepByStep: [
      { step: '1. هبوط المؤشر تحت -80', description: 'السهم كده في منطقة تخفيضات وتشبع بيعي مفرط.' },
      { step: '2. ارتداد المؤشر فوق -80', description: 'أول ما المؤشر يكسر مستوى -80 طالع لفوق، ده زرار إطلاق أمر الشراء الفعلي.' },
      { step: '3. البيع عند منطقة -20', description: 'بيع وجني أرباحك السريعة أول ما المؤشر يوصل فوق -20 (منطقة التشبع الشرائي).' }
    ],
    extractedInsights: [
      'إشارات سريعة تسبق حركة السعر بيوم إلى يومين',
      'توقيت دقيق لانتهاء التهدئة في الأسهم الصاعدة'
    ],
    recommendedSettings: 'الفترة 14 على الفريم اليومي وفريم الساعة.',
    confluenceWith: ['AI Support & Resistance', 'Bollinger Bands', 'VWMA'],
    pitfallsAndFalseSignals: [
      'في الانهيارات القوية، المؤشر ممكن يفضل لاصق عند -100 لكذا يوم؛ متشتريش وهو في القاع إلا لما يكسر خط -80 صعوداً.'
    ]
  },
  {
    id: 'fisher_transform',
    nameEn: 'Fisher Transform',
    nameAr: 'مؤشر فيشر ترانسفورم للقمم والقيعان الحادة (Fisher Transform)',
    category: 'momentum_volatility',
    categoryLabel: 'الزخم والتقلب والانفراجات',
    badgeColor: 'bg-purple-500/15 text-purple-800 dark:text-purple-300',
    difficulty: 'متوسط إلى متقدم',
    type: 'زخم (Momentum)',
    tradingViewSearchTerm: 'Fisher Transform',
    author: 'John Ehlers',
    overview: 'مؤشر رياضي عبقري صممه عالم الصواريخ والرياضيات جون إيلرز؛ بيحول حركة الأسعار العشوائية لمنحنى توزيع طبيعي (Gaussian Normal Distribution). ميزته إنه بيحول القمم والقيعان المنحنية لزوايا حادة جداً ومسننة تظهرلك بوضوح اللحظة اللي السهم بيفرمل فيها ويعكس اتجاهه.',
    objective: 'الهدف التقاط نقاط الانعكاس المحورية الحادة (Pivot Turning Points) بأسرع وقت ممكن وبأقل تأخير زمني.',
    whenToUse: 'بنستخدمه لصيد نهايات الموجات التصحيحية وركوب موجات الارتداد.',
    whyUseIt: 'لأنه أسرع بكتير من MACD و RSI في تغيير إشارته فور ارتداد السعر.',
    howToUseStepByStep: [
      { step: '1. وصول المؤشر لمستويات قصوى', description: 'وصول خط فيشر لأقل من -2.0 بيعني إن السهم وصل لقاع إحصائي حاد ونادر.' },
      { step: '2. التقاطع الصاعد لخط الإشارة', description: 'تقاطع خط فيشر السريع فوق خط الإشارة البطيء بيدي إشارة شراء فورية.' },
      { step: '3. الخروج عند القمة القصوى', description: 'جني الأرباح لما المؤشر يوصل فوق +2.0 ويبدأ يتقاطع لأسفل.' }
    ],
    extractedInsights: [
      'نقاط انعكاس حادة وسريعة خالية من التأخير الزمني (Zero Lag)',
      'تحديد القيعان الإحصائية النادرة بدقة عالية'
    ],
    recommendedSettings: 'الفترة القياسية 9 أو 10 على الفريم اليومي وفريم 4 ساعات.',
    confluenceWith: ['Order Blocks', 'Liquidity Sweeps', 'L3 Gemini'],
    pitfallsAndFalseSignals: [
      'بسبب سرعته الفائقة، قد يعطي تقاطعات سريعة متتالية في الأسواق العرضية؛ اشترِ فقط عندما يكون عند أطراف النطاق (أقل من -2.0).'
    ]
  }
];

export const GROWTHX_SEVEN_LAYERS = [
  {
    layerNumber: 1,
    title: 'مراية الاتجاه العام (The Trend Mirror)',
    subtitle: 'مينفعش تسوق عربيتك عكس اتجاه الطريق السريع!',
    purpose: 'معرفة المسار الكلي للسوق والسهم؛ لو السهم في مسار هابط الصناديق بتبيع وإنت داخل تشتري، كأنك ماشي عكس السير على الدائري.',
    actionRule: 'السهم لازم يكون فوق متوسط 50 يوم ومتوسط 200 يوم بزاوية صاعدة؛ لو تحت 200 يوم الصفقة ملغية تماماً.',
    indicatorsUsed: ['EMA 50', 'EMA 200', 'Golden Cross']
  },
  {
    layerNumber: 2,
    title: 'مراية الزخم وقوة الدوسة (Momentum Mirror)',
    subtitle: 'سيبك من الـ RSI القديم.. بنقيس قوة الدوسة على دواسة البنزين!',
    purpose: 'التأكد إن المشتري دايس بنزين وعنده عزم يرفع السهم، وإن البياع طاقته استنزفت وخلصت خلاص.',
    actionRule: 'ظهور دايفرجنس إيجابي ومؤشر L3 Gemini عاطي ومضة خضراء فوق خط الصفر.',
    indicatorsUsed: ['L3 Gemini', 'MACD', 'Williams %R']
  },
  {
    layerNumber: 3,
    title: 'مراية البنزين والسيولة (Volume Fuel Mirror)',
    subtitle: 'العربية مهما كانت فخمة، لو التانك فاضي مش هتتحرك!',
    purpose: 'التأكد إن الوقود اللي بيحرك السهم هو فلوس حيتان ومؤسسات (Bankers) مش شوية أفراد ومضاربين صغار بيجروا ورا بعض.',
    actionRule: 'نسبة سيولة البانكرز في MCDX Plus أكبر من 50% باللون الأحمر، وفوليوم التداول أعلى من متوسط 20 يوم.',
    indicatorsUsed: ['MCDX Plus', 'Volume Profile (POC)', 'EGX Activity']
  },
  {
    layerNumber: 4,
    title: 'مراية التذبذب ومساحة الحركة (Volatility & RTM)',
    subtitle: 'عمارة الأدوار: أنت في الدور الكام؟ والسقف اللي فوقك على بعد قد إيه؟',
    purpose: 'التأكد إن قدامك مساحة مكسب حرة (Room to Move) ومفيش سقف خرساني قريب يخبط في دماغك، وحساب وقف خسارة آمن بمؤشر ATR.',
    actionRule: 'نسبة المكسب للمخاطرة (Risk to Reward) لازم تكون 1:2.5 على الأقل، وممنوع الشراء تحت سقف مقاومة عاتية.',
    indicatorsUsed: ['Room to Move (RTM)', 'ATR', 'AI Support & Resistance']
  },
  {
    layerNumber: 5,
    title: 'طبقة الانضغاط والانفجار (The Squeeze Layer)',
    subtitle: 'السوستة المضغوطة: لما تفلت بتطير في الهوا!',
    purpose: 'رصد السهم وهو في عنق الزجاجة قبل ما ينطلق؛ فترات الهدوء الطويل دايماً بيتبعها انفجارات سعرية ضخمة.',
    actionRule: 'انضغاط حزمة البولنجر باند وبداية التوسع والانفتاح للأعلى مع زيادة الفوليوم.',
    indicatorsUsed: ['Bollinger Bands Squeeze', 'BandWidth']
  },
  {
    layerNumber: 6,
    title: 'طبقة تعدد الأطر الزمنية (Multi-Timeframe)',
    subtitle: 'نظرة الطيارة الهليكوبتر: إياك تبص في شبر مية وتنسى الفريم الكبير!',
    purpose: 'التأكد إن الفريمات الكبيرة (الأسبوعي واليومي) بتدعم الفريم الصغير (الساعة)، عشان متشتريش ضد التيار الأكبر.',
    actionRule: 'الأسبوعي صاعد + اليومي مهدئ عند دعم + فريم الساعة بيدي أول شمعة شراء وارتداد.',
    indicatorsUsed: ['Weekly Bias', 'Daily Structure', '1H Execution']
  },
  {
    layerNumber: 7,
    title: 'طبقة الأموال الذكية وصناع السوق (Smart Money Concepts)',
    subtitle: 'مصيدة سحب السيولة: الحوت ضرب وقف الأفراد وطلع بطلقة!',
    purpose: 'رصد الحركات الملعوبة وصيد كتل أوامر الشراء الحقيقية (Demand Order Blocks) بعد ضرب وقوف الأفراد.',
    actionRule: 'ارتداد مؤكد من كتلة أوامر شراء حيتان بعد سحب سيولة (Liquidity Sweep) مع كسر هيكل صاعد (BOS/CHoCH).',
    indicatorsUsed: ['Order Blocks', 'Liquidity Sweeps', 'Loken SMC']
  }
];
