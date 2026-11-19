// Professional bilingual content templates per category.
// `{name}` is replaced with the service title in the matching language.
// Prices are SUGGESTED starting prices in JOD and can be changed by admins/providers.

export interface Faq { qEn: string; qAr: string; aEn: string; aAr: string }
export interface PackageTpl {
  nameEn: string; nameAr: string;
  descEn: string; descAr: string;
  featuresEn: string[]; featuresAr: string[];
}
export interface CategoryTemplate {
  prices: [number, number, number]; // basic, standard, premium
  days: [number, number, number];
  revisions: [number, number, number];
  overviewEn: string; overviewAr: string;
  includedEn: string[]; includedAr: string[];
  featuresEn: string[]; featuresAr: string[];
  requirementsEn: string[]; requirementsAr: string[];
  deliverablesEn: string[]; deliverablesAr: string[];
  faq: Faq[];
  packages: [PackageTpl, PackageTpl, PackageTpl];
}

const INTEGRITY_FAQ: Faq = {
  qEn: 'Does this service respect academic integrity?',
  qAr: 'هل تحترم هذه الخدمة النزاهة الأكاديمية؟',
  aEn: 'Yes. Naajah services support your learning and your own work through guidance, review, explanation and development assistance. Always follow your university’s policy on external help and acknowledge support where required.',
  aAr: 'نعم. تدعم خدمات نجاح تعلّمك وعملك الخاص من خلال الإرشاد والمراجعة والشرح والمساعدة في التطوير. التزم دائمًا بسياسة جامعتك بشأن المساعدة الخارجية، واذكر الدعم الذي تلقيته عند الحاجة.',
};

const REVISION_FAQ: Faq = {
  qEn: 'What if I need changes after delivery?',
  qAr: 'ماذا لو احتجت إلى تعديلات بعد التسليم؟',
  aEn: 'Each package includes a set number of revision rounds. Just message us on WhatsApp with the changes you need and we will update the delivery within the agreed scope.',
  aAr: 'تتضمن كل باقة عددًا محددًا من جولات التعديل. راسلنا عبر واتساب بالتعديلات التي تحتاجها وسنحدّث التسليم ضمن النطاق المتفق عليه.',
};

// The website is a showcase: no payments are processed online. Students contact the team on WhatsApp.
export const ORDER_FAQ: Faq = {
  qEn: 'How do I order this service?',
  qAr: 'كيف أطلب هذه الخدمة؟',
  aEn: 'Choose a package and tap “Contact us on WhatsApp”. Our team will reply to discuss your requirements, confirm the price and agree on the delivery date directly with you. No payment is taken on the website.',
  aAr: 'اختر الباقة واضغط «تواصل معنا عبر واتساب». سيرد عليك فريقنا لمناقشة متطلباتك وتأكيد السعر والاتفاق على موعد التسليم معك مباشرة. لا تتم أي عملية دفع عبر الموقع.',
};

const TIERS = { en: ['Basic', 'Standard', 'Premium'], ar: ['الأساسية', 'القياسية', 'المميزة'] };
const pkg = (i: 0 | 1 | 2, descEn: string, descAr: string, featuresEn: string[], featuresAr: string[]): PackageTpl => ({
  nameEn: TIERS.en[i], nameAr: TIERS.ar[i], descEn, descAr, featuresEn, featuresAr,
});

export const TEMPLATES: Record<string, CategoryTemplate> = {
  // ───────────────────────── Programming ─────────────────────────
  programming: {
    prices: [35, 55, 95], days: [3, 5, 8], revisions: [1, 2, 3],
    overviewEn: 'Our {name} service is built for university students who want working, well-structured code they truly understand. Your provider works from your requirements and course guidelines, explains every key decision, and hands over a working solution you can run, extend and present with confidence.',
    overviewAr: 'صُممت خدمة {name} لطلاب الجامعات الذين يريدون شيفرة برمجية منظمة وعاملة يفهمونها فعلًا. يعمل المزود وفق متطلباتك وإرشادات مقررك، ويشرح كل قرار مهم، ويسلّمك حلًا عمليًا يمكنك تشغيله وتطويره وعرضه بثقة.',
    includedEn: ['Requirements review and clarification', 'Setup and run instructions', 'Explanation of the solution and its logic'],
    includedAr: ['مراجعة المتطلبات وتوضيحها', 'تعليمات الإعداد والتشغيل', 'شرح الحل ومنطقه البرمجي'],
    featuresEn: ['Follows your course requirements and coding standards', 'Readable, modular structure', 'Tested before delivery', 'Designed to help you learn, not just submit'],
    featuresAr: ['يلتزم بمتطلبات مقررك ومعايير البرمجة', 'هيكلية واضحة ومقسّمة', 'مختبر قبل التسليم', 'مصمم ليساعدك على التعلم وليس للتسليم فقط'],
    requirementsEn: ['Assignment or project description', 'Required language version, libraries or framework', 'Deadline and grading rubric (if available)', 'Any existing code or starter files'],
    requirementsAr: ['وصف الواجب أو المشروع', 'إصدار اللغة أو المكتبات أو إطار العمل المطلوب', 'الموعد النهائي ومعايير التقييم (إن وجدت)', 'أي شيفرة سابقة أو ملفات بداية'],
    deliverablesEn: ['Source code (ZIP or Git repository)', 'README with setup and run steps', 'Written explanation of the solution'],
    deliverablesAr: ['الشيفرة المصدرية (ملف ZIP أو مستودع Git)', 'ملف README بخطوات الإعداد والتشغيل', 'شرح مكتوب للحل'],
    faq: [
      { qEn: 'Will I understand the code I receive?', qAr: 'هل سأفهم الشيفرة التي سأستلمها؟', aEn: 'Yes. Every delivery includes an explanation, and the Premium package adds a live walkthrough session where you can ask questions.', aAr: 'نعم. يتضمن كل تسليم شرحًا للحل، وتضيف الباقة المميزة جلسة شرح مباشرة يمكنك خلالها طرح أسئلتك.' },
      { qEn: 'Can you match the tools and versions my course uses?', qAr: 'هل يمكن الالتزام بالأدوات والإصدارات التي يستخدمها مقرري؟', aEn: 'Yes. Tell us the IDE, language version and libraries required and the provider will work in the same environment.', aAr: 'نعم. أخبرنا ببيئة التطوير وإصدار اللغة والمكتبات المطلوبة وسيعمل المزود في البيئة نفسها.' },
      REVISION_FAQ, INTEGRITY_FAQ,
    ],
    packages: [
      pkg(0, 'A focused task: one feature, function or bug.', 'مهمة محددة: ميزة أو دالة أو خطأ واحد.', ['1 task or feature', 'Commented code', 'Run instructions'], ['مهمة أو ميزة واحدة', 'شيفرة موثقة', 'تعليمات التشغيل']),
      pkg(1, 'A complete assignment or module with tests.', 'واجب أو وحدة برمجية كاملة مع الاختبارات.', ['Complete assignment', 'Basic tests', 'Written explanation', 'README'], ['واجب كامل', 'اختبارات أساسية', 'شرح مكتوب', 'ملف README']),
      pkg(2, 'A full project with documentation and a live explanation session.', 'مشروع متكامل مع التوثيق وجلسة شرح مباشرة.', ['Full project scope', 'Tests and documentation', '30-minute live walkthrough', 'Priority support'], ['نطاق مشروع كامل', 'اختبارات وتوثيق', 'جلسة شرح مباشرة 30 دقيقة', 'دعم ذو أولوية']),
    ],
  },

  // ───────────────────────── Artificial Intelligence ─────────────────────────
  'artificial-intelligence': {
    prices: [40, 85, 150], days: [4, 7, 12], revisions: [1, 2, 3],
    overviewEn: 'The {name} service helps you design, build and evaluate AI solutions the right way. From data preparation to model training and evaluation, your provider follows sound ML practice, documents every experiment, and makes sure you understand the approach well enough to explain and defend it.',
    overviewAr: 'تساعدك خدمة {name} على تصميم حلول الذكاء الاصطناعي وبنائها وتقييمها بالطريقة الصحيحة. من تجهيز البيانات إلى تدريب النموذج وتقييمه، يتبع المزود أفضل ممارسات تعلم الآلة، ويوثّق كل تجربة، ويتأكد من فهمك للمنهجية بما يكفي لشرحها والدفاع عنها.',
    includedEn: ['Problem framing and approach selection', 'Data preparation pipeline', 'Model training and tuning', 'Evaluation with appropriate metrics'],
    includedAr: ['تحديد المشكلة واختيار المنهجية', 'مسار تجهيز البيانات', 'تدريب النموذج وضبطه', 'التقييم بالمقاييس المناسبة'],
    featuresEn: ['Reproducible notebooks and scripts', 'Clear experiment documentation', 'Honest reporting of results and limitations', 'Explained in plain language'],
    featuresAr: ['دفاتر وشيفرات قابلة لإعادة التنفيذ', 'توثيق واضح للتجارب', 'عرض صادق للنتائج وحدودها', 'شرح بلغة مبسطة'],
    requirementsEn: ['Project goal and course requirements', 'Dataset (or permission to use a public one)', 'Preferred frameworks (e.g. scikit-learn, PyTorch, TensorFlow)', 'Expected metrics or baseline, if any'],
    requirementsAr: ['هدف المشروع ومتطلبات المقرر', 'مجموعة البيانات (أو الموافقة على استخدام مجموعة عامة)', 'أطر العمل المفضلة (مثل scikit-learn أو PyTorch أو TensorFlow)', 'المقاييس المتوقعة أو خط الأساس إن وجد'],
    deliverablesEn: ['Jupyter notebook and/or Python source', 'Trained model files (where size allows)', 'Results report with charts and metrics'],
    deliverablesAr: ['دفتر Jupyter و/أو شيفرة Python', 'ملفات النموذج المدرب (حسب الحجم)', 'تقرير بالنتائج مع الرسوم والمقاييس'],
    faq: [
      { qEn: 'Can you guarantee a specific accuracy?', qAr: 'هل يمكن ضمان دقة معينة؟', aEn: 'No honest provider can guarantee a metric before seeing the data. We commit to a sound method, a fair evaluation and transparent reporting of what the model can and cannot do.', aAr: 'لا يمكن لأي مزود أمين ضمان نتيجة قبل رؤية البيانات. نلتزم بمنهجية سليمة وتقييم عادل وعرض شفاف لما يستطيع النموذج فعله وما لا يستطيعه.' },
      { qEn: 'Do I need a GPU?', qAr: 'هل أحتاج إلى معالج رسومي GPU؟', aEn: 'Not necessarily. Providers can use free cloud notebooks such as Google Colab, and will tell you the hardware needed to reproduce the results.', aAr: 'ليس بالضرورة. يمكن للمزودين استخدام دفاتر سحابية مجانية مثل Google Colab، وسيوضحون لك العتاد اللازم لإعادة إنتاج النتائج.' },
      REVISION_FAQ, INTEGRITY_FAQ,
    ],
    packages: [
      pkg(0, 'Baseline model on a prepared dataset.', 'نموذج أساسي على مجموعة بيانات جاهزة.', ['1 model', 'Basic evaluation', 'Notebook'], ['نموذج واحد', 'تقييم أساسي', 'دفتر Jupyter']),
      pkg(1, 'Full pipeline with comparison of several models.', 'مسار متكامل مع مقارنة عدة نماذج.', ['Data preprocessing', 'Up to 3 models compared', 'Tuning', 'Results report'], ['معالجة مسبقة للبيانات', 'مقارنة حتى 3 نماذج', 'ضبط المعاملات', 'تقرير النتائج']),
      pkg(2, 'Complete project with report, demo app and explanation session.', 'مشروع كامل مع تقرير وتطبيق تجريبي وجلسة شرح.', ['Everything in Standard', 'Simple demo interface', 'Detailed report', '45-minute live walkthrough'], ['كل ما في القياسية', 'واجهة تجريبية بسيطة', 'تقرير مفصل', 'جلسة شرح مباشرة 45 دقيقة']),
    ],
  },

  // ───────────────────────── Data Science ─────────────────────────
  'data-science': {
    prices: [35, 55, 95], days: [3, 5, 8], revisions: [1, 2, 3],
    overviewEn: 'With {name}, your data becomes clear answers. Your provider cleans and explores the data, applies the right analytical methods, and presents findings in clear tables and visualisations — with every step documented so you can reproduce and explain the analysis.',
    overviewAr: 'مع خدمة {name} تتحول بياناتك إلى إجابات واضحة. ينظّف المزود البيانات ويستكشفها، ويطبّق أساليب التحليل المناسبة، ويعرض النتائج في جداول ورسوم بيانية واضحة، مع توثيق كل خطوة لتتمكن من إعادة التحليل وشرحه.',
    includedEn: ['Data quality check and cleaning', 'Analysis using appropriate methods', 'Charts and summary tables', 'Interpretation of results'],
    includedAr: ['فحص جودة البيانات وتنظيفها', 'التحليل بالأساليب المناسبة', 'رسوم بيانية وجداول ملخصة', 'تفسير النتائج'],
    featuresEn: ['Reproducible workflow', 'Publication-quality visuals', 'Assumptions checked and stated', 'Clear, non-technical summary'],
    featuresAr: ['سير عمل قابل لإعادة التنفيذ', 'رسوم بيانية بجودة احترافية', 'التحقق من الافتراضات وذكرها', 'ملخص واضح وغير تقني'],
    requirementsEn: ['Dataset file(s) (CSV, Excel, SPSS, etc.)', 'Questions you need the analysis to answer', 'Required tool (Python, R, Excel, Power BI, Tableau)', 'Formatting or report guidelines'],
    requirementsAr: ['ملف أو ملفات البيانات (CSV أو Excel أو SPSS وغيرها)', 'الأسئلة التي يجب أن يجيب عنها التحليل', 'الأداة المطلوبة (Python أو R أو Excel أو Power BI أو Tableau)', 'إرشادات التنسيق أو التقرير'],
    deliverablesEn: ['Analysis file (notebook, script, workbook or dashboard)', 'Charts and tables', 'Short findings summary'],
    deliverablesAr: ['ملف التحليل (دفتر أو شيفرة أو مصنف أو لوحة معلومات)', 'الرسوم البيانية والجداول', 'ملخص قصير للنتائج'],
    faq: [
      { qEn: 'Is my data kept private?', qAr: 'هل تبقى بياناتي خاصة؟', aEn: 'Yes. Files you share with us are used only for your request and are never published or shared with anyone else.', aAr: 'نعم. الملفات التي تشاركها معنا تُستخدم لطلبك فقط، ولا تُنشر ولا تُشارك مع أي جهة أخرى.' },
      { qEn: 'Can you work with messy data?', qAr: 'هل يمكن العمل مع بيانات غير مرتبة؟', aEn: 'Yes — cleaning is part of the service. Larger cleaning jobs may need the Standard or Premium package.', aAr: 'نعم، التنظيف جزء من الخدمة. قد تحتاج أعمال التنظيف الكبيرة إلى الباقة القياسية أو المميزة.' },
      REVISION_FAQ, ORDER_FAQ,
    ],
    packages: [
      pkg(0, 'Focused analysis of one question on a clean dataset.', 'تحليل مركّز لسؤال واحد على بيانات جاهزة.', ['1 research question', 'Up to 3 charts', 'Short summary'], ['سؤال تحليلي واحد', 'حتى 3 رسوم بيانية', 'ملخص قصير']),
      pkg(1, 'Complete analysis with cleaning and a findings report.', 'تحليل كامل مع التنظيف وتقرير بالنتائج.', ['Data cleaning', 'Up to 3 questions', 'Up to 8 charts', 'Findings report'], ['تنظيف البيانات', 'حتى 3 أسئلة', 'حتى 8 رسوم بيانية', 'تقرير النتائج']),
      pkg(2, 'In-depth analysis or interactive dashboard with explanation session.', 'تحليل معمق أو لوحة معلومات تفاعلية مع جلسة شرح.', ['Everything in Standard', 'Interactive dashboard or advanced models', 'Detailed report', '30-minute walkthrough'], ['كل ما في القياسية', 'لوحة تفاعلية أو نماذج متقدمة', 'تقرير مفصل', 'جلسة شرح 30 دقيقة']),
    ],
  },

  // ───────────────────────── Database ─────────────────────────
  database: {
    prices: [20, 45, 80], days: [2, 4, 7], revisions: [1, 2, 3],
    overviewEn: 'The {name} service gives you a database that is correct, efficient and easy to explain. Your provider analyses your requirements, applies proper design principles and normalisation, and delivers scripts and diagrams that follow the notation your course expects.',
    overviewAr: 'تمنحك خدمة {name} قاعدة بيانات صحيحة وفعالة وسهلة الشرح. يحلل المزود متطلباتك، ويطبّق مبادئ التصميم والتطبيع الصحيحة، ويسلّم شيفرات ومخططات تتبع الترميز الذي يعتمده مقررك.',
    includedEn: ['Requirements and business-rule analysis', 'Design following course notation', 'SQL scripts (DDL/DML) where relevant', 'Explanation of design decisions'],
    includedAr: ['تحليل المتطلبات وقواعد العمل', 'تصميم وفق الترميز المعتمد في المقرر', 'شيفرات SQL (DDL/DML) عند الحاجة', 'شرح قرارات التصميم'],
    featuresEn: ['Normalised to the required normal form', 'Keys, constraints and indexes defined', 'Sample data for testing', 'Works on your required DBMS'],
    featuresAr: ['مطبّع حتى الصيغة المطلوبة', 'تعريف المفاتيح والقيود والفهارس', 'بيانات تجريبية للاختبار', 'يعمل على نظام إدارة قواعد البيانات المطلوب'],
    requirementsEn: ['Case study or requirements document', 'Required database system (MySQL or Oracle)', 'Diagram notation required (Chen or Crow’s Foot)', 'Deadline and rubric'],
    requirementsAr: ['دراسة الحالة أو وثيقة المتطلبات', 'نظام قواعد البيانات المطلوب (MySQL أو Oracle)', 'ترميز المخطط المطلوب (Chen أو Crow’s Foot)', 'الموعد النهائي ومعايير التقييم'],
    deliverablesEn: ['Diagram files (PNG/PDF + editable source)', 'SQL scripts', 'Short design explanation'],
    deliverablesAr: ['ملفات المخططات (PNG/PDF مع الملف القابل للتعديل)', 'شيفرات SQL', 'شرح مختصر للتصميم'],
    faq: [
      { qEn: 'Which diagram tools do you use?', qAr: 'ما أدوات رسم المخططات المستخدمة؟', aEn: 'Common choices are draw.io, Lucidchart, MySQL Workbench and ERDPlus. Tell us if your course requires a specific tool.', aAr: 'من الخيارات الشائعة draw.io وLucidchart وMySQL Workbench وERDPlus. أخبرنا إن كان مقررك يتطلب أداة معينة.' },
      { qEn: 'Will the scripts run on my machine?', qAr: 'هل ستعمل الشيفرات على جهازي؟', aEn: 'Yes. Scripts are tested on the DBMS and version you specify, with instructions to load them.', aAr: 'نعم. تُختبر الشيفرات على النظام والإصدار الذي تحدده، مع تعليمات لتحميلها.' },
      REVISION_FAQ, INTEGRITY_FAQ,
    ],
    packages: [
      pkg(0, 'A focused task: one diagram, query set or fix.', 'مهمة محددة: مخطط واحد أو مجموعة استعلامات أو إصلاح.', ['Up to 8 entities or 10 queries', 'Short explanation'], ['حتى 8 كيانات أو 10 استعلامات', 'شرح مختصر']),
      pkg(1, 'Complete design with scripts and sample data.', 'تصميم متكامل مع الشيفرات والبيانات التجريبية.', ['Up to 15 entities', 'DDL + sample data', 'Normalisation notes', 'Explanation document'], ['حتى 15 كيانًا', 'DDL مع بيانات تجريبية', 'ملاحظات التطبيع', 'وثيقة شرح']),
      pkg(2, 'Full database project with documentation and walkthrough.', 'مشروع قاعدة بيانات كامل مع التوثيق وجلسة شرح.', ['Everything in Standard', 'Views, procedures or advanced queries', 'Full documentation', '30-minute walkthrough'], ['كل ما في القياسية', 'طرق عرض أو إجراءات أو استعلامات متقدمة', 'توثيق كامل', 'جلسة شرح 30 دقيقة']),
    ],
  },

  // ───────────────────────── Research ─────────────────────────
  research: {
    prices: [30, 65, 120], days: [3, 6, 10], revisions: [1, 2, 3],
    overviewEn: 'The {name} service connects you with experienced researchers who guide and review your work. You stay the author of your research: your advisor helps you think more clearly, apply sound methodology, and strengthen your writing through detailed feedback, explanations and recommended sources.',
    overviewAr: 'تربطك خدمة {name} بباحثين ذوي خبرة يرشدونك ويراجعون عملك. تبقى أنت مؤلف بحثك، ويساعدك المستشار على التفكير بوضوح أكبر وتطبيق منهجية سليمة وتقوية كتابتك من خلال ملاحظات مفصلة وشروح ومصادر مقترحة.',
    includedEn: ['Review of your current draft or idea', 'Detailed written feedback', 'Methodological guidance and recommended sources', 'Follow-up questions answered'],
    includedAr: ['مراجعة مسودتك أو فكرتك الحالية', 'ملاحظات مكتوبة مفصلة', 'إرشاد منهجي ومصادر مقترحة', 'الإجابة عن أسئلة المتابعة'],
    featuresEn: ['Experienced academic reviewers', 'Supports APA, IEEE, Harvard and more', 'Comments directly on your document', 'Respects your voice and authorship'],
    featuresAr: ['مراجعون أكاديميون ذوو خبرة', 'يدعم APA وIEEE وHarvard وغيرها', 'تعليقات مباشرة على مستندك', 'يحترم أسلوبك وملكيتك للعمل'],
    requirementsEn: ['Your draft, proposal or research idea', 'Field of study and academic level', 'University guidelines and citation style', 'Specific questions or concerns'],
    requirementsAr: ['مسودتك أو خطتك أو فكرة بحثك', 'التخصص والمستوى الأكاديمي', 'إرشادات الجامعة ونمط التوثيق', 'أسئلة أو مخاوف محددة'],
    deliverablesEn: ['Annotated document with comments', 'Feedback report with recommendations', 'List of suggested sources (where relevant)'],
    deliverablesAr: ['المستند مع التعليقات', 'تقرير ملاحظات وتوصيات', 'قائمة بالمصادر المقترحة (عند الحاجة)'],
    faq: [
      { qEn: 'Will someone write my research for me?', qAr: 'هل سيكتب أحد بحثي بدلًا مني؟', aEn: 'No. Research services are guidance, review and tutoring. Your advisor helps you improve your own work; the research and writing remain yours.', aAr: 'لا. خدمات البحث العلمي إرشاد ومراجعة وتدريس. يساعدك المستشار على تحسين عملك، ويبقى البحث والكتابة من إنجازك.' },
      { qEn: 'Can I get a live session?', qAr: 'هل يمكنني الحصول على جلسة مباشرة؟', aEn: 'Yes. The Premium package includes a live consultation to discuss feedback and next steps.', aAr: 'نعم. تتضمن الباقة المميزة جلسة استشارية مباشرة لمناقشة الملاحظات والخطوات التالية.' },
      INTEGRITY_FAQ, ORDER_FAQ,
    ],
    packages: [
      pkg(0, 'Focused review of a short section (up to 1,500 words).', 'مراجعة مركّزة لجزء قصير (حتى 1,500 كلمة).', ['Up to 1,500 words', 'Written feedback'], ['حتى 1,500 كلمة', 'ملاحظات مكتوبة']),
      pkg(1, 'In-depth review of a chapter (up to 5,000 words).', 'مراجعة معمقة لفصل (حتى 5,000 كلمة).', ['Up to 5,000 words', 'Inline comments', 'Feedback report', 'Suggested sources'], ['حتى 5,000 كلمة', 'تعليقات داخل النص', 'تقرير ملاحظات', 'مصادر مقترحة']),
      pkg(2, 'Comprehensive guidance with a live consultation.', 'إرشاد شامل مع جلسة استشارية مباشرة.', ['Up to 12,000 words', 'Everything in Standard', '60-minute live consultation', 'Follow-up review'], ['حتى 12,000 كلمة', 'كل ما في القياسية', 'جلسة استشارية 60 دقيقة', 'مراجعة متابعة']),
    ],
  },

  // ───────────────────────── Graduation Projects ─────────────────────────
  'graduation-projects': {
    prices: [45, 110, 220], days: [5, 10, 18], revisions: [1, 2, 3],
    overviewEn: 'The {name} service supports you through one of the most important milestones of your degree. Your mentor works alongside you — clarifying scope, guiding technical decisions, helping you build and test, and preparing you to present and defend your project with confidence.',
    overviewAr: 'تدعمك خدمة {name} في واحدة من أهم محطات دراستك الجامعية. يعمل المرشد إلى جانبك، فيوضح نطاق المشروع ويوجه قراراتك التقنية ويساعدك في البناء والاختبار ويجهزك لعرض مشروعك ومناقشته بثقة.',
    includedEn: ['Scope and requirements review', 'Technical guidance and mentoring', 'Hands-on development assistance', 'Preparation for presentation and defense'],
    includedAr: ['مراجعة النطاق والمتطلبات', 'إرشاد تقني ومتابعة', 'مساعدة عملية في التطوير', 'التحضير للعرض والمناقشة'],
    featuresEn: ['Milestone-based delivery', 'Regular progress updates', 'Explanations so you can defend every part', 'Experienced graduation-project mentors'],
    featuresAr: ['تسليم على مراحل', 'تحديثات منتظمة للتقدم', 'شروح تمكّنك من الدفاع عن كل جزء', 'مرشدون ذوو خبرة في مشاريع التخرج'],
    requirementsEn: ['Project title, idea or approved proposal', 'Supervisor requirements and university template', 'Technology constraints', 'Key milestone and defense dates'],
    requirementsAr: ['عنوان المشروع أو فكرته أو المقترح المعتمد', 'متطلبات المشرف ونموذج الجامعة', 'القيود التقنية', 'مواعيد المراحل الرئيسية والمناقشة'],
    deliverablesEn: ['Milestone deliverables agreed in your order', 'Source files and/or documents', 'Explanation notes for your defense'],
    deliverablesAr: ['مخرجات المراحل المتفق عليها في طلبك', 'الملفات المصدرية و/أو الوثائق', 'ملاحظات شرح للمناقشة'],
    faq: [
      { qEn: 'Can the work be split into milestones?', qAr: 'هل يمكن تقسيم العمل إلى مراحل؟', aEn: 'Yes. Graduation project orders are organised into milestones so you can review progress and stay aligned with your supervisor.', aAr: 'نعم. تُنظَّم طلبات مشاريع التخرج على مراحل لتتمكن من مراجعة التقدم والبقاء متوافقًا مع مشرفك.' },
      { qEn: 'Will I be able to explain the project at my defense?', qAr: 'هل سأتمكن من شرح المشروع في المناقشة؟', aEn: 'That is the goal. Every package includes explanations, and Premium adds a mock defense session.', aAr: 'هذا هو الهدف. تتضمن كل باقة شروحًا، وتضيف الباقة المميزة جلسة مناقشة تجريبية.' },
      INTEGRITY_FAQ, ORDER_FAQ,
    ],
    packages: [
      pkg(0, 'Guidance and review for one project stage.', 'إرشاد ومراجعة لمرحلة واحدة من المشروع.', ['1 project stage', 'Written feedback', '1 follow-up'], ['مرحلة واحدة', 'ملاحظات مكتوبة', 'متابعة واحدة']),
      pkg(1, 'Support across several stages with development assistance.', 'دعم عبر عدة مراحل مع مساعدة في التطوير.', ['Up to 3 stages', 'Development assistance', 'Progress meetings', 'Explanation notes'], ['حتى 3 مراحل', 'مساعدة في التطوير', 'اجتماعات متابعة', 'ملاحظات شرح']),
      pkg(2, 'End-to-end mentoring through to your defense.', 'إرشاد متكامل حتى يوم المناقشة.', ['Full project lifecycle', 'Everything in Standard', 'Mock defense session', 'Priority support'], ['دورة المشروع كاملة', 'كل ما في القياسية', 'جلسة مناقشة تجريبية', 'دعم ذو أولوية']),
    ],
  },

  // ───────────────────────── Reports & Documentation ─────────────────────────
  reports: {
    prices: [20, 45, 85], days: [3, 5, 8], revisions: [1, 2, 3],
    overviewEn: 'The {name} service turns your work, data and findings into clear, professional documents. Your provider structures the content, applies the required template and formatting, improves clarity, and makes sure figures, tables and references are consistent.',
    overviewAr: 'تحوّل خدمة {name} عملك وبياناتك ونتائجك إلى وثائق واضحة واحترافية. ينظّم المزود المحتوى، ويطبّق القالب والتنسيق المطلوبين، ويحسّن الوضوح، ويتأكد من اتساق الأشكال والجداول والمراجع.',
    includedEn: ['Structure and outline review', 'Template and formatting', 'Clarity and language improvements', 'Figures, tables and references consistency'],
    includedAr: ['مراجعة الهيكل والمخطط العام', 'تطبيق القالب والتنسيق', 'تحسين الوضوح واللغة', 'اتساق الأشكال والجداول والمراجع'],
    featuresEn: ['Follows your university or company template', 'Professional visual layout', 'Arabic and English documents', 'Editable source files'],
    featuresAr: ['يلتزم بقالب الجامعة أو الجهة', 'تصميم مرئي احترافي', 'وثائق بالعربية والإنجليزية', 'ملفات مصدرية قابلة للتعديل'],
    requirementsEn: ['Your content, notes, data or draft', 'Required template and guidelines', 'Target audience and length', 'Citation style, if needed'],
    requirementsAr: ['المحتوى أو الملاحظات أو البيانات أو المسودة', 'القالب والإرشادات المطلوبة', 'الجمهور المستهدف والطول', 'نمط التوثيق عند الحاجة'],
    deliverablesEn: ['Editable document (Word, PowerPoint, Excel or Power BI)', 'PDF version', 'Summary of changes'],
    deliverablesAr: ['مستند قابل للتعديل (Word أو PowerPoint أو Excel أو Power BI)', 'نسخة PDF', 'ملخص بالتعديلات'],
    faq: [
      { qEn: 'Can you work in Arabic?', qAr: 'هل يمكن العمل باللغة العربية؟', aEn: 'Yes. Providers work in Arabic, English or bilingual documents, with correct right-to-left formatting.', aAr: 'نعم. يعمل المزودون على وثائق عربية أو إنجليزية أو ثنائية اللغة مع تنسيق صحيح من اليمين إلى اليسار.' },
      { qEn: 'Do I get editable files?', qAr: 'هل أحصل على ملفات قابلة للتعديل؟', aEn: 'Always. You receive the editable source plus a PDF.', aAr: 'دائمًا. تستلم الملف المصدري القابل للتعديل مع نسخة PDF.' },
      REVISION_FAQ, INTEGRITY_FAQ,
    ],
    packages: [
      pkg(0, 'Formatting and polish for a short document (up to 10 pages).', 'تنسيق وتحسين لمستند قصير (حتى 10 صفحات).', ['Up to 10 pages / 10 slides', 'Template applied', 'PDF export'], ['حتى 10 صفحات أو شرائح', 'تطبيق القالب', 'تصدير PDF']),
      pkg(1, 'Full structuring and editing (up to 30 pages).', 'هيكلة وتحرير كامل (حتى 30 صفحة).', ['Up to 30 pages / 20 slides', 'Structure and language edit', 'Figures and tables', 'Table of contents'], ['حتى 30 صفحة أو 20 شريحة', 'تحرير الهيكل واللغة', 'الأشكال والجداول', 'فهرس المحتويات']),
      pkg(2, 'Comprehensive document package with visuals.', 'حزمة وثائق شاملة مع العناصر المرئية.', ['Up to 60 pages / 35 slides', 'Everything in Standard', 'Custom diagrams and visuals', 'Priority delivery'], ['حتى 60 صفحة أو 35 شريحة', 'كل ما في القياسية', 'مخططات وعناصر مرئية مخصصة', 'تسليم ذو أولوية']),
    ],
  },

  // ───────────────────────── Tutoring ─────────────────────────
  tutoring: {
    prices: [12, 32, 55], days: [1, 2, 3], revisions: [0, 0, 1],
    overviewEn: '{name} gives you one-to-one sessions with tutors who know your courses. Sessions adapt to your level and pace, focus on understanding rather than memorising, and leave you with notes and practice you can use on your own.',
    overviewAr: 'تقدم لك خدمة {name} جلسات فردية مع مدرسين يعرفون مقرراتك جيدًا. تتكيف الجلسات مع مستواك وسرعتك، وتركز على الفهم بدل الحفظ، وتترك لك ملاحظات وتمارين تستخدمها بنفسك.',
    includedEn: ['Level check and session plan', 'Live online session', 'Worked examples and practice', 'Session notes'],
    includedAr: ['تقييم المستوى وخطة الجلسة', 'جلسة مباشرة عبر الإنترنت', 'أمثلة محلولة وتمارين', 'ملاحظات الجلسة'],
    featuresEn: ['Arabic or English', 'Flexible scheduling', 'Course-aligned explanations', 'Practice to keep after the session'],
    featuresAr: ['بالعربية أو الإنجليزية', 'مواعيد مرنة', 'شرح متوافق مع المقرر', 'تمارين تبقى معك بعد الجلسة'],
    requirementsEn: ['Course name and topics', 'Your current level and goals', 'Preferred times', 'Slides or materials, if available'],
    requirementsAr: ['اسم المقرر والمواضيع', 'مستواك الحالي وأهدافك', 'الأوقات المفضلة', 'الشرائح أو المواد إن توفرت'],
    deliverablesEn: ['Live session (meeting link)', 'Session notes', 'Practice exercises'],
    deliverablesAr: ['جلسة مباشرة (رابط اجتماع)', 'ملاحظات الجلسة', 'تمارين تدريبية'],
    faq: [
      { qEn: 'How are sessions held?', qAr: 'كيف تُعقد الجلسات؟', aEn: 'Online through a meeting link we send you on WhatsApp. You agree the time with your tutor when you contact us.', aAr: 'عبر الإنترنت من خلال رابط اجتماع نرسله لك عبر واتساب، وتتفق على الموعد مع المدرس عند تواصلك معنا.' },
      { qEn: 'Can tutors help during an exam?', qAr: 'هل يمكن للمدرس المساعدة أثناء الامتحان؟', aEn: 'No. Tutoring is for learning and preparation only. Exam-taking or live help during assessments is not allowed on Naajah.', aAr: 'لا. الدروس للتعلم والتحضير فقط، ولا يُسمح على منصة نجاح بتقديم الامتحانات أو المساعدة المباشرة أثناء التقييم.' },
      { qEn: 'Can I reschedule?', qAr: 'هل يمكنني تغيير موعد الجلسة؟', aEn: 'Yes, by agreement with your tutor at least 12 hours before the session.', aAr: 'نعم، بالاتفاق مع المدرس قبل 12 ساعة على الأقل من موعد الجلسة.' },
      ORDER_FAQ,
    ],
    packages: [
      pkg(0, 'One 60-minute session.', 'جلسة واحدة مدتها 60 دقيقة.', ['1 × 60-min session', 'Session notes'], ['جلسة واحدة 60 دقيقة', 'ملاحظات الجلسة']),
      pkg(1, 'Three sessions to master a topic.', 'ثلاث جلسات لإتقان موضوع.', ['3 × 60-min sessions', 'Notes and practice', 'Chat support between sessions'], ['3 جلسات × 60 دقيقة', 'ملاحظات وتمارين', 'دعم عبر المحادثة بين الجلسات']),
      pkg(2, 'Six sessions for full course or exam preparation.', 'ست جلسات للتحضير الكامل للمقرر أو الامتحان.', ['6 × 60-min sessions', 'Personal study plan', 'Practice tests', 'Priority scheduling'], ['6 جلسات × 60 دقيقة', 'خطة دراسة شخصية', 'اختبارات تدريبية', 'أولوية في المواعيد']),
    ],
  },

};
