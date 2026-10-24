const fs = require('fs');
const path = require('path');

const funds = [
  // 1. الكلاودز (2 أوعية ادخار كاش مباشر)
  {
    id: "cloud-daily",
    code: "اليومي",
    name: "كلاودز اليومي (ادخار كاش)",
    category: "كلاودز",
    dailyChange: 0.05,
    isSavingPot: true,
    thndrAvailable: true,
    benchmark: "أذون الخزانة المصرية قصيرة الأجل (عائد تراكمي مركب)",
    strategy: "حساب ادخار نقدي كاش من ثاندر وأزيموت بعائد يومي مركب ~19.25% وسحب فوري بدون مصاريف أو قيود",
    sectorFocus: "ادخار كاش يومي"
  },
  {
    id: "cloud-monthly",
    code: "الشهري",
    name: "كلاودز الشهري (ادخار كاش)",
    category: "كلاودز",
    dailyChange: 0.06,
    isSavingPot: true,
    thndrAvailable: true,
    benchmark: "أذون الخزانة المصرية متوسطة الأجل",
    strategy: "حساب ادخار نقدي كاش بعائد شهري أعلى ~21.50% يُصرف نهاية كل شهر مع سحب مجاني",
    sectorFocus: "ادخار كاش شهري"
  },

  // 2. صناديق الذهب والفضة (8 صناديق)
  {
    id: "thndr-gold",
    code: "THNDRGOLD",
    name: "صندوق ذهب ثاندر (عيار 24)",
    category: "ذهب وفضة",
    dailyChange: 0.45,
    navRaw: "LIVE_GOLD_24K_PRICE",
    thndrAvailable: true,
    benchmark: "سعر جرام الذهب عيار 24 بسوق الصاغة المصرية",
    strategy: "حيازة ذهب عيار 24 حقيقي ومادي بنسبة 100% مودع بخزائن معتمدة مع تسعير لحظي مباشر بسعر سوق الصاغة",
    sectorFocus: "ذهب عيار 24"
  },
  {
    id: "azg",
    code: "AZG",
    name: "صندوق أزيموت جولد",
    category: "ذهب وفضة",
    dailyChange: 0.18,
    nav: 25.80,
    thndrAvailable: true,
    benchmark: "أسعار سبائك الذهب عيار 24 محلياً وعالمياً",
    strategy: "وثيقة استثمار تتبع أسعار الذهب، وتستثمر 100% من أصولها في سبائك ذهب نقية عيار 24 مودعة بخزائن مؤمنة ومعتمدة",
    sectorFocus: "سبائك ذهب 24"
  },
  {
    id: "bsb",
    code: "BSB",
    name: "صندوق بلتون سبائك",
    category: "ذهب وفضة",
    dailyChange: 0.18,
    nav: 25.60,
    thndrAvailable: true,
    benchmark: "أسعار سبائك الذهب الخالص عيار 24",
    strategy: "وثائق استثمار متخصصة في الذهب الخالص عيار 24 مع إمكانية طلب استرداد عيني للسبائك وفق نشرة الاكتتاب",
    sectorFocus: "سبائك ذهب 24"
  },
  {
    id: "ada",
    code: "ADA",
    name: "صندوق الأهلي دهب",
    category: "ذهب وفضة",
    dailyChange: 0.18,
    nav: 25.40,
    thndrAvailable: true,
    benchmark: "أسعار سبائك الذهب النقي عيار 24",
    strategy: "استثمار مباشر في سبائك الذهب الخالص عيار 24 بإدارة البنك الأهلي المصري ومصر كابيتال للتحوط ضد التضخم",
    sectorFocus: "سبائك ذهب 24"
  },
  {
    id: "cgo",
    code: "CGO",
    name: "صندوق سي آي جولد",
    category: "ذهب وفضة",
    dailyChange: 0.18,
    nav: 25.50,
    thndrAvailable: true,
    benchmark: "أسعار الذهب عيار 24 بسوق الصاغة المصرية",
    strategy: "وثائق استثمار تتبع الذهب ومغطاة بالكامل بسبائك ذهبية معتمدة ومدموغة من مصلحة الدمغة والموازين",
    sectorFocus: "سبائك ذهب 24"
  },
  {
    id: "abm",
    code: "ABM",
    name: "صندوق بوليون للمعادن",
    category: "ذهب وفضة",
    dailyChange: 0.11,
    nav: 25.45,
    thndrAvailable: true,
    benchmark: "أسعار المعادن النفيسة والذهب",
    strategy: "استثمار في سبائك المعادن النفيسة المادية والمؤمنة للتحوط والمحافظة على القوة الشرائية",
    sectorFocus: "سبائك معادن وذهب"
  },
  {
    id: "bfa",
    code: "BFA",
    name: "صندوق بلتون فضة",
    category: "ذهب وفضة",
    dailyChange: -0.01,
    nav: 16.85,
    thndrAvailable: true,
    benchmark: "أسعار سبائك الفضة الخالصة عيار 999",
    strategy: "أول صندوق مصري يستثمر في سبائك الفضة النقية عيار 999 للاستفادة من نمو الطلب الصناعي والتحوط المالي",
    sectorFocus: "سبائك فضة عيار 999"
  },
  {
    id: "msi",
    code: "MSI",
    name: "صندوق مباشر فضة",
    category: "ذهب وفضة",
    dailyChange: -0.06,
    nav: 16.90,
    thndrAvailable: true,
    benchmark: "أسعار سبائك الفضة المادية عيار 999",
    strategy: "استثمار مباشر في سبائك الفضة الخالصة المادية والمودعة بخزائن مؤمنة لحماية رأس المال",
    sectorFocus: "سبائك فضة عيار 999"
  },

  // 3. صناديق الأسهم السلبية وتتبع المؤشرات (12 صندوق)
  {
    id: "ci30",
    code: "CI30",
    name: "صندوق مؤشر CI EGX30",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: 1.17,
    nav: 62.50,
    thndrAvailable: true,
    benchmark: "مؤشر البورصة الرئيسي EGX30",
    strategy: "تتبع ومحاكاة دقيقة لأداء مؤشر البورصة المصرية الثلاثيني EGX30 (أكبر 30 شركة قيادية من حيث السيولة ورأس المال)",
    sectorFocus: "مؤشر البورصة الثلاثيني EGX 30"
  },
  {
    id: "aks",
    code: "AKS",
    name: "صندوق الكنز شريعة",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: 0.63,
    nav: 26.50,
    thndrAvailable: true,
    benchmark: "مؤشر الأسهم المتوافقة مع الشريعة الإسلامية",
    strategy: "تتبع سلة الأسهم المصرية المتوافقة مع أحكام الشريعة الإسلامية بأقل تكلفة إدارة وبدون اجتهاد بشري",
    sectorFocus: "مؤشر الشريعة الإسلامية"
  },
  {
    id: "bwa",
    code: "BWA",
    name: "صندوق بلتون وفرة",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: 0.60,
    nav: 17.80,
    thndrAvailable: true,
    benchmark: "مؤشر بلتون للأسهم ذات التوزيعات النقدية (Belton Wafra Index)",
    strategy: "تتبع ومحاكاة مؤشر يضم الشركات المصرية الأعلى توزيعاً للأرباح النقدية مع تحقيق نمو رأسمالي مستمر",
    sectorFocus: "مؤشر توزيعات الأرباح والنمو"
  },
  {
    id: "cms",
    code: "CMS",
    name: "صندوق مؤشر CI EGX33 الشريعة",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: 0.59,
    nav: 22.10,
    thndrAvailable: true,
    benchmark: "مؤشر الشريعة الإسلامية الرسمي EGX33 Shariah",
    strategy: "تتبع آلي غير نشط لمؤشر البورصة الرسمي EGX33 للشريعة الإسلامية المعتمد من هيئة الرقابة المالية ودار الإفتاء",
    sectorFocus: "مؤشر الشريعة EGX 33"
  },
  {
    id: "ak35",
    code: "AK35",
    name: "صندوق الكنز EGX35-LV",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: -0.48,
    nav: 16.70,
    thndrAvailable: true,
    benchmark: "مؤشر الأسهم الأقل تقلباً EGX35 Low Volatility",
    strategy: "تتبع ومحاكاة مؤشر EGX35-LV الذي يضم 35 سهماً مصرياً تتميز بأقل معدل تذبذب ومخاطر سعرية بالسوق",
    sectorFocus: "مؤشر منخفض التقلب EGX 35-LV"
  },
  {
    id: "alv",
    code: "ALV",
    name: "صندوق AZ LV",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: -0.49,
    nav: 15.90,
    thndrAvailable: true,
    benchmark: "مؤشر أزيموت للأسهم منخفضة التقلب (Azimut Low Volatility Index)",
    strategy: "تتبع سلة أسهم مصرية منتقاة تتميز باستقرار عالي وانخفاض في حدة التراجعات خلال تقلبات السوق",
    sectorFocus: "مؤشر الأسهم منخفضة المخاطر"
  },
  {
    id: "b35",
    code: "B35",
    name: "صندوق بلتون بي-35",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: -0.51,
    nav: 18.20,
    thndrAvailable: true,
    benchmark: "مؤشر بلتون لأفضل 35 شركة (Belton B-35 Index)",
    strategy: "تتبع آلي لمؤشر بلتون B-35 الذي يضم أفضل 35 شركة مقيدة بناءً على السيولة والقيمة السوقية ومعدلات التداول",
    sectorFocus: "مؤشر بلتون B-35"
  },
  {
    id: "bmm",
    code: "BMM",
    name: "صندوق بلتون مية مية",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: 0.35,
    navRaw: "LIVE_BMM_NAV",
    thndrAvailable: true,
    benchmark: "مؤشر البورصة المصرية المئوي متساوي الأوزان EGX100 EWI",
    strategy: "تتبع ومحاكاة أداء مؤشر البورصة المئوي EGX100 EWI بأوزان متساوية لتغطية أوسع 100 شركة قيادية ومتوسطة بالسوق",
    sectorFocus: "مؤشر البورصة المئوي EGX 100 EWI"
  },
  {
    id: "ak70",
    code: "AK70",
    name: "صندوق الكنز EGX70",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: -0.93,
    nav: 1.45,
    thndrAvailable: true,
    benchmark: "مؤشر البورصة السبعيني متساوي الأوزان EGX70 EWI",
    strategy: "تتبع ومحاكاة أداء مؤشر الشركات الصغيرة والمتوسطة EGX70 EWI بآلية متساوية الأوزان لتوزيع المخاطر",
    sectorFocus: "مؤشر البورصة السبعيني EGX 70 EWI"
  },
  {
    id: "ncs",
    code: "NCS",
    name: "صندوق سهمي 70 إن آي كابيتال",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: -0.94,
    nav: 1.48,
    thndrAvailable: true,
    benchmark: "مؤشر البورصة السبعيني متساوي الأوزان EGX70 EWI",
    strategy: "تتبع آلي غير نشط لمؤشر البورصة السبعيني EGX70 EWI الصادر عن إن آي كابيتال بنك الاستثمار القومي",
    sectorFocus: "مؤشر البورصة السبعيني EGX 70 EWI"
  },
  {
    id: "b70",
    code: "B70",
    name: "صندوق بلتون EGX70",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: -0.96,
    nav: 1.485,
    thndrAvailable: true,
    benchmark: "مؤشر البورصة السبعيني متساوي الأوزان EGX70 EWI",
    strategy: "تتبع ومحاكاة دقيقة لمؤشر الأسهم المتوسطة والصغيرة EGX70 EWI بأقل نسبة خطأ تتبع (Tracking Error)",
    sectorFocus: "مؤشر البورصة السبعيني EGX 70 EWI"
  },
  {
    id: "t70",
    code: "T70",
    name: "صندوق ثاندر T70 للأسهم",
    category: "أسهم مؤشرات (سلبية)",
    dailyChange: 0.65,
    navRaw: "LIVE_T70_NAV",
    thndrAvailable: true,
    benchmark: "مؤشر البورصة السبعيني متساوي الأوزان EGX70 EWI",
    strategy: "تتبع آلي غير نشط لمؤشر البورصة السبعيني EGX70 EWI بالتعاون مع أزيموت مصر ومنصة ثاندر بأقل تكلفة إدارة",
    sectorFocus: "مؤشر البورصة السبعيني EGX 70 EWI"
  },

  // 4. صناديق الأسهم النشطة (28 صندوق)
  {
    id: "awp",
    code: "AWP",
    name: "صندوق أسباير وفرة بلس",
    category: "أسهم نشطة",
    dailyChange: 1.28,
    nav: 14.85,
    thndrAvailable: true,
    benchmark: "محفظة أسهم مصرية متوازنة",
    strategy: "إدارة نشطة تركز على انتقاء أسهم تجمع بين النمو الرأسمالي والتوزيعات النقدية الدورية",
    sectorFocus: "أسهم نمو وتوزيعات نقدية"
  },
  {
    id: "cex",
    code: "CEX",
    name: "صندوق سي آي تصدير",
    category: "أسهم نشطة",
    dailyChange: 0.66,
    nav: 16.20,
    thndrAvailable: true,
    benchmark: "أسهم الشركات المصرية المصدرة",
    strategy: "استثمار انتقائي مركز في أسهم الشركات ذات المبيعات التصديرية والإيرادات الدولارية للتحوط ضد انخفاض العملة",
    sectorFocus: "قطاع التصدير والإيرادات الدولارية"
  },
  {
    id: "ctq",
    code: "CTQ",
    name: "صندوق سي آي ذا كوانت",
    category: "أسهم نشطة",
    dailyChange: 0.61,
    nav: 15.90,
    thndrAvailable: true,
    benchmark: "خوارزميات التداول الكمي (Quantitative Models)",
    strategy: "استثمار بالتحليل الكمي والرياضي لاقتناص الفرص السعرية المبنية على البيانات الإحصائية والسيولة",
    sectorFocus: "التداول الكمي والخوارزميات"
  },
  {
    id: "bre",
    code: "BRE",
    name: "صندوق بلتون القطاع العقاري",
    category: "أسهم نشطة",
    dailyChange: 0.59,
    nav: 17.30,
    thndrAvailable: true,
    benchmark: "مؤشر قطاع العقارات والإنشاءات بالبورصة المصرية",
    strategy: "استثمار قطاعي متخصص في كبرى شركات التطوير العقاري، المقاولات، والتنمية العمرانية",
    sectorFocus: "قطاع التطوير العقاري والمقاولات"
  },
  {
    id: "ccm",
    code: "CCM",
    name: "صندوق كايرو كابيتال مومنتم",
    category: "أسهم نشطة",
    dailyChange: 0.55,
    nav: 16.80,
    thndrAvailable: true,
    benchmark: "استراتيجية الزخم المالي (Momentum Strategy)",
    strategy: "استثمار نشط في الأسهم التي تشهد تسارعاً قوياً في أحجام التداول والزخم السعري الصاعد",
    sectorFocus: "الزخم والسيولة المتسارعة"
  },
  {
    id: "cre",
    code: "CRE",
    name: "صندوق سي آي عقارات وبناء",
    category: "أسهم نشطة",
    dailyChange: 0.55,
    nav: 19.10,
    thndrAvailable: true,
    benchmark: "قطاع الإنشاءات ومواد البناء والعقارات",
    strategy: "محفظة مركزة في أسهم الإسكان، التشييد والبناء، ومصنعي مواد البناء والبنية التحتية",
    sectorFocus: "قطاع العقارات ومواد البناء"
  },
  {
    id: "azo",
    code: "AZO",
    name: "صندوق أزيموت فرص",
    category: "أسهم نشطة",
    dailyChange: 0.51,
    nav: 22.40,
    thndrAvailable: true,
    benchmark: "استراتيجية القيمة العادلة (Value & Special Situations)",
    strategy: "اقتناص الأسهم غير المقومة بعدالة ذات الخصم الكبير عن قيمتها الحقيقية وفرص الاستحواذ وإعادة الهيكلة",
    sectorFocus: "أسهم القيمة واقتناص الفرص"
  },
  {
    id: "nna",
    code: "NNA",
    name: "صندوق نماء",
    category: "أسهم نشطة",
    dailyChange: 0.50,
    nav: 18.50,
    thndrAvailable: true,
    benchmark: "مؤشر الأسهم المصرية العامة",
    strategy: "محفظة أسهم متنوعة تدار لتحقيق أقصى نمو رأسمالي طويل الأجل مع إدارة مخاطر احترافية",
    sectorFocus: "النمو الرأسمالي العام"
  },
  {
    id: "aso",
    code: "ASO",
    name: "صندوق أزيموت فرص الشريعة",
    category: "أسهم نشطة",
    dailyChange: 0.48,
    nav: 18.90,
    thndrAvailable: true,
    benchmark: "الأسهم المتوافقة مع الشريعة الإسلامية",
    strategy: "اقتناص فرص النمو والقيمة في الشركات المصرية الملتزمة بالكامل بضوابط ومعايير الشريعة الإسلامية",
    sectorFocus: "أسهم الشريعة الإسلامية"
  },
  {
    id: "bff",
    code: "BFF",
    name: "صندوق بنك القاهرة الأول",
    category: "أسهم نشطة",
    dailyChange: 0.45,
    nav: 35.20,
    thndrAvailable: true,
    benchmark: "مؤشر الأسهم القيادية المصرية",
    strategy: "استثمار متوازن في كبرى الشركات القيادية ذات المراكز المالية القوية وتوزيعات الأرباح المنتظمة",
    sectorFocus: "الأسهم القيادية ذات التوزيعات"
  },
  {
    id: "nhs",
    code: "NHS",
    name: "صندوق الحياة شريعة",
    category: "أسهم نشطة",
    dailyChange: 0.42,
    nav: 19.30,
    thndrAvailable: true,
    benchmark: "سلة الأسهم المتوافقة مع الشريعة الإسلامية",
    strategy: "محفظة أسهم إسلامية تركز على المسؤولية الاجتماعية والاستثمار الأخلاقي المتوافق مع الشريعة",
    sectorFocus: "استثمار شريعة إسلامية"
  },
  {
    id: "bfi",
    code: "BFI",
    name: "صندوق بلتون القطاع المالي",
    category: "أسهم نشطة",
    dailyChange: 0.16,
    nav: 21.40,
    thndrAvailable: true,
    benchmark: "مؤشر قطاع البنوك والخدمات المالية غير المصرفية",
    strategy: "استثمار قطاعي في كبرى البنوك، شركات التمويل الاستهلاكي، التأجير التمويلي، والخدمات المالية",
    sectorFocus: "قطاع البنوك والخدمات المالية"
  },
  {
    id: "ako",
    code: "AKO",
    name: "صندوق كنز فرص",
    category: "أسهم نشطة",
    dailyChange: 0.13,
    nav: 14.60,
    thndrAvailable: true,
    benchmark: "أسهم النمو السريع والقيمة السوقية الواعدة",
    strategy: "انتقاء الأسهم ذات إمكانيات التوسع السريع والربحية التشغيلية العالية بأسعار جاذبة",
    sectorFocus: "فرص النمو الواعدة"
  },
  {
    id: "bin",
    code: "BIN",
    name: "صندوق بلتون القطاع الصناعي",
    category: "أسهم نشطة",
    dailyChange: 0.12,
    nav: 18.70,
    thndrAvailable: true,
    benchmark: "مؤشر قطاع الصناعة والبتروكيماويات والأسمدة",
    strategy: "استثمار قطاعي متخصص في كبرى القلاع الصناعية المصرية، البتروكيماويات، الأسمدة، والتعدين",
    sectorFocus: "قطاع الصناعة والبتروكيماويات"
  },
  {
    id: "ago",
    code: "AGO",
    name: "صندوق جسور",
    category: "أسهم نشطة",
    dailyChange: 0.00,
    nav: 15.20,
    thndrAvailable: true,
    benchmark: "محفظة أسهم مشتركة متوازنة",
    strategy: "تحقيق توازن مرن بين النمو الرأسمالي والتوزيعات النقدية الدورية لحماية رأس المال",
    sectorFocus: "استثمار متوازن وعوائد مركبة"
  },
  {
    id: "cff",
    code: "CFF",
    name: "صندوق سي آي مال ومدفوعات رقمية",
    category: "أسهم نشطة",
    dailyChange: -0.03,
    nav: 13.90,
    thndrAvailable: true,
    benchmark: "مؤشر قطاع التكنولوجيا المالية والمدفوعات الإلكترونية",
    strategy: "استثمار متخصص في شركات التكنولوجيا المالية (FinTech)، المدفوعات الرقمية، والتحول المالي",
    sectorFocus: "التكنولوجيا المالية والمدفوعات"
  },
  {
    id: "c20",
    code: "C20",
    name: "صندوق سي آي 20HD",
    category: "أسهم نشطة",
    dailyChange: -0.09,
    nav: 16.40,
    thndrAvailable: true,
    benchmark: "مؤشر أفضل 20 شركة توزيعاً للأرباح (High Dividend Yield)",
    strategy: "انتقاء أفضل 20 شركة مصرية من حيث استدامة وسخاء التوزيعات النقدية الدورية للمساهمين",
    sectorFocus: "توزيعات الأرباح المرتفعة High Dividend"
  },
  {
    id: "bal",
    code: "BAL",
    name: "صندوق بلتون ألفا",
    category: "أسهم نشطة",
    dailyChange: -0.21,
    nav: 19.75,
    thndrAvailable: true,
    benchmark: "استراتيجية توليد ألفا (Alpha Generation Strategy)",
    strategy: "إدارة نشطة بأبحاث سوقية معمقة لاقتناص أسهم قادرة على تحقيق عائد يفوق المؤشر العام (Alpha)",
    sectorFocus: "توليد عوائد تفوق السوق Alpha"
  },
  {
    id: "nmf",
    code: "NMF",
    name: "صندوق NM أسهم شريعة",
    category: "أسهم نشطة",
    dailyChange: -0.21,
    nav: 15.10,
    thndrAvailable: true,
    benchmark: "سلة الأسهم المتوافقة مع الشريعة الإسلامية",
    strategy: "إدارة نشطة لمحفظة أسهم مصرية منتقاة بعناية فائقة طبقاً للضوابط الشرعية المعتمدة",
    sectorFocus: "أسهم الشريعة الإسلامية"
  },
  {
    id: "ccb",
    code: "CCB",
    name: "صندوق سي آي استهلاكي",
    category: "أسهم نشطة",
    dailyChange: -0.62,
    nav: 15.40,
    thndrAvailable: true,
    benchmark: "مؤشر قطاع السلع الاستهلاكية والأدوية والأغذية",
    strategy: "استثمار في شركات السلع الاستهلاكية المعمرة وغير المعمرة، الأغذية والمشروبات، والرعاية الصحية الدفاعية",
    sectorFocus: "قطاع السلع الاستهلاكية والأغذية"
  },
  {
    id: "cip",
    code: "CIP",
    name: "صندوق سي آي للاكتتابات الأولية",
    category: "أسهم نشطة",
    dailyChange: -0.78,
    nav: 13.80,
    thndrAvailable: true,
    benchmark: "الطروحات والاكتتابات الأولية (IPOs & Secondary Offerings)",
    strategy: "اقتناص الحصص في طروحات الشركات الجديدة بالبورصة المصرية وزيادات رؤوس الأموال للاستفادة من خصم الاكتتاب",
    sectorFocus: "الطروحات والاكتتابات الأولية IPOs"
  },
  {
    id: "bco",
    code: "BCO",
    name: "صندوق بلتون القطاع الاستهلاكي",
    category: "أسهم نشطة",
    dailyChange: -0.81,
    nav: 16.50,
    thndrAvailable: true,
    benchmark: "مؤشر قطاع الأغذية والمشروبات والسلع التموينية",
    strategy: "استثمار قطاعي في كبرى شركات الأغذية، الألبان، السلع الاستهلاكية، والقطاعات المقاومة للركود",
    sectorFocus: "قطاع السلع الاستهلاكية والأغذية"
  },
  {
    id: "otr",
    code: "OTR",
    name: "صندوق أودن ترند",
    category: "أسهم نشطة",
    dailyChange: -0.95,
    nav: 14.20,
    thndrAvailable: true,
    benchmark: "استراتيجية ركوب الاتجاه السعري (Trend Following Strategy)",
    strategy: "تتبع الاتجاهات السعرية القوية والتنقل الديناميكي بين القطاعات الرابحة لتعظيم العائد",
    sectorFocus: "استراتيجية اتجاهات السوق Trend"
  },
  {
    id: "nam",
    code: "NAM",
    name: "صندوق بنك الكويت الوطني المتميز",
    category: "أسهم نشطة",
    dailyChange: -1.24,
    nav: 24.10,
    thndrAvailable: true,
    benchmark: "مؤشر الأسهم الممتازة (Blue Chips EGX)",
    strategy: "محفظة منتقاة من الأسهم الممتازة ذات الملاءة المالية العالية وتدفقات السيولة القوية",
    sectorFocus: "الأسهم الممتازة Blue Chips"
  },
  {
    id: "bto",
    code: "BTO",
    name: "صندوق بلتون طروحات",
    category: "أسهم نشطة",
    dailyChange: -1.40,
    nav: 15.30,
    thndrAvailable: true,
    benchmark: "برنامج الطروحات الحكومية والخاصة",
    strategy: "المشاركة المكثفة في برنامج الطروحات الحكومية والخاصة للاستفادة من تسعير الاكتتابات المبدئية",
    sectorFocus: "الطروحات الحكومية والخاصة"
  },
  {
    id: "cti",
    code: "CTI",
    name: "صندوق سي آي تكنولوجيا واتصالات",
    category: "أسهم نشطة",
    dailyChange: -1.50,
    nav: 18.60,
    thndrAvailable: true,
    benchmark: "مؤشر قطاع الاتصالات وتكنولوجيا المعلومات",
    strategy: "استثمار قطاعي مركز في شركات مشغلي الاتصالات، مراكز البيانات، البرمجيات، والتحول الرقمي",
    sectorFocus: "قطاع التكنولوجيا والاتصالات"
  },
  {
    id: "mmf",
    code: "MMF",
    name: "صندوق ميدبنك الأول",
    category: "أسهم نشطة",
    dailyChange: -1.80,
    nav: 32.50,
    thndrAvailable: true,
    benchmark: "محفظة الأسهم المصرية المتوازنة",
    strategy: "محفظة أسهم تدار باحترافية لتحقيق توازن بين النمو الرأسمالي طويل الأجل والمحافظة على السيولة",
    sectorFocus: "النمو المتوازن وإدارة المخاطر"
  },
  {
    id: "zem",
    code: "ZEM",
    name: "صندوق زالدي المصري",
    category: "أسهم نشطة",
    dailyChange: -2.59,
    nav: 12.40,
    thndrAvailable: true,
    benchmark: "محفظة الأسهم الواعدة والشركات المتوسطة",
    strategy: "انتقاء الأسهم ذات تقييمات المضاعفات المنخفضة والفرص التشغيلية الواعدة بالسوق المصري",
    sectorFocus: "الأسهم الواعدة والتقييم الجاذب"
  },

  // 5. صناديق الدخل الثابت والسيولة (23 صندوق)
  {
    id: "aaf",
    code: "AAF",
    name: "صندوق آفاق",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 214.20,
    thndrAvailable: true,
    benchmark: "أذون وسندات الخزانة المصرية والودائع البنكية",
    strategy: "أدوات دخل ثابت حكومية وسيولة مصرفية قصيرة ومتوسطة الأجل لتحقيق دخل دوري آمن",
    sectorFocus: "أذون خزانة وودائع بنكية"
  },
  {
    id: "abr",
    code: "ABR",
    name: "صندوق بريق",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    navRaw: "LIVE_ABR_NAV",
    thndrAvailable: true,
    benchmark: "أذون الخزانة المصرية قصيرة الأجل (عائد يومي معفي من الضرائب)",
    strategy: "صندوق استثمار نقدي بأذون الخزانة الحكومية بعائد يومي تراكمي معفي تماماً من الضرائب للمصريين والأجانب",
    sectorFocus: "سيولة نقدية وعائد يومي"
  },
  {
    id: "adm",
    code: "ADM",
    name: "صندوق دياموند",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 198.50,
    thndrAvailable: true,
    benchmark: "أدوات الدين الحكومية والسيولة النقدية",
    strategy: "استثمار منخفض المخاطر في أذون الخزانة والأوعية الادخارية المصرفية",
    sectorFocus: "أدوات دين وسيولة نقدية"
  },
  {
    id: "aef",
    code: "AEF",
    name: "صندوق الفنار",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 210.30,
    thndrAvailable: true,
    benchmark: "أذون وسندات الخزانة الحكومية",
    strategy: "توفير عائد دوري منتظم مع المحافظة على سلامة رأس المال عبر أوراق الدين الحكومية",
    sectorFocus: "أذون وسندات حكومية"
  },
  {
    id: "aim",
    code: "AIM",
    name: "صندوق إسكان للتأمين",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 185.70,
    thndrAvailable: true,
    benchmark: "أدوات السيولة المصرفية والدين السيادي",
    strategy: "محفظة نقدية متحفظة تستثمر في أدوات الدين الحكومية المضمونة وودائع البنوك الكبرى",
    sectorFocus: "أدوات سيولة ودين سيادي"
  },
  {
    id: "ais",
    code: "AIS",
    name: "صندوق استثمار وأمان",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 195.40,
    thndrAvailable: true,
    benchmark: "أذون الخزانة المصرية ذات العائد التراكمي",
    strategy: "حماية رأس المال وتنميته من خلال أذون الخزانة والودائع البنكية قصيرة الأجل",
    sectorFocus: "أذون خزانة وعائد تراكمي"
  },
  {
    id: "ara",
    code: "ARA",
    name: "صندوق أسباير رواج",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 188.90,
    thndrAvailable: true,
    benchmark: "أدوات الدخل الثابت قصيرة ومتوسطة الأجل",
    strategy: "أدوات دين محلية وسندات خزانة لتعظيم العائد النقدي للمستثمرين بمخاطر متدنية",
    sectorFocus: "دخل ثابت وسيولة"
  },
  {
    id: "atd",
    code: "ATD",
    name: "صندوق الأهلي تميز ذو التوزيع",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 205.10,
    thndrAvailable: true,
    benchmark: "سندات الخزانة المصرية ذات العائد الدوري",
    strategy: "صندوق دخل ثابت يركز على سندات الخزانة لتوزيع عائد نقدي دوري منتظم للمستثمرين بإدارة البنك الأهلي",
    sectorFocus: "سندات وتوزيعات دورية"
  },
  {
    id: "bcu",
    code: "BCU",
    name: "صندوق بي كوبونات",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 175.80,
    thndrAvailable: true,
    benchmark: "سندات الخزانة وصكوك التمويل ذات الكوبون الدوري",
    strategy: "استثمار مركز في سندات الخزانة وصكوك التمويل لتوزيع كوبونات نقدية دورية ربع سنوية",
    sectorFocus: "سندات وكوبونات دورية"
  },
  {
    id: "bya",
    code: "BYA",
    name: "صندوق بي يومي",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 22.30,
    thndrAvailable: true,
    benchmark: "أذون الخزانة المصرية قصيرة الأجل (عائد يومي تراكمي)",
    strategy: "صندوق بلتون للسيولة النقدية اليومية، استثمار في أذون الخزانة بعائد يومي تراكمي وسحب فوري",
    sectorFocus: "سيولة نقدية يومية مركبة"
  },
  {
    id: "ccs",
    code: "CCS",
    name: "صندوق كايرو كابيتال ستريم",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 192.40,
    thndrAvailable: true,
    benchmark: "أدوات الدين والسيولة النقدية المستقرة",
    strategy: "توليد تدفقات نقدية مستمرة ومستقرة عبر محفظة متنوعة من أدوات الدين قصيرة الأجل",
    sectorFocus: "تدفقات دخل ثابت مستمرة"
  },
  {
    id: "gra",
    code: "GRA",
    name: "صندوق جرانيت",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 184.20,
    thndrAvailable: true,
    benchmark: "أذون وسندات الخزانة الحكومية",
    strategy: "استثمار منخفض المخاطر يركز على الأوراق المالية السيادية وشهادات الإيداع البنكية",
    sectorFocus: "أوراق مالية سيادية"
  },
  {
    id: "mtf",
    code: "MTF",
    name: "صندوق مصر للتأمين التكافلي",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 189.60,
    thndrAvailable: true,
    benchmark: "الصكوك وأدوات الدين المتوافقة مع الشريعة والتكافل",
    strategy: "محفظة أدوات دخل ثابت وصكوك حكومية متوافقة بالكامل مع أحكام الشريعة الإسلامية ومبادئ التكافل",
    sectorFocus: "صكوك ودخل ثابت شريعة"
  },
  {
    id: "ofo",
    code: "OFO",
    name: "صندوق أودن الرابع",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 178.50,
    thndrAvailable: true,
    benchmark: "أدوات الدين قصيرة ومتوسطة الأجل",
    strategy: "أدوات دين وأذون خزانة لتحقيق عائد دوري مستقر للمدخرين",
    sectorFocus: "أدوات دين وعائد مستقر"
  },
  {
    id: "pcm",
    code: "PCM",
    name: "صندوق كاشي PFI",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 181.30,
    thndrAvailable: true,
    benchmark: "أدوات السيولة النقدية وأذون الخزانة",
    strategy: "صندوق نقدي لإدارة السيولة قصيرة الأجل بمستوى أمان مرتفع وعائد تراكمي",
    sectorFocus: "إدارة سيولة نقدية"
  },
  {
    id: "zst",
    code: "ZST",
    name: "صندوق زالدي ستار",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 172.90,
    thndrAvailable: true,
    benchmark: "أذون الخزانة والودائع البنكية",
    strategy: "استثمار نقدي متحفظ بأذون الخزانة المصرية لتحقيق عائد دوري آمن",
    sectorFocus: "أذون خزانة وودائع"
  },
  {
    id: "asa",
    code: "ASA",
    name: "صندوق ثروتي",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 186.40,
    thndrAvailable: true,
    benchmark: "أدوات الدخل الثابت الحكومية",
    strategy: "المحافظة على ثروات المدخرين عبر استثمار في أدوات الدين الحكومية والودائع المصرفية",
    sectorFocus: "أدوات دخل ثابت حكومية"
  },
  {
    id: "awe",
    code: "AWE",
    name: "صندوق وثاق",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.05,
    nav: 191.00,
    thndrAvailable: true,
    benchmark: "أذون وسندات الخزانة المصرية",
    strategy: "محفظة متحفظة تستثمر في أوراق الدين الحكومية المصرية لتحقيق أقصى درجات الأمان المالي",
    sectorFocus: "أوراق دين حكومية آمنة"
  },
  {
    id: "azn",
    code: "AZN",
    name: "صندوق أزيموت ناصر",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.04,
    nav: 218.40,
    thndrAvailable: true,
    benchmark: "أذون وسندات الخزانة المصرية ذات البعد التكافلي",
    strategy: "صندوق استثمار نقدي بالتعاون مع بنك ناصر الاجتماعي وأزيموت مصر بعائد دوري آمن وتكافلي",
    sectorFocus: "استثمار نقدي وتكافلي"
  },
  {
    id: "azs",
    code: "AZS",
    name: "صندوق AZ ادخار",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.04,
    nav: 21.55,
    thndrAvailable: true,
    benchmark: "أذون الخزانة المصرية قصيرة الأجل (عائد يومي تراكمي)",
    strategy: "صندوق أزيموت مصر للاستثمار النقدي بأذون الخزانة بعائد يومي تراكمي وسحب فوري بدون مصاريف",
    sectorFocus: "سيولة نقدية وعائد يومي"
  },
  {
    id: "bsc",
    code: "BSC",
    name: "صندوق بي سيكيور",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.04,
    nav: 182.60,
    thndrAvailable: true,
    benchmark: "أذون وسندات الخزانة الحكومية عالية الأمان",
    strategy: "محفظة دخل ثابت حكومية تركز على أقصى درجات الأمان المالي والسيولة النقدية المستقرة",
    sectorFocus: "أمان سيادي وسيولة مستقرة"
  },
  {
    id: "pgm",
    code: "PGM",
    name: "صندوق بي جي آي للتأمين النقدي للسيولة",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.04,
    nav: 176.40,
    thndrAvailable: true,
    benchmark: "أدوات السيولة المصرفية والدين السيادي",
    strategy: "استثمار في أذون الخزانة وأدوات السيولة النقدية لشركات التأمين والمستثمرين المتحفظين",
    sectorFocus: "سيولة نقدية وأدوات دين"
  },
  {
    id: "tfi",
    code: "TFI",
    name: "صندوق تارجت الأول",
    category: "دخل ثابت ونقدي",
    dailyChange: 0.04,
    nav: 192.10,
    thndrAvailable: true,
    benchmark: "أذون وسندات الخزانة المصرية والودائع البنكية",
    strategy: "أدوات دخل ثابت وودائع بنكية لتعظيم العائد التراكمي بمخاطر متدنية",
    sectorFocus: "أذون خزانة وعائد دوري"
  }
];

// Read egxService.ts
const targetFile = path.resolve(__dirname, '../src/services/egxService.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// Build code string for array
const fundCodeItems = funds.map(f => {
  const lines = [
    `    id: ${JSON.stringify(f.id)},`,
    `    code: ${JSON.stringify(f.code)},`,
    `    name: ${JSON.stringify(f.name)},`,
    `    category: ${JSON.stringify(f.category)},`,
    `    dailyChange: ${f.dailyChange},`,
  ];
  if (f.navRaw) {
    lines.push(`    nav: ${f.navRaw},`);
  } else if (f.nav !== undefined) {
    lines.push(`    nav: ${f.nav},`);
  }
  if (f.isSavingPot) {
    lines.push(`    isSavingPot: true,`);
  }
  lines.push(`    thndrAvailable: ${Boolean(f.thndrAvailable)},`);
  lines.push(`    benchmark: ${JSON.stringify(f.benchmark)},`);
  lines.push(`    strategy: ${JSON.stringify(f.strategy)},`);
  lines.push(`    sectorFocus: ${JSON.stringify(f.sectorFocus)}`);
  return `  {\n${lines.join('\n')}\n  }`;
});

const newArrayCode = `export const EGYPTIAN_MUTUAL_FUNDS: MutualFund[] = [\n${fundCodeItems.join(',\n')}\n];`;

// Replace in content
const startTag = 'export const EGYPTIAN_MUTUAL_FUNDS: MutualFund[] = [';
const endTag = 'export const EGYPTIAN_FUNDS_MAP';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not locate bounds for EGYPTIAN_MUTUAL_FUNDS');
  process.exit(1);
}

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);

content = before + newArrayCode + '\n\n' + after;

// Also update convertFundToStockData to set isEGX30, isEGX70, isEGX100 correctly based on benchmark
const oldConvertSig = `export function convertFundToStockData(fund: MutualFund): StockData {`;
const oldConvertEnd = `    sector: \`صناديق استثمار (\${fund.category})\`,
    isFund: true,
    isGold
  };
}`;

const convertStart = content.indexOf(oldConvertSig);
const convertEnd = content.indexOf(oldConvertEnd);

if (convertStart !== -1 && convertEnd !== -1) {
  const newConvert = `export function convertFundToStockData(fund: MutualFund): StockData {
  const price = fund.nav || 10.0;
  const isGold = fund.id === 'thndr-gold' || fund.code.toUpperCase() === 'THNDRGOLD' || fund.category === 'ذهب وفضة';
  const fundVolume = isGold ? 650000 : 250000;
  
  // Accurate index tagging based on fund benchmark & code
  const isEGX30 = Boolean(fund.benchmark?.includes('EGX30') || fund.code.toUpperCase() === 'CI30');
  const isEGX70 = Boolean(fund.benchmark?.includes('EGX70') || ['T70', 'B70', 'AK70', 'NCS'].includes(fund.code.toUpperCase()));
  const isEGX100 = Boolean(fund.benchmark?.includes('EGX100') || fund.code.toUpperCase() === 'BMM' || isEGX30 || isEGX70);

  return {
    symbol: fund.code.toUpperCase(),
    ticker: \`EGX:\${fund.code.toUpperCase()}\`,
    nameAr: fund.name,
    nameEn: fund.code.toUpperCase(),
    close: price,
    change: Number(((price * fund.dailyChange) / 100).toFixed(2)),
    changePercent: fund.dailyChange,
    volume: fundVolume,
    turnover: Number((fundVolume * price).toFixed(2)),
    recommendationScore: fund.dailyChange >= 0 ? 0.35 : -0.15,
    recommendationText: fund.dailyChange >= 0.5 ? 'شراء قوي' : (fund.dailyChange >= 0 ? 'شراء' : 'مراقبة / محايد'),
    rsi: fund.dailyChange >= 0 ? 55 + (fund.dailyChange * 5) : 45 + (fund.dailyChange * 5),
    rsi1h: 52,
    rec1h: 0.3,
    rec4h: 0.35,
    rec1w: 0.4,
    ema20: Number((price * 0.99).toFixed(5)),
    ema50: Number((price * 0.98).toFixed(5)),
    ema200: Number((price * 0.95).toFixed(5)),
    support1: Number((price * 0.96).toFixed(5)),
    support2: Number((price * 0.93).toFixed(5)),
    resistance1: Number((price * 1.05).toFixed(5)),
    resistance2: Number((price * 1.10).toFixed(5)),
    pivot: price,
    isEGX30,
    isEGX70,
    isEGX100,
    sector: \`صناديق استثمار (\${fund.category})\`,
    isFund: true,
    isGold
  };
}`;
  content = content.slice(0, convertStart) + newConvert + content.slice(convertEnd + oldConvertEnd.length);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated egxService.ts with 73 funds data and accurate index tagging!');
