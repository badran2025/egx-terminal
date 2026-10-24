// =========================================================================
// THNDR INDICATORS KNOWLEDGE BASE & 7-LAYERS MAPPING (موسوعة مؤشرات تطبيق ثاندر)
// =========================================================================

export interface ThndrIndicatorItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'tamer_zaky' | 'trend' | 'momentum' | 'volume' | 'volatility' | 'support_resistance';
  categoryLabel: string;
  badgeColor: string;
  isCustomScript: boolean;
  corresponding7Layer?: number;
  layerName?: string;
  overviewBaladi: string;
  jobOnThndr: string;
  howToSetupInThndr: string;
  buySignalBaladi: string;
  exitSignalBaladi: string;
  friendAdvice: string;
}

export interface ThndrIndicatorDetail {
  nameEn: string;
  nameAr: string;
  role: string;
  badge?: string;
}

export interface SevenLayerThndrMapping {
  layerNumber: number;
  layerName: string;
  mirrorName: string;
  analogyTitle: string;
  thndrPrimaryIndicator: string;
  thndrSecondaryIndicator: string;
  thndrIndicatorsList: ThndrIndicatorDetail[];
  isAvailableOnThndr: boolean;
  howToApplyInThndr: string;
  explanationBaladi: string;
  whatToLookFor: string;
}

// =========================================================================
// 1. خريطة مطابقة الطبقات السبع مع مؤشرات تطبيق ثاندر (Thndr 7-Layers Mapping)
// =========================================================================
export const THNDR_SEVEN_LAYERS_MAPPING: SevenLayerThndrMapping[] = [
  {
    layerNumber: 1,
    layerName: 'الاتجاه العام المزدوج للسوق والسهم (The Dual Trend)',
    mirrorName: 'مراية الطريق السريع (EGX30 + السهم)',
    analogyTitle: 'مينفعش تسوق عربيتك عكس اتجاه الطريق السريع!',
    thndrPrimaryIndicator: 'Moving Average Exponential (EMA 50 & EMA 200)',
    thndrSecondaryIndicator: 'Trend Signals - [Tamer Zaky] / RMI Trend - [Tamer Zaky]',
    thndrIndicatorsList: [
      {
        nameEn: 'Moving Average Exponential (EMA 50)',
        nameAr: 'المتوسط المتحرك الأسي 50 يوم',
        role: 'خط الدعم الحركي السريع لاتجاه الأسابيع ولحركة مؤشر EGX30 العام.',
        badge: 'مؤشر أساسي'
      },
      {
        nameEn: 'Moving Average Exponential (EMA 200)',
        nameAr: 'المتوسط المتحرك الأسي 200 يوم',
        role: 'خط الأمان المؤسسي الأكبر للمحافظ والصناديق؛ طول ما السهم والمؤشر فوقه فالسوق في أمان استثماري.',
        badge: 'خط الأمان الأكبر'
      },
      {
        nameEn: 'Trend Signals - [Tamer Zaky]',
        nameAr: 'سكربت إشارات الاتجاه لتامر زكي',
        role: 'بديل سريع في ثاندر يلون الشموع بالأخضر عند الصعود وبالأحمر عند الهبوط.',
        badge: 'بديل في ثاندر'
      }
    ],
    isAvailableOnThndr: true,
    howToApplyInThndr: 'افتح شارت ثاندر، دوس على علامة المؤشرات (Indicators)، واكتب "Moving Average Exponential" وضيفه مرتين؛ الأولى ادخل إعداداتها واكتب الطول (Length) = 50 وخلي لونه أزرق، والتانية اكتب الطول = 200 وخلي لونه برتقالي أو أحمر. أو اختار مؤشر "Trend Signals - [Tamer Zaky]".',
    explanationBaladi: 'الاتجاه العام يا صاحبي هو البوصلة. السهم لو بيتداول فوق خط الـ 200 يوم وخط الـ 50 يوم، معناه إن البورصة والمؤسسات في صفك والسكة سالكة. لو السهم تحت خط 200، كأنك ماشي عكس السير على الدائري، وممنوع تشتري فيه حتى لو شفت شمعة خضراء مغرية!',
    whatToLookFor: 'شموع السهم تتداول بثبات أعلى خط EMA 50 و EMA 200 بزاوية ميل صاعدة للأعلى بالتزامن مع ثبات مؤشر EGX30 فوق دعمه الفني.'
  },
  {
    layerNumber: 2,
    layerName: 'الزخم وقوة الدوسة (Momentum)',
    mirrorName: 'مراية دواسة البنزين (RSI + MACD)',
    analogyTitle: 'بنقيس قوة الدوسة على دواسة البنزين.. المشترين بيدوسوا ولا مفرملين؟',
    thndrPrimaryIndicator: 'Relative Strength Index (RSI) + مؤشر MACD',
    thndrSecondaryIndicator: 'Stochastic RSI / Momentum',
    thndrIndicatorsList: [
      {
        nameEn: 'Relative Strength Index (RSI)',
        nameAr: 'مؤشر القوة النسبية (RSI)',
        role: 'دواسة البنزين: قياس عزم وسرعة حركة الشموع (منطقة 40 - 60 نقطة هي منطقة الانطلاق الذهبية والتجميع الصحي).',
        badge: 'المؤشر الأول بالشارت'
      },
      {
        nameEn: 'MACD (Moving Average Convergence Divergence)',
        nameAr: 'مؤشر الماكد (MACD)',
        role: 'تأكيد انطلاق الزخم: تقاطع الخط السريع للأعلى فوق خط الإشارة وتحول أعمدة الهيستوجرام للون الأخضر فوق خط الصفر.',
        badge: 'المؤشر الثاني بالشارت'
      }
    ],
    isAvailableOnThndr: true,
    howToApplyInThndr: 'في شارت ثاندر دوس على علامة المؤشرات (Indicators)، واكتب "Relative Strength Index" واختاره، وارجع دوس على المؤشرات تاني واكتب "MACD" واختاره؛ هيظهروا الاتنين تحت بعض أسفل الشموع في ثاندر زي ما هما معروضين في شارت المعمل تماماً!',
    explanationBaladi: 'الزخم وقوة الدوسة بيتقاسوا بمؤشرين متكاملين مع بعض على الشارت: مؤشر RSI بيقيس عزم وحماسة المشترين؛ لما يكون بين 45 و 60 نقطة، دي "منطقة الانطلاق الذهبية" يعني السهم خفيف ومش متضخم. ومؤشر MACD بيأكد لك إن الموجة بدأت فعلاً لما خط الماكد يقطع خط الإشارة لفوق وأعمدة الهيستوجرام تقلب أخضر فوق خط الصفر. الاتنين مع بعض بيدوك إشارة دخول حديدية!',
    whatToLookFor: 'مؤشر RSI يرتد من فوق خط 40-50 ويتجه للأعلى، وأعمدة MACD تقلب من اللون الأحمر إلى الأخضر فوق خط الصفر.'
  },
  {
    layerNumber: 3,
    layerName: 'حجم التداول والسيولة (Volume Fuel)',
    mirrorName: 'مراية تانك بنزين العربية',
    analogyTitle: 'العربية مهما كانت فخمة وشيك، لو التانك فاضي مش هتتحرك شبر!',
    thndrPrimaryIndicator: 'Volume (مؤشر حجم التداول الكلاسيكي)',
    thndrSecondaryIndicator: 'Liquidity - [Tamer Zaky] / Money Flow Index',
    thndrIndicatorsList: [
      {
        nameEn: 'Volume',
        nameAr: 'مؤشر حجم التداول الكلاسيكي',
        role: 'تانك بنزين السهم: الأعمدة الخضراء الطويلة تدل على تجميع ومحافظ كبيرة تشتري، والأعمدة الحمراء القصيرة تؤكد هدوء البيع.',
        badge: 'تلقائي في ثاندر'
      },
      {
        nameEn: 'Liquidity - [Tamer Zaky]',
        nameAr: 'سكربت السيولة لتامر زكي',
        role: 'كشف مستويات تدفق السيولة المؤسسية ونقاط الانفجار الشرائي.',
        badge: 'سكربت ثاندر'
      }
    ],
    isAvailableOnThndr: true,
    howToApplyInThndr: 'مؤشر "Volume" نازل تلقائياً في ثاندر تحت الشارت (الأعمدة الخضراء والحمراء). وتقدر تضيف "Liquidity - [Tamer Zaky]" لمعرفة كتل السيولة أو "Money Flow Index".',
    explanationBaladi: 'الفوليوم هو دم السهم! بنبص على الأعمدة: لما السهم يطلع بأعمدة خضراء طويلة، دي فلوس حيتان ومحافظ كبيرة بتشتري (تجميع). ولما السهم يريح لتحت بأعمدة حمراء صغيرة وقصيرة، اعرف إن مفيش حد من الحيتان بيبيع، وإن ده مجرد هدوء طبيعي وفرصة لشراء الديب.',
    whatToLookFor: 'أعمدة فوليوم شرائي خضراء تتجاوز متوسط 20 يوم، وتضاؤل تام لأعمدة البيع الحمراء عند تراجع السعر.'
  },
  {
    layerNumber: 4,
    layerName: 'التقلب وعمارة الأدوار ومساحة الحركة (Volatility & RTM)',
    mirrorName: 'مراية مساحة الحركة وعمارة الأدوار',
    analogyTitle: 'عمارة الأدوار: أنت في الدور الكام؟ والسقف اللي فوقك على بعد قد إيه؟',
    thndrPrimaryIndicator: 'Average True Range (ATR)',
    thndrSecondaryIndicator: 'ATR Fibonacci Trend / AI Support & Resistance - [Tamer Zaky]',
    thndrIndicatorsList: [
      {
        nameEn: 'Average True Range (ATR)',
        nameAr: 'متوسط المدى الحقيقي (ATR)',
        role: 'حساب متوسط التذبذب اليومي بالجنيهات لتحديد مسافة وقف الخسارة المناسبة دون ضربها عشوائياً.',
        badge: 'مؤشر قياسي'
      },
      {
        nameEn: 'AI Support & Resistance - [Tamer Zaky]',
        nameAr: 'سكربت الدعوم والمقاومات الذكية',
        role: 'رسم أرضيات الأدوار (الدعوم) وأسقف الأدوار (المقاومات) آلياً على شارت ثاندر.',
        badge: 'سكربت ثاندر'
      }
    ],
    isAvailableOnThndr: true,
    howToApplyInThndr: 'في ثاندر ابحث عن "Average True Range" عشان تعرف متوسط التذبذب اليومي للجنيهات، وافتح "AI Support & Resistance - [Tamer Zaky]" عشان يرسم لك أسقف الأدوار (المقاومات) وأرضيات الأدوار (الدعوم) أوتوماتيك.',
    explanationBaladi: 'السوق زي عمارة سكنية: "أرضية الدور" هي الدعم اللي السهم واقف عليه، و"سقف الدور" هو المقاومة اللي فوقك. إحنا بنشتري لما نكون واقفين على أرضية صلبة ويكون بيننا وبين السقف مساحة مكسب واسعة ومفتوحة (Room to Move) مش أقل من 8% إلى 15%، ومخاطرة وقف الخسارة صغيرة (2% إلى 3%).',
    whatToLookFor: 'نسبة عائد إلى مخاطرة تفوق 1:2.5 مع بعد كافٍ عن أقرب مقاومة خرسانية.'
  },
  {
    layerNumber: 5,
    layerName: 'طبقة الانضغاط (The Squeeze Layer)',
    mirrorName: 'طبقة السوستة المضغوطة',
    analogyTitle: 'السوستة لما تنضغط جامد في نطاق ضيق.. أول ما تفلت بتطير في الهوا!',
    thndrPrimaryIndicator: 'Bollinger Bands (أشرطة بولنجر باند)',
    thndrSecondaryIndicator: 'Bollinger Bands Width / Keltner Channels',
    thndrIndicatorsList: [
      {
        nameEn: 'Bollinger Bands',
        nameAr: 'أشرطة بولنجر باند',
        role: 'كشف مرحلة انضغاط السعر بين خطين ضيقين استعداداً لانفجار سعري قوي.',
        badge: 'مؤشر قياسي'
      },
      {
        nameEn: 'Bollinger Bands Width',
        nameAr: 'مؤشر عرض نطاق بولنجر',
        role: 'قياس نسبة انضغاط السوستة؛ كلما قل الرقم دل على انفجار وشيك.',
        badge: 'مؤشر تأكيدي'
      }
    ],
    isAvailableOnThndr: true,
    howToApplyInThndr: 'في ثاندر ابحث عن "Bollinger Bands" وضيفه؛ هيرسم خطين محاوطين الشموع (الخط العلوي والخط السفلي ومتوسط الحركة في النص).',
    explanationBaladi: 'لما تلاقي خطوط البولنجر بتقرب من بعضها والشموع ماشية في ممر ضيق وهادي، اعرف إن السهم في حالة "سوستة مضغوطة". الحيتان بتلم بهدوء في الصندوق ده، وبمجرد ما شمعة تكسر الخط العلوي بفوليوم، السهم بينطلق برالي صاعد سريع.',
    whatToLookFor: 'ضيق ملحوظ في المسافة بين خطوط البولنجر يليه شمعة اختراق خضراء تفتح الخط للأعلى.'
  },
  {
    layerNumber: 6,
    layerName: 'تعدد الأطر الزمنية (Multi-Timeframe)',
    mirrorName: 'نظرة الطيارة الهليكوبتر',
    analogyTitle: 'إياك تبص في شبر مية على فريم الدقيقة وتنسى الفريم الكبير!',
    thndrPrimaryIndicator: 'أزرار الفريمات الزمنية في ثاندر (1D / 1W / 1H)',
    thndrSecondaryIndicator: 'Moving Average Multiple',
    thndrIndicatorsList: [
      {
        nameEn: 'الفريم الأسبوعي (1W)',
        nameAr: 'شارت الأسبوع في ثاندر',
        role: 'رؤية الصورة الكلية من الطيارة الهليكوبتر ومعرفة هل الاتجاه العام صاعد أم هابط.',
        badge: 'الفريم الأكبر'
      },
      {
        nameEn: 'الفريم اليومي (1D)',
        nameAr: 'شارت اليوم في ثاندر',
        role: 'تحديد خطة التداول وموقع أرضية الدور وسقف المقاومة.',
        badge: 'فريم الخطة'
      },
      {
        nameEn: 'فريم الساعة (1H)',
        nameAr: 'شارت الساعة في ثاندر',
        role: 'اقتناص نقطة الدخول اللحظية الدقيقة عند بداية الارتداد.',
        badge: 'فريم التنفيذ'
      }
    ],
    isAvailableOnThndr: true,
    howToApplyInThndr: 'أعلى شارت ثاندر هتلاقي أزرار الفريمات (1D لليومي، 1W للأسبوعي، 1H للساعة). دوس على 1W الأول عشان تشوف السهم من الطيارة الهليكوبتر، وبعدين ارجع لـ 1D لتحديد الخطة، و 1H لاقتناص نقطة الدخول اللحظية.',
    explanationBaladi: 'مينفعش تشتري عشان شفت شمعة خضراء على فريم 5 دقائق والسهم على الفريم الأسبوعي في مسار هابط وبيغرق! بنطابق الفريمات: الأسبوعي صاعد ومستقر، واليومي مريح عند أرضية دعم، وفريم الساعة بدأ يلف ويرتد لفوق.. كده إنت داخل في اتجاه التيار مش عايم عكسه.',
    whatToLookFor: 'توافق اتجاه الفريم الأسبوعي مع الفريم اليومي وتأكيد ارتداد فريم الساعة.'
  },
  {
    layerNumber: 7,
    layerName: 'الأموال الذكية وصناع السوق (Smart Money Concepts)',
    mirrorName: 'مراية أسرار صناع السوق والحيتان',
    analogyTitle: 'مصيدة سحب السيولة: الحوت نزل ضرب وقف الأفراد الصبح وطلع بطلقة!',
    thndrPrimaryIndicator: 'Order Blocks - [Tamer Zaky]',
    thndrSecondaryIndicator: 'AI Support & Resistance - [Tamer Zaky] / Pivot Points Standard',
    thndrIndicatorsList: [
      {
        nameEn: 'Order Blocks - [Tamer Zaky]',
        nameAr: 'سكربت كتل الأوامر المؤسسية',
        role: 'رسم مستطيلات طلب الحيتان (المستطيل الأخضر بالأسفل) ومناطق تصريف العرض (المستطيل الأحمر بالأعلى).',
        badge: 'سكربت ثاندر الرئيسي'
      },
      {
        nameEn: 'Pivot Points Standard',
        nameAr: 'النقاط المحورية القياسية',
        role: 'حساب نقاط الارتكاز الرقمية اليومية ومستويات الدعم والمقاومة الحسابية الصريحة.',
        badge: 'مؤشر قياسي'
      }
    ],
    isAvailableOnThndr: true,
    howToApplyInThndr: 'في ثاندر اكتب في البحث "Order Blocks - [Tamer Zaky]" هيرسم لك مستطيلات ملونة على الشارت بتمثل كتل أوامر الحيتان، وضيف "Pivot Points Standard" لمعرفة النقاط المحورية الدقيقة.',
    explanationBaladi: 'الطبقة الفيصلية يا غالي: الحيتان مش بتشتري عند خطوط الدعم العادية اللي مرسومة في الكتب؛ الحيتان بتنزل تكسر الدعم العادي عشان تضرب وقف خسارة الأفراد وتلم الأسهم منهم برخيص، وبعدين ترتد من كتلة طلب مؤسسية (Demand Order Block). لما تلاقي السهم كسر قاع وهمي وارتد بشمعة دوجي أو مطرقة، ده تأكيد إن الحوت دخل ورافع السهم.',
    whatToLookFor: 'شموع بذيول سفلية طويلة عند كتلة الطلب (Order Block) وتأكيد كسر هيكل صاعد (BOS).'
  }
];

// =========================================================================
// 2. موسوعة جميع مؤشرات تطبيق ثاندر بالبلدي (Thndr Indicators Encyclopedia)
// =========================================================================
export const THNDR_ALL_INDICATORS: ThndrIndicatorItem[] = [
  // --- سكربتات تامر زكي ومجتمع البورصة المصرية على ثاندر ---
  {
    id: 'thndr_order_blocks',
    nameEn: 'Order Blocks - [Tamer Zaky]',
    nameAr: 'مؤشر كتل الأوامر المؤسسية (Order Blocks)',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 7,
    layerName: 'الطبقة 7 (الأموال الذكية وصناع السوق SMC)',
    overviewBaladi: 'ده السكربت السري اللي بيكشفلك على شارت ثاندر بالظبط فين الأماكن اللي المحافظ الكبيرة حطت فيها مليارات الجنيهات قبل كده عشان لما السهم يرجع لنفس المنطقة تشتري معاهم وإنت مغمض.',
    jobOnThndr: 'بيرسم مستطيلات تلقائية على الشارت: المستطيل الأخضر تحت هو كتلة طلب (Demand Block) والمستطيل الأحمر فوق هو كتلة عرض (Supply Block).',
    howToSetupInThndr: 'افتح شارت السهم في ثاندر، اضغط مؤشرات، واكتب "Order Blocks" واختاره، وخلي الفريم يومي (1D).',
    buySignalBaladi: 'لما السهم ينزل يلمس المستطيل الأخضر ويعمل شمعة بذيل طويل للأعلى.. ده ارتكاز شرائي حقيقي.',
    exitSignalBaladi: 'لما السهم يقرب من المستطيل الأحمر فوق؛ دي منطقة بيع المؤسسات ولازم تخفف حمولتك وتقفل مكسب.',
    friendAdvice: 'ده أقوى مؤشر عندك في ثاندر للطبقة السابعة.. خليه دايماً شغال على الشارت بتاعك!'
  },
  {
    id: 'thndr_ai_sr',
    nameEn: 'AI Support & Resistance - [Tamer Zaky]',
    nameAr: 'مؤشر الدعوم والمقاومات بالذكاء الاصطناعي',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 4,
    layerName: 'الطبقة 4 (عمارة الأدوار ومساحة الحركة)',
    overviewBaladi: 'بدل ما تقعد تشخبط وترسم خطوط دعم ومقاومة بإيدك وتغلط، المؤشر ده مبرمج بذكاء اصطناعي بيمسح تاريخ السهم كله ويرسملك خطوط أرضيات الأدوار وأسقفها بالمللي.',
    jobOnThndr: 'بيرسم خطوط أفقية بتكشف أرضية الدور الحالية (الدعم الحرج) وأسقف المقاومة اللي هتقابلك وإنت طالع.',
    howToSetupInThndr: 'ابحث في مؤشرات ثاندر عن "AI Support & Resistance"، واستخدمه على فريم اليومي وساعة.',
    buySignalBaladi: 'استقرار السهم فوق خط دعم أخضر قوي مع شمعة تأكيد صاعدة.',
    exitSignalBaladi: 'ملامسة السهم لخط مقاومة أحمر سميك مع عجز الشموع عن اختراقه.',
    friendAdvice: 'ممتاز لمعرفة "عمارة الأدوار".. الخط اللي تحتك هو أرضيتك ووقفك، والخط اللي فوقك هو هدفك.'
  },
  {
    id: 'thndr_liquidity',
    nameEn: 'Liquidity - [Tamer Zaky]',
    nameAr: 'مؤشر السيولة ومصايد الحيتان (Liquidity)',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 3,
    layerName: 'الطبقة 3 (السيولة وتانك بنزين العربية)',
    overviewBaladi: 'المؤشر ده بيكشفلك أماكن "تجمعات السيولة"، يعني الأماكن اللي الأفراد حاطين فيها أوامر وقف الخسارة عشان الحوت ينزل ياكلها (سحب السيولة Liquidity Sweep).',
    jobOnThndr: 'بيحددلك النطاقات السعرية اللي بيحصل عندها تدفق كاش قوي وسحب أوامر مفاجئ.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Liquidity" واختاره، وراقبه خصوصاً في أول نصف ساعة من جلسة التداول.',
    buySignalBaladi: 'كسر وهمي سريع لقاع سابق يليه صعود ناري فوري ودخول سيولة خضراء قوية.',
    exitSignalBaladi: 'سحب سيولة في القمة مع ظهور شموع بيع فجائية.',
    friendAdvice: 'لما تشوف إشارة سحب سيولة عند دعم، متخافش.. دي مصيدة الحوت للأفراد وإشارة دخول ممتازة للمحترف.'
  },
  {
    id: 'thndr_trend_signals',
    nameEn: 'Trend Signals - [Tamer Zaky]',
    nameAr: 'مؤشر إشارات الاتجاه (Trend Signals)',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 1,
    layerName: 'الطبقة 1 (الاتجاه العام والطريق السريع)',
    overviewBaladi: 'مؤشر بيديك إشارات بصرية مباشرة وسهلة؛ سهم أخضر للشراء لما الاتجاه يقلب صاعد، وعلامة تحذير حمراء لما السهم يكسر الاتجاه.',
    jobOnThndr: 'تأكيد بداية الترند الصاعد ونهايته بدون تعقيدات حسابية.',
    howToSetupInThndr: 'ابحث في مؤشرات ثاندر عن "Trend Signals"، واستخدمه على فريم اليومي (1D).',
    buySignalBaladi: 'ظهور إشارة شراء خضراء وثبات الشمعة اليومية فوق الخط.',
    exitSignalBaladi: 'ظهور علامة خروج حمراء أو كسر خط الاتجاه للأسفل.',
    friendAdvice: 'استخدمه لتأكيد قرارك في الطبقة الأولى، ومتمشيش عكس إشارته أبداً.'
  },
  {
    id: 'thndr_orb',
    nameEn: 'ORB - [Tamer Zaky]',
    nameAr: 'مؤشر كسر نطاق الافتتاح (Opening Range Breakout)',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 5,
    layerName: 'الطبقة 5 (الانضغاط والانفجار اللحظي)',
    overviewBaladi: 'استراتيجية عالمية بيعتمد عليها أشهر مضاربي وول ستريت؛ بيحدد أعلى سعر وأقل سعر السهم جابهم في أول ربع أو نصف ساعة من الجلسة (من 10:00 لـ 10:30 صباحاً في البورصة المصرية)، ولما السهم يكسر النطاق ده لفوق بيطير.',
    jobOnThndr: 'تحديد مستطيل افتتاح الجلسة وإعطاء تنبيه فوري بالانفراجة السعرية.',
    howToSetupInThndr: 'شغله على فريم 5 دقائق أو 15 دقيقة أثناء فتح الجلسة في ثاندر.',
    buySignalBaladi: 'اختراق الشمعة لأعلى خط في مستطيل الافتتاح مع فوليوم عالي.',
    exitSignalBaladi: 'كسر الحد السفلي لنطاق الافتتاح لأسفل.',
    friendAdvice: 'ممتاز للمضاربة السريعة الصباحية في الأسهم السريعة زي القلعة وبلتون ومصر للزيوت.'
  },
  {
    id: 'thndr_atr_fib',
    nameEn: 'ATR Fibonacci Trend',
    nameAr: 'مؤشر اتجاه فيبوناتشي ومتوسط المدى (ATR Fib Trend)',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 4,
    layerName: 'الطبقة 4 (عمارة الأدوار ومساحة الحركة)',
    overviewBaladi: 'بيجمع بين معادلة قياس التذبذب اليومي (ATR) ونسب فيبوناتشي السحرية لرسم مسارات الترند بدقة مذهلة.',
    jobOnThndr: 'تحديد خط الوقف المتحرك (Trailing Stop) وتحديد أهداف الصعود بالنسب الذهبية.',
    howToSetupInThndr: 'ابحث في ثاندر عن "ATR Fibonacci Trend"، واعتمد عليه على فريم اليومي.',
    buySignalBaladi: 'تحول خط الاتجاه إلى اللون الأخضر وتداول الشموع فوق مستويات فيبوناتشي المحورية.',
    exitSignalBaladi: 'كسر خط الترند لأسفل وتحوله للون الأحمر.',
    friendAdvice: 'أحسن مؤشر يساعدك ترفع أمر وقف الخسارة ورا السهم وهو طالع عشان متضيعش مكاسبك.'
  },
  {
    id: 'thndr_rmi_trend',
    nameEn: 'RMI Trend - [Tamer Zaky]',
    nameAr: 'مؤشر الزخم الاتجاهي النسبي (RMI Trend)',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 2,
    layerName: 'الطبقة 2 (الزخم وقوة الدوسة)',
    overviewBaladi: 'نسخة مطورة وأذكى من مؤشر RSI الكلاسيكي؛ ميزته إنه بيضيف عنصر "الزمن وتوالي الشموع" فبيقلل الإشارات الكاذبة ويديك قراءة صافية لقوة الزخم.',
    jobOnThndr: 'رسم موجات الزخم فوق وتحت خط الـ 50 لتأكيد تسارع أو تباطؤ الصعود.',
    howToSetupInThndr: 'ابحث في ثاندر عن "RMI Trend"، وافتحه تحت الشارت كبديل أو داعم لـ RSI.',
    buySignalBaladi: 'صعود مؤشر RMI واختراقه لخط الـ 50 لأعلى.',
    exitSignalBaladi: 'كسر خط الـ 50 لأسفل مع دايفرجنس هابط.',
    friendAdvice: 'بيوضحلك هل الدوسة على البنزين بتزيد فعلاً ولا دي مجرد شمعة خضراء وهمية.'
  },
  {
    id: 'thndr_egx_activity',
    nameEn: 'EGX Activity - [Tamer Zaky]',
    nameAr: 'مؤشر نشاط وسيولة البورصة المصرية',
    category: 'tamer_zaky',
    categoryLabel: 'سكربتات مجتمع ثاندر (تامر زكي)',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isCustomScript: true,
    corresponding7Layer: 3,
    layerName: 'الطبقة 3 (السيولة وتانك بنزين العربية)',
    overviewBaladi: 'مؤشر متفصل خصيصاً لسوق الأسهم المصرية بيقيس هل السهم ده واخد اهتمام وسيولة النهاردة مقارنة بباقي أسهم EGX30 و EGX70 ولا نايم في الخط.',
    jobOnThndr: 'رصد الأسهم الحامية اللي داخلها كاش ساخن ومشتري نشط في الجلسة.',
    howToSetupInThndr: 'ابحث في ثاندر عن "EGX Activity"، واستخدمه الصبح لاكتشاف أسهم الفرص اليومية.',
    buySignalBaladi: 'ارتفاع مؤشر النشاط فوق مستواه المعتاد بمرتين بالتزامن مع ارتداد السعر.',
    exitSignalBaladi: 'خروج السيولة وهبوط المؤشر لأدنى مستوياته.',
    friendAdvice: 'ركز دايماً على الأسهم اللي مؤشر النشاط فيها عالي، عشان السهم اللي مفيهوش سيولة بيقعد شهور مبيتحركش.'
  },

  // --- المؤشرات الفنية القياسية الكبرى على ثاندر ---
  {
    id: 'thndr_ema',
    nameEn: 'Moving Average Exponential (EMA)',
    nameAr: 'المتوسط المتحرك الأسي (EMA)',
    category: 'trend',
    categoryLabel: 'مؤشرات الاتجاه والمتوسطات',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    isCustomScript: false,
    corresponding7Layer: 1,
    layerName: 'الطبقة 1 (الاتجاه العام والطريق السريع)',
    overviewBaladi: 'ده خط الأمان الأساسي في البورصة كلها. الـ EMA بيحسب متوسط سعر السهم بس بيدي وزن أكبر للجلسات الأخيرة عشان يكون سريع وموافق لحركة السوق الحالية.',
    jobOnThndr: 'تحديد الاتجاه: فوق المتوسط = صاعد وأمان / تحت المتوسط = هابط وخطر.',
    howToSetupInThndr: 'في ثاندر ضيفه مرتين: الأولى Length = 50 والتانية Length = 200.',
    buySignalBaladi: 'السعر يتداول أعلى EMA 50 و EMA 200 أو يلمس الـ 50 ويرتد منه.',
    exitSignalBaladi: 'كسر السعر لخط EMA 50 أو EMA 200 لأسفل بإغلاق يومي.',
    friendAdvice: 'القاعدة الذهبية: لو السهم تحت EMA 200، اوعى تشتري فيه مهما كان رخيص!'
  },
  {
    id: 'thndr_rsi',
    nameEn: 'Relative Strength Index (RSI)',
    nameAr: 'مؤشر القوة النسبية (RSI)',
    category: 'momentum',
    categoryLabel: 'مؤشرات الزخم وقوة الحركة',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    isCustomScript: false,
    corresponding7Layer: 2,
    layerName: 'الطبقة 2 (الزخم وقوة الدوسة)',
    overviewBaladi: 'مقياس سرعة وقوة حركة السعر من 0 لـ 100. تحت 30 = تشبع بيعي (رخيص ومستعد للارتداد)، وفوق 70 = تشبع شرائي (غالي وخطر وممكن يريح).',
    jobOnThndr: 'معرفة هل المشترين لسه عندهم طاقة يكملوا طلوع ولا السوق شبعان ومحتاج يجني أرباح.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Relative Strength Index"، الإعداد الافتراضي 14 ممتاز.',
    buySignalBaladi: 'ارتداد المؤشر من مستوى 35-45 للأعلى أو ظهور دايفرجنس إيجابي (السهم بيعمل قاعين هابطين والـ RSI بيعمل قاعين صاعدين).',
    exitSignalBaladi: 'وصول المؤشر فوق 70 وبداية انحنائه للأسفل.',
    friendAdvice: 'أحسن مكان تشتري فيه سوينج لما الـ RSI يكون بين 45 و 58.. ده نطاق الانطلاق الآمن.'
  },
  {
    id: 'thndr_macd',
    nameEn: 'MACD (Moving Average Convergence Divergence)',
    nameAr: 'مؤشر الماكد (MACD)',
    category: 'momentum',
    categoryLabel: 'مؤشرات الزخم وقوة الحركة',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    isCustomScript: false,
    corresponding7Layer: 2,
    layerName: 'الطبقة 2 (الزخم وقوة الدوسة)',
    overviewBaladi: 'ملك مؤشرات الاتجاه والزخم؛ بيتكون من خطين وأعمدة ملونة. لما الخط السريع يقطع البطيء لفوق والأعمدة تقلب خضراء، ده إعلان رسمي لبدء موجة صعود.',
    jobOnThndr: 'تأكيد تغير اتجاه العزم من سلبي لإيجابي.',
    howToSetupInThndr: 'ابحث في ثاندر عن "MACD"، الإعداد الافتراضي (12, 26, 9) هو المعيار العالمي.',
    buySignalBaladi: 'تقاطع خط الماكد الأزرق أعلى خط الإشارة البرتقالي مع بداية ظهور أعمدة خضراء فوق خط الصفر.',
    exitSignalBaladi: 'تقاطع خط الماكد لأسفل وبداية ظهور أعمدة حمراء متزايدة الطول.',
    friendAdvice: 'تقاطع الماكد فوق خط الصفر هو أقوى إشارة استمرار ترند ممكن تشوفها.'
  },
  {
    id: 'thndr_bollinger',
    nameEn: 'Bollinger Bands (BB)',
    nameAr: 'أشرطة بولنجر باند (Bollinger Bands)',
    category: 'volatility',
    categoryLabel: 'مؤشرات التقلب والانضغاط',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    isCustomScript: false,
    corresponding7Layer: 5,
    layerName: 'الطبقة 5 (الانضغاط والسوستة المضغوطة)',
    overviewBaladi: 'حزام مطاطي محاوط الشموع بخط علوي وخط سفلي ومتوسط في النص. السعر طول ما هو في النص هادي، ولما الحزام يضيق بيحصل بعده انفجار سعري.',
    jobOnThndr: 'رصد السوستة المضغوطة ومعرفة الحدود السعرية المتطرفة.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Bollinger Bands"، الإعداد الافتراضي (20, 2).',
    buySignalBaladi: 'انضغاط الخطين جداً يليه كسر صاعد للحد الأوسط ثم الحد العلوي بفوليوم عالي.',
    exitSignalBaladi: 'خروج شمعة كاملة برة الحد العلوي للبولنجر ثم رجوعها لجوة (إشارة جني أرباح).',
    friendAdvice: 'لما تشوف الخطين بيقربوا من بعض زي عنق الزجاجة، حط السهم في قايمة المراقبة عشان في حركة كبيرة جاية.'
  },
  {
    id: 'thndr_volume',
    nameEn: 'Volume',
    nameAr: 'حجم التداول (Volume)',
    category: 'volume',
    categoryLabel: 'مؤشرات السيولة والحجم',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    isCustomScript: false,
    corresponding7Layer: 3,
    layerName: 'الطبقة 3 (السيولة وتانك بنزين العربية)',
    overviewBaladi: 'أبسط وأهم مؤشر في تاريخ البورصة؛ بيبينلك كام سهم اتباعوا واشتروا في الجلسة. العمود الأخضر = إغلاق صاعد، والعمود الأحمر = إغلاق هابط.',
    jobOnThndr: 'التأكد من صدق حركة الشموع وغياب التصريف.',
    howToSetupInThndr: 'موجود افتراضياً في ثاندر أسفل الشارت.',
    buySignalBaladi: 'صعود السعر مصحوباً بأعمدة فوليوم تزيد بنسبة 50% إلى 100% عن الجلسات السابقة.',
    exitSignalBaladi: 'هبوط السعر مصحوباً بعمود بيع أحمر عملاق (تصريف مؤسسي صريح).',
    friendAdvice: 'السعر كذاب.. الفوليوم هو الحقيقة الوحيدة في السوق!'
  },
  {
    id: 'thndr_pivot_points',
    nameEn: 'Pivot Points Standard',
    nameAr: 'النقاط المحورية الكلاسيكية (Pivot Points)',
    category: 'support_resistance',
    categoryLabel: 'الدعوم والمقاومات والمستهدفات',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    isCustomScript: false,
    corresponding7Layer: 7,
    layerName: 'الطبقة 7 (الأموال الذكية وصناع السوق)',
    overviewBaladi: 'معادلة رياضية بتتحسب من أعلى وأقل وإغلاق الجلسة السابقة؛ بتطلعلك نقطة الارتكاز المركزية (P) ودعوم الأمان (S1, S2, S3) ومستهدفات الأرباح (R1, R2, R3).',
    jobOnThndr: 'تحديد أسعار الدخول ووقف الخسارة وجني الأرباح بالأرقام المحددة.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Pivot Points Standard" واختار النوع Traditional أو Fibonacci.',
    buySignalBaladi: 'ارتكاز السعر فوق نقطة الـ Pivot المركزية (P) والاتجاه نحو R1.',
    exitSignalBaladi: 'ملامسة مستوى R1 أو R2 لجني الأرباح، أو كسر S1 لتفعيل وقف الخسارة.',
    friendAdvice: 'كل أرقام المستهدفات والوقف في منصتنا بتتوافق بالمللي مع مستويات الـ Pivot دي.'
  },
  {
    id: 'thndr_supertrend',
    nameEn: 'SuperTrend',
    nameAr: 'مؤشر سوبر ترند (SuperTrend)',
    category: 'trend',
    categoryLabel: 'مؤشرات الاتجاه والمتوسطات',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    isCustomScript: false,
    corresponding7Layer: 1,
    layerName: 'الطبقة 1 (الاتجاه العام)',
    overviewBaladi: 'مؤشر صريح جداً ومحبوب عند المتداولين؛ بيمشي ورا السهم بخط أخضر طول ما السهم صاعد، وأول ما السعر يكسره بيقلب خط أحمر فوق الشموع.',
    jobOnThndr: 'توفير قرار بسيط وسريع: أخضر = احتفاظ وشراء / أحمر = خروج وانتظار.',
    howToSetupInThndr: 'ابحث في ثاندر عن "SuperTrend"، إعداد (10, 3).',
    buySignalBaladi: 'تحول الخط من الأحمر إلى الأخضر أسفل الشمعة.',
    exitSignalBaladi: 'تحول الخط إلى اللون الأحمر أعلى الشمعة.',
    friendAdvice: 'ممتاز للمبتدئين اللي مش عاوزين تفاصيل معقدة؛ طول ما الخط أخضر تحت السهم متقلقش.'
  },
  {
    id: 'thndr_vwap',
    nameEn: 'VWAP (Volume Weighted Average Price)',
    nameAr: 'متوسط السعر المرجح بحجم التداول (VWAP)',
    category: 'volume',
    categoryLabel: 'مؤشرات السيولة والحجم',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    isCustomScript: false,
    corresponding7Layer: 3,
    layerName: 'الطبقة 3 (السيولة وتانك بنزين العربية)',
    overviewBaladi: 'السعر الحقيقي اللي المؤسسات والبنوك نفذت عليه صفقاتها خلال اليوم؛ بيعتبر خط مغناطيسي للسهم.',
    jobOnThndr: 'تقييم هل السعر الحالي رخيص وفرصة (تحت VWAP) ولا غالي (فوق VWAP).',
    howToSetupInThndr: 'ابحث في ثاندر عن "VWAP"، مناسب جداً لفريمات اللحظية (5m, 15m, 1H).',
    buySignalBaladi: 'اختراق السعر لخط VWAP لأعلى والاستقرار فوقه.',
    exitSignalBaladi: 'كسر السعر لخط VWAP لأسفل.',
    friendAdvice: 'المؤسسات الكبيرة بتقيس كفاءة مديري الصناديق هل اشتروا تحت خط VWAP ولا فوقه.. اشتري زي المؤسسات!'
  },
  {
    id: 'thndr_stochastic_rsi',
    nameEn: 'Stochastic RSI',
    nameAr: 'مؤشر ستوكاستك آر إس آي (Stoch RSI)',
    category: 'momentum',
    categoryLabel: 'مؤشرات الزخم وقوة الحركة',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    isCustomScript: false,
    corresponding7Layer: 2,
    layerName: 'الطبقة 2 (الزخم وقوة الدوسة)',
    overviewBaladi: 'مؤشر زخم فائق الحساسية بيجمع بين سرعة الاستوكاستك ودقة الـ RSI؛ بيكشف القيعان اللحظية قبل ما المؤشرات العادية تلاحظها.',
    jobOnThndr: 'صيد إشارات الارتداد السريعة جداً في قاع التصحيح.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Stochastic RSI"، الإعداد (3, 3, 14, 14).',
    buySignalBaladi: 'تقاطع الخط الأزرق لأعلى الخط البرتقالي من تحت مستوى 20.',
    exitSignalBaladi: 'تقاطع الخطوط لأسفل من فوق مستوى 80.',
    friendAdvice: 'سريع جداً؛ متعتمدش عليه لوحده، خليه دايماً متوافق مع أرضية دور في الطبقة 4.'
  },
  {
    id: 'thndr_atr',
    nameEn: 'Average True Range (ATR)',
    nameAr: 'مؤشر متوسط المدى الحقيقي (ATR)',
    category: 'volatility',
    categoryLabel: 'مؤشرات التقلب والانضغاط',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    isCustomScript: false,
    corresponding7Layer: 4,
    layerName: 'الطبقة 4 (عمارة الأدوار ومساحة الحركة)',
    overviewBaladi: 'مش بيديك إشارة شراء أو بيع، ده بيقيس السهم بيتحرك كام قرش أو كام جنيه في اليوم الواحد! بنستخدمه عشان نحط وقف خسارة آمن بعيد عن ذبذبة السوق العادية.',
    jobOnThndr: 'حساب مسافة وقف الخسارة والمستهدفات بالجنيهات.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Average True Range"، الفترة 14.',
    buySignalBaladi: 'انخفاض قيمة ATR لأدنى مستوى يعكس هدوء السهم قبل حركة كبيرة.',
    exitSignalBaladi: 'وضع وقف الخسارة تحت سعر الشراء بمسافة (1.5 × قيمة ATR).',
    friendAdvice: 'الأداة السرية للمحترفين لتحديد وقف الخسارة الصحيح علمياً.'
  },
  {
    id: 'thndr_ichimoku',
    nameEn: 'Ichimoku Cloud',
    nameAr: 'سحابة إيشيموكو اليابانية (Ichimoku Cloud)',
    category: 'trend',
    categoryLabel: 'مؤشرات الاتجاه والمتوسطات',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    isCustomScript: false,
    corresponding7Layer: 1,
    layerName: 'الطبقة 1 (الاتجاه العام)',
    overviewBaladi: 'نظام ياباني متكامل بيرسم "سحابة" مستقبلية على الشارت. الشموع فوق السحابة الخضراء = اتجاه صاعد قوي جداً، وجوة السحابة = سوق عرضي ونايم، وتحت السحابة = هابط وخطر.',
    jobOnThndr: 'تحديد الاتجاه والدعوم والمقاومات المستقبلية بنظرة واحدة خاطفة.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Ichimoku Cloud"، إعدادات (9, 26, 52).',
    buySignalBaladi: 'اختراق السعر للسحابة واستقراره فوقها بالكامل.',
    exitSignalBaladi: 'نزول السعر تحت السحابة وتحولها للون الأحمر.',
    friendAdvice: 'لو السهم فوق سحابة إيشيموكو، السحابة دي بتشتغل كأرضية دور فولاذية تدفع السهم لفوق.'
  },
  {
    id: 'thndr_parabolic_sar',
    nameEn: 'Parabolic SAR',
    nameAr: 'مؤشر النقاط المتتابعة (Parabolic SAR)',
    category: 'trend',
    categoryLabel: 'مؤشرات الاتجاه والمتوسطات',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    isCustomScript: false,
    corresponding7Layer: 1,
    layerName: 'الطبقة 1 (الاتجاه العام)',
    overviewBaladi: 'بيرسم نقط متتابعة؛ نقط تحت الشموع = السهم صاعد، ونقط فوق الشموع = السهم هابط. أول نقطة تظهر تحت الشمعة دي إشارة دخول فورية.',
    jobOnThndr: 'متابعة الترند وتحديد نقطة الوقف المتحرك.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Parabolic SAR".',
    buySignalBaladi: 'انتقال النقط من فوق الشموع إلى أسفل الشموع.',
    exitSignalBaladi: 'ظهور أول نقطة فوق الشمعة الحالية.',
    friendAdvice: 'ممتاز لرفع أمر وقف الخسارة خطوة بخطوة ورا السهم في ثاندر.'
  },
  {
    id: 'thndr_volume_profile_visible',
    nameEn: 'Volume Profile Visible Range (VPVR)',
    nameAr: 'بروفايل الحجم للمدى المرئي (Volume Profile)',
    category: 'volume',
    categoryLabel: 'مؤشرات السيولة والحجم',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    isCustomScript: false,
    corresponding7Layer: 3,
    layerName: 'الطبقة 3 (السيولة وتانك بنزين العربية)',
    overviewBaladi: 'بيرسم عواميد أفقية بتكشف إيه أكتر سعر اتنفذ عليه تداول في تاريخ السهم على الشاشة. السعر اللي عليه أطول عمود أحمر اسمه خط السيطرة (POC) وهو أقوى دعم ومقاومة في السهم.',
    jobOnThndr: 'كشف مناطق القيمة العادلة والفراغات السعرية اللي بيطير فيها السهم بسرعة.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Volume Profile Visible Range".',
    buySignalBaladi: 'اختراق السعر لخط الـ POC للأعلى والثبات فوقه.',
    exitSignalBaladi: 'كسر خط الـ POC للأسفل.',
    friendAdvice: 'الفراغات اللي مفيهاش عواميد فوليوم هي المناطق اللي السهم بيتحرك فيها بسرعة الصاروخ بدون مقاومات.'
  },
  {
    id: 'thndr_williams_r',
    nameEn: 'Williams %R',
    nameAr: 'مؤشر ويليامز للنسبة المئوية (Williams %R)',
    category: 'momentum',
    categoryLabel: 'مؤشرات الزخم وقوة الحركة',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    isCustomScript: false,
    corresponding7Layer: 2,
    layerName: 'الطبقة 2 (الزخم وقوة الدوسة)',
    overviewBaladi: 'مؤشر زخم حاد بيقيس موقع إغلاق السهم مقارنة بأعلى وأقل سعر في آخر 14 جلسة من 0 إلى -100. تحت -80 رخيص جداً وفوق -20 متضخم.',
    jobOnThndr: 'اقتناص الارتداد الصاعد من القيعان اللحظية.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Williams %R".',
    buySignalBaladi: 'صعود المؤشر من تحت -80 واختراقه لمستوى -50 للأعلى.',
    exitSignalBaladi: 'تجاوز المؤشر لمستوى -20 وبداية الهبوط.',
    friendAdvice: 'حساس جداً، ادمجه مع فحص الفوليوم في الطبقة 3.'
  },
  {
    id: 'thndr_chaikin_money_flow',
    nameEn: 'Chaikin Money Flow (CMF)',
    nameAr: 'مؤشر تدفق سيولة شايكين (CMF)',
    category: 'volume',
    categoryLabel: 'مؤشرات السيولة والحجم',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    isCustomScript: false,
    corresponding7Layer: 3,
    layerName: 'الطبقة 3 (السيولة وتانك بنزين العربية)',
    overviewBaladi: 'بيقيس هل الفلوس بتدخل السهم (تجميع صاعد فوق الصفر) ولا بتخرج منه (تصريف بيعي تحت الصفر) بناءً على حجم وقيمة التداولات.',
    jobOnThndr: 'التأكد من دخول الكاش المؤسسي الحقيقي.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Chaikin Money Flow".',
    buySignalBaladi: 'صعود مؤشر CMF فوق خط الصفر وثباته في النطاق الإيجابي.',
    exitSignalBaladi: 'كسر المؤشر لخط الصفر لأسفل ودخوله في النطاق السلبي.',
    friendAdvice: 'لو السعر نازل ومؤشر CMF طالع فوق الصفر، اعرف إن ده هبوط تجميعي كاذب والحيتان بتلم.'
  },
  {
    id: 'thndr_keltner_channels',
    nameEn: 'Keltner Channels',
    nameAr: 'قنوات كيلتنر (Keltner Channels)',
    category: 'volatility',
    categoryLabel: 'مؤشرات التقلب والانضغاط',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    isCustomScript: false,
    corresponding7Layer: 5,
    layerName: 'الطبقة 5 (الانضغاط والسوستة المضغوطة)',
    overviewBaladi: 'قنوات سعرية مبنية على مؤشر الـ ATR ومتوسط الحركة الأسي. لما البولنجر يدخل جوة قنوات كيلتنر، دي علامة السوستة المضغوطة الكلاسيكية.',
    jobOnThndr: 'رصد السوستة المضغوطة بدقة ميكانيكية متقدمة.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Keltner Channels".',
    buySignalBaladi: 'خروج البولنجر باند برة قنوات كيلتنر للأعلى مع شمعة خضراء قوية.',
    exitSignalBaladi: 'كسر الخط الأوسط للقناة لأسفل.',
    friendAdvice: 'الدمج بين قنوات كيلتنر والبولنجر هو أقوى معادلة لرصد انفجار الأسهم الصاعدة.'
  },
  {
    id: 'thndr_zig_zag',
    nameEn: 'Zig Zag',
    nameAr: 'مؤشر الزجزاج وهيكل القمم والقيعان (Zig Zag)',
    category: 'trend',
    categoryLabel: 'مؤشرات الاتجاه والمتوسطات',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    isCustomScript: false,
    corresponding7Layer: 7,
    layerName: 'الطبقة 7 (الأموال الذكية وصناع السوق)',
    overviewBaladi: 'بيمسح تذبذبات السوق الصغيرة العشوائية ويرسملك خطوط واضحة بتربط القمم والقيعان الحقيقية عشان تشوف هيكل السوق (BOS) بسهولة.',
    jobOnThndr: 'تحديد القمم والقيعان الصاعدة والهابطة بوضوح تام.',
    howToSetupInThndr: 'ابحث في ثاندر عن "Zig Zag".',
    buySignalBaladi: 'تشكيل قاع أعلى من قاع سابق يليه كسر قمة سابقة (كسر هيكل صاعد BOS).',
    exitSignalBaladi: 'تشكيل قمة أقل من قمة سابقة وكسر قاع سابق.',
    friendAdvice: 'بيساعدك تلمس كسر الهيكل الصاعد بالعين المجردة بدون أي حيرة.'
  }
];

// =========================================================================
// 3. قاموس مصطلحات البورصة بالبلدي (EGX Baladi Financial Glossary)
// =========================================================================
export interface BaladiTerm {
  term: string;
  termEn?: string;
  analogyTitle: string;
  meaningBaladi: string;
  practicalRule: string;
}

export const EGX_FRIEND_GLOSSARY: BaladiTerm[] = [
  {
    term: 'مضاربة سوينج (Swing Trading)',
    termEn: 'Swing Trading',
    analogyTitle: 'الخطفة السريعة: تشتري عند الدعم وتبيع عند المقاومة وتجري!',
    meaningBaladi: 'سوينج يعني مضاربة هادية وسريعة مدتها من كام يوم لأسبوعين أو ثلاثة بالكتير. مش مضاربة لحظية تقعد تحرق دمك قدام الشاشة بالدقيقة، ولا استثمار سنين.. إنت بتدخل عند أرضية دور قوية، وأول ما السهم يطلع 8% أو 15% ويخبط في سقف الدور بتاخد مكسبك وتطلع فوراً.',
    practicalRule: 'بنحدد نقطة دخول دقيقة عند الدعم، ومستهدف ربح أول عند أول سقف مقاومة، ووقف خسارة صارم لو كسر الأرضية.'
  },
  {
    term: 'أرضية الدور (الدعم Support)',
    termEn: 'Support Level',
    analogyTitle: 'الأرض الخرسانية اللي السهم مستند عليها ومبيرضاش يقع تحتها!',
    meaningBaladi: 'السعر اللي لما السهم ينزل عنده، بتلاقي المشترين والحيتان بيظهروا فجأة ويحطوا طلبات شراء بملايين، فيمنعوا السهم إنه يقع ويردوه لفوق. ده أأمن مكان تشتري عنده في البورصة.',
    practicalRule: 'اشتري بالقرب من أرضية الدور (الدعم) عشان تكون مخاطرتك أقل ما يمكن، واعمل وقفك تحتها بـ 1.5% أو 2% بس.'
  },
  {
    term: 'سقف الدور (المقاومة Resistance)',
    termEn: 'Resistance Level',
    analogyTitle: 'السقف الخرساني اللي السهم بيخبط فيه ويرد لتحت!',
    meaningBaladi: 'المستوى السعري اللي بيظهر عنده بائعين عايزين يجنوا أرباحهم ويتخلصوا من أسهمهم، فالسهم يلاقي صعوبة إنه يعديه ويفرمل عنده. المحترف بيبيع عنده وياخد أرباحه في جيبه.',
    practicalRule: 'ممنوع تشتري تحت سقف المقاومة مباشرة؛ استنى لما يخترق ويثبت فوقه عشان يتحول لأرضية دور جديدة، أو بيع عنده نص كميتك.'
  },
  {
    term: 'عمارة الأدوار السعرية (Building Floors)',
    termEn: 'Price Brackets & Floors',
    analogyTitle: 'السوق مش خط مايل.. السوق عمارة أدوار سكنية!',
    meaningBaladi: 'تشبيه عبقري بيشرح حركة البورصة: السهم بيفضل يتذبذب جوة "الدور" بين الأرضية والسقف. لما يكسر السقف ويطلع للدور اللي بعده، السقف القديم بيتحول لأرضية جديدة للدور التاني ويفضل طالع دور ورا دور.',
    practicalRule: 'تأكد إن مساحة الحركة بينك وبين السقف اللي فوقك واسعة وتستاهل الدخول (عائد إلى مخاطرة 1:2.5 أو أكتر).'
  },
  {
    term: 'كتلة الأوامر المؤسسية (Order Block)',
    termEn: 'Demand Order Block',
    analogyTitle: 'منطقة الحوت السرية: مليارات الكاش اللي بتمنع السهم يقع!',
    meaningBaladi: 'المنطقة السعرية اللي المحافظ الكبيرة وصناديق الاستثمار دخلت وضعت فيها مليارات الجنيهات قبل كده عشان تشيل السهم. لما السهم بيرجع لنفس المنطقة دي، بيلاقي أوامر شراء جاهزة مستنياه تمنعه ينزل وترفعه زي الصاروخ.',
    practicalRule: 'دي أقوى أرضية دور في التحليل المؤسسي (الطبقة السابعة)؛ اشتري أول ما السهم يلمسها ويعمل شمعة تأكيد ارتدادية.'
  },
  {
    term: 'وقف الخسارة (Stop Loss)',
    termEn: 'Stop Loss',
    analogyTitle: 'حزام الأمان وفرامل اليد في العربية.. متتهاونش فيها أبداً!',
    meaningBaladi: 'سعر محدد مسبقاً، لو السهم كسر أرضية الدور ونزل تحته بتبيع فوراً بدون تردد. الهدف منه مش إننا نخسر، الهدف إننا نمنع خسارة صغيرة (2% أو 3%) إنها تتحول لكارثة ونزول 30% أو 40% يحبس سيولتك شهور!',
    practicalRule: 'حط أمر وقف الخسارة في تطبيق ثاندر أول ما تشتري على طول، ومتلغيهوش ولا تعدله لتحت أبداً.'
  },
  {
    term: 'كسر الهيكل الصاعد (BOS)',
    termEn: 'Break of Structure',
    analogyTitle: 'السهم كسر السقف ومعلن عن رالي جديد!',
    meaningBaladi: 'Break of Structure يعني السهم نجح يخترق القمة السابقة اللي كان واقف عندها، ويثبت فوقها بشمعة كاملة. دي بتأكد إن المشترين سيطروا على السهم وناويين يطلعوا بيه للدور اللي بعده.',
    practicalRule: 'استنى لما السهم يعمل BOS ويريح شوية يعمل إعادة اختبار خفيفة عشان تدخل مع بداية الموجة الجديدة.'
  },
  {
    term: 'سحب السيولة (Liquidity Sweep)',
    termEn: 'Liquidity Sweep',
    analogyTitle: 'مصيدة الحوت: يخوف الأفراد عشان ياخد أسهمهم برخيص!',
    meaningBaladi: 'حركة ملعوبة بيعملها صانع السوق الصبح؛ بينزل بالسعر يكسر دعم معروف بقرشين عشان كل الأفراد يتخضوا ويفعلوا وقف الخسارة ويبيعوا بخسارة، فالحوت ياخد منهم مئات الآلاف من الأسهم في ثواني، ويرجع يطير بالسهم لفوق بمكسب ضخم!',
    practicalRule: 'لو شفت السهم نزل كسر الدعم بديل شمعة رفيع ورجع قفل فوقه بسرعة، اوعى تبيع؛ دي إشارة شراء ارتدادية صاروخية.'
  },
  {
    term: 'التجميع المؤسسي (Accumulation)',
    termEn: 'Institutional Accumulation',
    analogyTitle: 'الحوت بيلم في السهم بالراحة من تحت لتحت بدون شوشرة!',
    meaningBaladi: 'فترة ركود وهدوء بتلاقي فيها السهم ماشي بالعرض عند أرضية الدور. الحيتان والمؤسسات بتشتري وتلم في السهم بهدوء وبكميات ضخمة بدون ما يرفعوا السعر عشان يجمعوا أكبر كمية ممكنة برخيص قبل ما يطلقوا السهم.',
    practicalRule: 'التجميع بيتعرف لما تلاقي السعر هادي لكن الفوليوم التراكمي بيزيد وغياب تام لأعمدة البيع الكبيرة.'
  },
  {
    term: 'التصريف المؤسسي (Distribution)',
    termEn: 'Institutional Distribution',
    analogyTitle: 'الفخ الكبير: الحيتان بتبيع في القمة وتلبس السهم للأفراد!',
    meaningBaladi: 'عكس التجميع؛ بيحصل في القمم لما تلاقي أخبار إيجابية كتيرة والسهم طالع جامد وكل الناس طايرة من الفرحة.. في الوقت ده الحيتان بتبدأ تتخلص من ملايين الأسهم وتبيعها للأفراد الطماعين بمكسب خيالي، وبعد ما يخلصوا بيع السهم بيقع في الأرض.',
    practicalRule: 'لو السهم في قمة تاريخية ومؤشر RSI فوق 75 وظهر عمود بيع أحمر عملاق، اخرج فوراً واقفل أرباحك ومتطمعش.'
  }
];
