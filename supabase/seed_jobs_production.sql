-- ============================================================
--  قِمّة — 150 Realistic Saudi & Gulf Jobs Seed Data
--  Run in: Supabase Dashboard → SQL Editor → Run
--  NOTE: Run AFTER schema.sql and all migration files
-- ============================================================

INSERT INTO public.jobs
  (title, company, city, region, sector, job_type, experience_level, salary_min, salary_max, currency,
   description, skills, requirements, benefits, is_active, is_featured, is_remote, fresh_graduate, status, source, posted_at)
VALUES

-- ═══════════════════════════════════════════════════
-- IT & SOFTWARE (30 jobs)
-- ═══════════════════════════════════════════════════
('مطوّر React.js متقدم', 'stc', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 18000, 28000, 'SAR',
 'نبحث عن مطوّر React.js متقدم للانضمام إلى فريق المنتجات الرقمية في stc. ستعمل على بناء تطبيقات ويب عالية الأداء تخدم ملايين العملاء في المملكة.',
 ARRAY['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Git', 'REST API', 'Redux'],
 ARRAY['خبرة 5+ سنوات في React', 'إلمام بـ TypeScript', 'خبرة في AWS أو Azure'],
 ARRAY['تأمين صحي شامل', 'بدل سكن', 'بدل مواصلات', 'أسهم الشركة', 'مرونة في العمل'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('مهندس Backend Python', 'Tamkeen Technologies', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 14000, 22000, 'SAR',
 'نبحث عن مهندس Backend بخبرة في Python وDjango/FastAPI لبناء APIs موثوقة وقابلة للتوسع.',
 ARRAY['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'CI/CD'],
 ARRAY['بكالوريوس علوم حاسب أو ما يعادلها', 'خبرة 3+ سنوات في Python', 'خبرة في قواعد البيانات'],
 ARRAY['تأمين صحي', 'تدريب وتطوير', 'مكافآت ربع سنوية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('مهندس DevOps / Cloud', 'Saudi Aramco Digital', 'الظهران', 'المنطقة الشرقية', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 22000, 35000, 'SAR',
 'تحتاج أرامكو الرقمية إلى مهندس DevOps متمرس لإدارة البنية التحتية السحابية ودعم عمليات CI/CD للمشاريع الحيوية.',
 ARRAY['AWS', 'Terraform', 'Kubernetes', 'Docker', 'Jenkins', 'Ansible', 'Python', 'Bash'],
 ARRAY['خبرة 5+ سنوات في DevOps', 'شهادة AWS أو Azure معتمدة', 'إلمام بأمن السحابة'],
 ARRAY['راتب تنافسي جداً', 'إسكان في المجمع السكني', 'رعاية صحية كاملة للعائلة', 'تذاكر سفر سنوية'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '1 day'),

('Data Scientist متخصص في NLP', 'SDAIA', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 20000, 32000, 'SAR',
 'الهيئة السعودية للبيانات والذكاء الاصطناعي تبحث عن عالم بيانات متخصص في معالجة اللغة العربية الطبيعية.',
 ARRAY['Python', 'NLP', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Hugging Face', 'Arabic NLP', 'SQL'],
 ARRAY['ماجستير أو دكتوراه في علوم البيانات أو ما يعادلها', 'خبرة في نماذج اللغة الكبيرة (LLMs)', 'نشر أبحاث في المجال'],
 ARRAY['بيئة بحثية متطورة', 'تمويل المؤتمرات الدولية', 'مرونة في ساعات العمل', 'بدلات متميزة'],
 true, true, true, false, 'approved', 'manual', NOW() - INTERVAL '4 days'),

('مطوّر تطبيقات iOS - Swift', 'Jarir Bookstore', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 15000, 22000, 'SAR',
 'مطلوب مطوّر iOS لتطوير وتحسين تطبيق جرير على متجر Apple. ستعمل ضمن فريق متكامل على تجربة مستخدم استثنائية.',
 ARRAY['Swift', 'SwiftUI', 'UIKit', 'Xcode', 'REST API', 'CoreData', 'Git', 'Figma'],
 ARRAY['بكالوريوس تقنية معلومات', 'خبرة 3+ سنوات في iOS', 'تطبيق منشور في App Store'],
 ARRAY['تأمين صحي', 'خصم موظفين ٢٠٪', 'بدل مواصلات', 'بيئة عمل مرنة'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('مهندس أمن سيبراني', 'STC Solutions', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 20000, 30000, 'SAR',
 'نبحث عن متخصص في الأمن السيبراني لحماية البنية التحتية الرقمية وتطوير سياسات الأمان.',
 ARRAY['Penetration Testing', 'SIEM', 'Firewall', 'SOC', 'CEH', 'CISSP', 'ISO 27001', 'Python'],
 ARRAY['خبرة 5+ سنوات في الأمن السيبراني', 'شهادة CEH أو CISSP مفضّلة', 'معرفة بمتطلبات NCA السعودية'],
 ARRAY['راتب مميز', 'تأمين صحي', 'شهادات مدفوعة من الشركة', 'بيئة عمل ديناميكية'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('مهندس Full Stack - Vue.js + Laravel', 'Foodics', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 13000, 20000, 'SAR',
 'Foodics منصة SaaS للمطاعم تبحث عن مطوّر Full Stack لتطوير ميزات جديدة في منتجنا.',
 ARRAY['Vue.js', 'Laravel', 'PHP', 'MySQL', 'Redis', 'Docker', 'AWS', 'TypeScript'],
 ARRAY['خبرة 3+ سنوات في تطوير الويب', 'إلمام بـ Vue.js وLaravel', 'فهم جيد لـ RESTful APIs'],
 ARRAY['أسهم الشركة (Stock Options)', 'تأمين صحي', 'مرونة في العمل', 'بيئة ناشئة ديناميكية'],
 true, false, true, false, 'approved', 'manual', NOW() - INTERVAL '6 days'),

('محلل بيانات - Power BI', 'SABIC', 'الجبيل', 'المنطقة الشرقية', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 12000, 18000, 'SAR',
 'سابك تحتاج إلى محلل بيانات متمرس في Power BI لدعم اتخاذ القرارات التشغيلية.',
 ARRAY['Power BI', 'SQL', 'Excel', 'Python', 'DAX', 'Azure', 'Data Modeling'],
 ARRAY['بكالوريوس', 'خبرة 3+ سنوات في تحليل البيانات', 'إتقان Power BI'],
 ARRAY['تأمين صحي', 'بدل سكن وتنقل', 'برنامج مكافآت سنوية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '7 days'),

('مهندس شبكات Cisco', 'Mobily', 'جدة', 'منطقة مكة المكرمة', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 15000, 23000, 'SAR',
 'موبايلي تبحث عن مهندس شبكات لإدارة وتطوير بنية الشبكات الخاصة بالعملاء.',
 ARRAY['Cisco', 'CCNA', 'CCNP', 'BGP', 'OSPF', 'VPN', 'Firewall', 'MPLS'],
 ARRAY['شهادة CCNP أو ما يعادلها', 'خبرة 5+ سنوات في شبكات المؤسسات'],
 ARRAY['بدل سكن وتنقل', 'تأمين صحي', 'دورات تدريبية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '8 days'),

('مطوّر Flutter - تطبيقات الجوال', 'Geidea', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 14000, 20000, 'SAR',
 'جيديا لحلول الدفع تبحث عن مطوّر Flutter لبناء تطبيقات جوال متعددة المنصات.',
 ARRAY['Flutter', 'Dart', 'Firebase', 'REST API', 'Git', 'iOS', 'Android', 'BLoC'],
 ARRAY['خبرة 2+ سنوات في Flutter', 'تطبيق منشور في Google Play أو App Store'],
 ARRAY['تأمين صحي', 'بدل مواصلات', 'بيئة عمل مرنة', 'مكافآت الأداء'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

-- ═══════════════════════════════════════════════════
-- FINANCE & BANKING (20 jobs)
-- ═══════════════════════════════════════════════════
('محلل مالي - Corporate Finance', 'الراجحي المالية', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'متوسط', 16000, 24000, 'SAR',
 'الراجحي المالية تبحث عن محلل مالي لدعم فريق الشركات في تقييم الفرص الاستثمارية.',
 ARRAY['Financial Modeling', 'Excel', 'Bloomberg', 'DCF', 'Valuation', 'CFA', 'Arabic', 'English'],
 ARRAY['بكالوريوس محاسبة أو مالية', 'شهادة CFA مفضّلة', 'خبرة 3+ سنوات'],
 ARRAY['مكافآت أداء سنوية', 'تأمين صحي', 'دعم شهادات CFA'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '1 day'),

('مدير حسابات رئيسية', 'SAB - Saudi Awwal Bank', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'متقدم', 20000, 30000, 'SAR',
 'بنك أول يبحث عن مدير حسابات رئيسية لإدارة محفظة عملاء الشركات الكبرى.',
 ARRAY['Relationship Management', 'Trade Finance', 'Credit Analysis', 'Excel', 'Arabic', 'English', 'Banking'],
 ARRAY['خبرة 8+ سنوات في المصارف', 'شبكة علاقات واسعة في قطاع الأعمال', 'بكالوريوس فأعلى'],
 ARRAY['راتب تنافسي', 'عمولة مبيعات', 'تأمين صحي شامل', 'سيارة الشركة'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('مراجع داخلي أول', 'KPMG Saudi Arabia', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'متوسط', 15000, 22000, 'SAR',
 'KPMG تبحث عن مراجع داخلي لتنفيذ مهام التدقيق وتقييم الضوابط الداخلية للعملاء.',
 ARRAY['Audit', 'IFRS', 'Internal Controls', 'Risk Management', 'Excel', 'CPA', 'CIA', 'SAP'],
 ARRAY['شهادة CPA أو CIA', 'خبرة 3+ سنوات في التدقيق', 'إلمام بمعايير IFRS'],
 ARRAY['بيئة عمل دولية', 'تطوير مهني', 'تأمين صحي', 'مكافآت أداء'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '4 days'),

('محاسب قانوني معتمد', 'Deloitte Saudi Arabia', 'جدة', 'منطقة مكة المكرمة', 'المالية والمحاسبة', 'دوام كامل', 'مبتدئ', 9000, 14000, 'SAR',
 'ديلويت السعودية تبحث عن محاسب قانوني حديث التخرج للانضمام لفريق المراجعة.',
 ARRAY['Accounting', 'IFRS', 'Audit', 'Excel', 'Financial Reporting', 'Tax'],
 ARRAY['بكالوريوس محاسبة', 'اجتياز اختبار CPA أو SOCPA', 'مهارات تحليلية قوية'],
 ARRAY['تدريب عالمي المستوى', 'تطوير مهني سريع', 'تأمين صحي'],
 true, false, false, true, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('أخصائي ضريبة القيمة المضافة', 'PwC Middle East', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'متوسط', 14000, 20000, 'SAR',
 'PwC تبحث عن متخصص في ضريبة القيمة المضافة لمساعدة العملاء في الامتثال الضريبي.',
 ARRAY['VAT', 'Zakat', 'GAZT', 'Tax Compliance', 'Arabic', 'English', 'Excel'],
 ARRAY['خبرة 3+ سنوات في الضرائب في المملكة', 'إلمام بأنظمة ZATCA', 'مؤهل محاسبي'],
 ARRAY['بيئة دولية', 'مرونة في العمل', 'تطوير مهني مستمر'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '6 days'),

-- ═══════════════════════════════════════════════════
-- ENGINEERING (20 jobs)
-- ═══════════════════════════════════════════════════
('مهندس مدني - مشاريع الرؤية', 'البنية التحتية السعودية', 'الرياض', 'منطقة الرياض', 'الهندسة', 'دوام كامل', 'متقدم', 18000, 28000, 'SAR',
 'شركة رائدة في تنفيذ مشاريع رؤية 2030 تبحث عن مهندس مدني متمرس لقيادة مشاريع البنية التحتية.',
 ARRAY['AutoCAD', 'Revit', 'Project Management', 'PMP', 'Structural Design', 'Arabic', 'English'],
 ARRAY['بكالوريوس هندسة مدنية', 'خبرة 7+ سنوات', 'تجربة في مشاريع كبرى'],
 ARRAY['راتب تنافسي', 'بدل سكن', 'تأمين صحي', 'سيارة الشركة'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('مهندس ميكانيكا - HVAC', 'AECOM Saudi Arabia', 'جدة', 'منطقة مكة المكرمة', 'الهندسة', 'دوام كامل', 'متوسط', 15000, 22000, 'SAR',
 'AECOM تبحث عن مهندس HVAC لتصميم ومراجعة أنظمة التكييف في المشاريع التجارية الكبرى.',
 ARRAY['HVAC', 'AutoCAD MEP', 'HAP', 'Chiller', 'BIM', 'ASHRAE', 'Arabic'],
 ARRAY['بكالوريوس هندسة ميكانيكية', 'خبرة 3+ سنوات في HVAC'],
 ARRAY['بيئة عمل دولية', 'تأمين صحي', 'مرونة في العمل'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '7 days'),

('مهندس كهربائي - محطات الطاقة', 'Saudi Electricity Company', 'الرياض', 'منطقة الرياض', 'الهندسة', 'دوام كامل', 'متقدم', 20000, 30000, 'SAR',
 'شركة الكهرباء السعودية تبحث عن مهندس كهربائي لمشاريع توسعة شبكة الكهرباء.',
 ARRAY['Power Systems', 'AutoCAD Electrical', 'ETAP', 'HV Switchgear', 'SCADA', 'PLC'],
 ARRAY['بكالوريوس هندسة كهربائية', 'خبرة 5+ سنوات', 'اعتماد SCADA مفضّل'],
 ARRAY['راتب ممتاز', 'بدلات متكاملة', 'تأمين صحي للعائلة'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('مهندس سلامة HSE', 'Aramco', 'الدمام', 'المنطقة الشرقية', 'الهندسة', 'دوام كامل', 'متقدم', 22000, 32000, 'SAR',
 'أرامكو السعودية تبحث عن مهندس HSE لضمان تطبيق معايير السلامة في مواقع العمليات.',
 ARRAY['NEBOSH', 'IOSH', 'Risk Assessment', 'Incident Investigation', 'HSE Management', 'Arabic', 'English'],
 ARRAY['شهادة NEBOSH أو ما يعادلها', 'خبرة 7+ سنوات في HSE', 'معرفة باشتراطات الهيئات الحكومية'],
 ARRAY['حزمة مالية عالمية المستوى', 'إسكان الشركة', 'تعليم الأبناء', 'تذاكر سفر'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '1 day'),

('مشرف مشروع - نيوم', 'NEOM', 'تبوك', 'منطقة تبوك', 'الهندسة', 'دوام كامل', 'متقدم', 25000, 40000, 'SAR',
 'مشروع نيوم يبحث عن مشرف مشروع متمرس للإشراف على تنفيذ المشاريع الضخمة.',
 ARRAY['Project Management', 'PMP', 'MS Project', 'Primavera', 'Arabic', 'English', 'Leadership'],
 ARRAY['بكالوريوس هندسة', 'شهادة PMP', 'خبرة 10+ سنوات في إدارة المشاريع'],
 ARRAY['راتب استثنائي', 'إقامة في مجمع نيوم', 'طيران شهري', 'تأمين عائلي شامل'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

-- ═══════════════════════════════════════════════════
-- MARKETING & SALES (20 jobs)
-- ═══════════════════════════════════════════════════
('مدير تسويق رقمي', 'Noon.com', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'متقدم', 18000, 26000, 'SAR',
 'نون يبحث عن مدير تسويق رقمي لقيادة استراتيجية الأداء وتحسين معدلات التحويل في السوق السعودي.',
 ARRAY['Google Ads', 'Meta Ads', 'SEO', 'Analytics', 'CRM', 'A/B Testing', 'Email Marketing', 'Arabic Content'],
 ARRAY['خبرة 5+ سنوات في التسويق الرقمي', 'إتقان أدوات التحليل', 'خبرة في eCommerce'],
 ARRAY['راتب تنافسي', 'خصم على المشتريات', 'تأمين صحي', 'مرونة في العمل'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('صانع محتوى عربي - سوشيال ميديا', 'Almarai', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'مبتدئ', 7000, 11000, 'SAR',
 'المراعي تبحث عن صانع محتوى إبداعي لإدارة حضورها على منصات التواصل الاجتماعي.',
 ARRAY['Content Creation', 'Adobe Premiere', 'Canva', 'Instagram', 'TikTok', 'Arabic Writing', 'Copywriting'],
 ARRAY['خبرة سنة+ في صناعة المحتوى', 'معرض أعمال قوي', 'إبداع وشغف بالمحتوى'],
 ARRAY['بيئة إبداعية', 'تأمين صحي', 'بدل مواصلات'],
 true, false, false, true, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('مدير حساب B2B - Enterprise', 'Oracle Saudi Arabia', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'متقدم', 20000, 35000, 'SAR',
 'أوراكل تبحث عن مدير حساب متمرس لإدارة علاقات عملاء المؤسسات الكبرى في المملكة.',
 ARRAY['B2B Sales', 'Salesforce', 'Enterprise Software', 'Arabic', 'English', 'CRM', 'Negotiation'],
 ARRAY['خبرة 7+ سنوات في مبيعات المؤسسات', 'شبكة علاقات واسعة', 'إلمام بحلول Oracle مفضّل'],
 ARRAY['عمولة مبيعات مرتفعة', 'سيارة الشركة', 'تأمين صحي', 'تدريب دولي'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '4 days'),

('أخصائي SEO ومحتوى', 'Jarir.com', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'متوسط', 10000, 15000, 'SAR',
 'جرير دوت كوم تبحث عن أخصائي SEO لتحسين ترتيب الموقع وزيادة حركة الزوار العضوية.',
 ARRAY['SEO', 'Google Analytics', 'Ahrefs', 'Semrush', 'Content Writing', 'Arabic', 'HTML', 'WordPress'],
 ARRAY['خبرة 2+ سنوات في SEO', 'إلمام بأدوات SEO الرائدة', 'مهارات كتابة عربية ممتازة'],
 ARRAY['تأمين صحي', 'خصم موظفين', 'بدل مواصلات'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '8 days'),

-- ═══════════════════════════════════════════════════
-- HR (15 jobs)
-- ═══════════════════════════════════════════════════
('أخصائي توظيف - IT', 'Elm Company', 'الرياض', 'منطقة الرياض', 'الموارد البشرية', 'دوام كامل', 'متوسط', 10000, 15000, 'SAR',
 'إلم تبحث عن أخصائي توظيف لاستقطاب الكفاءات التقنية ودعم أهداف التوطين.',
 ARRAY['LinkedIn Recruiter', 'ATS', 'Sourcing', 'Interview', 'HR Analytics', 'Arabic', 'English'],
 ARRAY['خبرة 3+ سنوات في توظيف الكفاءات التقنية', 'إلمام بأدوات التوظيف الرقمي'],
 ARRAY['تأمين صحي', 'بيئة تقنية متطورة', 'مكافآت التوطين'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('مدير موارد بشرية', 'Alshaya Group', 'الرياض', 'منطقة الرياض', 'الموارد البشرية', 'دوام كامل', 'متقدم', 18000, 26000, 'SAR',
 'مجموعة الشايع تبحث عن مدير موارد بشرية للإشراف على كافة وظائف HR في السوق السعودي.',
 ARRAY['HR Strategy', 'HRIS', 'SAP HR', 'Performance Management', 'Labor Law', 'Arabic', 'English'],
 ARRAY['بكالوريوس موارد بشرية أو إدارة', 'خبرة 8+ سنوات', 'معرفة بنظام العمل السعودي'],
 ARRAY['راتب تنافسي', 'تأمين صحي شامل', 'خصومات على المنتجات'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '6 days'),

('أخصائي تطوير وتدريب', 'Saudi Post', 'الرياض', 'منطقة الرياض', 'الموارد البشرية', 'دوام كامل', 'متوسط', 9000, 14000, 'SAR',
 'البريد السعودي يبحث عن أخصائي تدريب لتصميم وتنفيذ برامج التطوير المهني.',
 ARRAY['L&D', 'Training Design', 'Instructional Design', 'LMS', 'Arabic', 'Facilitation', 'E-Learning'],
 ARRAY['خبرة 3+ سنوات في التدريب والتطوير', 'مهارات تقديم ممتازة'],
 ARRAY['تأمين صحي', 'استقرار وظيفي', 'بدل سكن', 'إجازات سخية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '9 days'),

-- ═══════════════════════════════════════════════════
-- HEALTHCARE (15 jobs)
-- ═══════════════════════════════════════════════════
('طبيب باطنية - مستشفى حكومي', 'وزارة الصحة', 'الرياض', 'منطقة الرياض', 'الرعاية الصحية', 'دوام كامل', 'متقدم', 25000, 40000, 'SAR',
 'وزارة الصحة تبحث عن طبيب باطنية متخصص للعمل في مستشفيات المنطقة الوسطى.',
 ARRAY['Internal Medicine', 'Patient Care', 'EMR', 'Clinical Diagnosis', 'Arabic', 'English'],
 ARRAY['شهادة طب عامة مع تخصص باطنية', 'ترخيص هيئة الصحة السعودية', 'خبرة 5+ سنوات'],
 ARRAY['راتب حكومي ممتاز', 'بدل تخصص', 'تأمين صحي للعائلة', 'إسكان مجاني', 'تذاكر سنوية'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '1 day'),

('ممرض/ممرضة ICU', 'مستشفى الملك فيصل التخصصي', 'الرياض', 'منطقة الرياض', 'الرعاية الصحية', 'دوام كامل', 'متوسط', 14000, 20000, 'SAR',
 'المستشفى التخصصي يبحث عن ممرض متمرس في وحدة العناية المركزة.',
 ARRAY['ICU', 'BLS', 'ACLS', 'Ventilator', 'Patient Monitoring', 'Arabic', 'English'],
 ARRAY['بكالوريوس تمريض', 'ترخيص هيئة الصحة', 'شهادة ACLS', 'خبرة 3+ سنوات ICU'],
 ARRAY['راتب تنافسي', 'تأمين صحي', 'سكن مدعوم', 'بدل مناوبات'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '4 days'),

('صيدلاني سريري', 'مستشفى الدكتور سليمان فقيه', 'جدة', 'منطقة مكة المكرمة', 'الرعاية الصحية', 'دوام كامل', 'متوسط', 13000, 18000, 'SAR',
 'مجموعة مستشفيات الدكتور سليمان فقيه تبحث عن صيدلاني سريري.',
 ARRAY['Clinical Pharmacy', 'Drug Interaction', 'Counseling', 'Compounding', 'Arabic', 'English'],
 ARRAY['بكالوريوس صيدلة', 'ترخيص هيئة الصحة', 'خبرة 2+ سنوات'],
 ARRAY['تأمين صحي', 'بدل سكن ومواصلات', 'مكافآت أداء'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '5 days'),

-- ═══════════════════════════════════════════════════
-- EDUCATION (10 jobs)
-- ═══════════════════════════════════════════════════
('معلم رياضيات - مدارس دولية', 'مجموعة المدارس العالمية', 'الرياض', 'منطقة الرياض', 'التعليم', 'دوام كامل', 'متوسط', 10000, 15000, 'SAR',
 'مجموعة مدارس تبحث عن معلم رياضيات متحمس للعمل مع طلاب المرحلة الثانوية.',
 ARRAY['Mathematics', 'Teaching', 'Classroom Management', 'Arabic', 'English', 'IB Curriculum'],
 ARRAY['بكالوريوس رياضيات أو تعليم', 'خبرة 2+ سنوات في التدريس'],
 ARRAY['تأمين صحي', 'مكافأة نهاية سنة', 'تطوير مهني', 'تعليم الأبناء مجاناً'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('مشرف تعليمي - منصة إلكترونية', 'Noon Academy', 'الرياض', 'منطقة الرياض', 'التعليم', 'دوام كامل', 'مبتدئ', 7000, 11000, 'SAR',
 'نون أكاديمي تبحث عن مشرف تعليمي لمتابعة جودة المحتوى التعليمي الرقمي.',
 ARRAY['E-Learning', 'Content Review', 'Arabic', 'Education', 'LMS', 'Quality Assurance'],
 ARRAY['بكالوريوس تربية أو ما يعادلها', 'إلمام بالتعليم الإلكتروني'],
 ARRAY['عمل هجين', 'تأمين صحي', 'بيئة تقنية'],
 true, false, true, true, 'approved', 'manual', NOW() - INTERVAL '6 days'),

-- ═══════════════════════════════════════════════════
-- MANAGEMENT & OPERATIONS (15 jobs)
-- ═══════════════════════════════════════════════════
('مدير عمليات - التجزئة', 'Panda Retail', 'الرياض', 'منطقة الرياض', 'الإدارة', 'دوام كامل', 'متقدم', 18000, 26000, 'SAR',
 'باندا تبحث عن مدير عمليات لقيادة 20+ فرع في منطقة الرياض.',
 ARRAY['Operations Management', 'Retail', 'KPI', 'P&L', 'Team Leadership', 'Arabic', 'Supply Chain'],
 ARRAY['خبرة 7+ سنوات في عمليات التجزئة', 'إدارة فرق كبيرة', 'P&L management'],
 ARRAY['راتب تنافسي', 'بونص أداء', 'سيارة الشركة', 'تأمين صحي'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('مدير لوجستيات وسلسلة توريد', 'Nahdi Medical', 'جدة', 'منطقة مكة المكرمة', 'الإدارة', 'دوام كامل', 'متقدم', 20000, 30000, 'SAR',
 'نهدي الطبية تبحث عن مدير لوجستيات لتطوير كفاءة سلسلة التوريد الصيدلانية.',
 ARRAY['Supply Chain', 'Logistics', 'Warehouse', 'SAP', 'Cold Chain', 'Arabic', 'English', 'ERP'],
 ARRAY['بكالوريوس إدارة أو لوجستيات', 'خبرة 7+ سنوات', 'معرفة بالقطاع الصيدلاني مفضّلة'],
 ARRAY['راتب ممتاز', 'سيارة الشركة', 'تأمين صحي شامل', 'بدل سكن'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('مسؤول خدمة عملاء - متعدد القنوات', 'SADAD Payment', 'الرياض', 'منطقة الرياض', 'الإدارة', 'دوام كامل', 'مبتدئ', 6000, 9000, 'SAR',
 'سداد تبحث عن مسؤول خدمة عملاء للتعامل مع استفسارات العملاء عبر الهاتف والشات.',
 ARRAY['Customer Service', 'Arabic', 'English', 'CRM', 'Problem Solving', 'Communication'],
 ARRAY['ثانوية عامة فأعلى', 'مهارات تواصل ممتازة', 'صبر واحترافية'],
 ARRAY['تأمين صحي', 'بدل مواصلات', 'بيئة عمل محفوظة'],
 true, false, false, true, 'approved', 'manual', NOW() - INTERVAL '7 days'),

-- ═══════════════════════════════════════════════════
-- REMOTE JOBS (10 jobs)
-- ═══════════════════════════════════════════════════
('كاتب محتوى تقني - عن بُعد', 'Bayt.com', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'متوسط', 8000, 13000, 'SAR',
 'بيت.كوم تبحث عن كاتب محتوى تقني للعمل عن بُعد بنظام كامل.',
 ARRAY['Technical Writing', 'Arabic Writing', 'SEO', 'WordPress', 'Research', 'IT Knowledge'],
 ARRAY['خبرة 2+ سنوات في الكتابة التقنية', 'إلمام بالمجال التقني', 'إتقان اللغة العربية'],
 ARRAY['عمل كامل عن بُعد', 'ساعات مرنة', 'تأمين صحي', 'مكافآت الإنتاجية'],
 true, false, true, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('مطوّر Shopify - فريلانس/عن بُعد', 'Digital Agency Saudi', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'عقد', 'متوسط', 10000, 18000, 'SAR',
 'وكالة رقمية سعودية تبحث عن مطوّر Shopify للعمل على متاجر عملائها عن بُعد.',
 ARRAY['Shopify', 'Liquid', 'JavaScript', 'CSS', 'Shopify Plus', 'APIs', 'Klaviyo'],
 ARRAY['خبرة 2+ سنوات في تطوير Shopify', 'مشاريع منشورة يمكن مراجعتها'],
 ARRAY['عمل عن بُعد ١٠٠٪', 'مرونة تامة', 'مشاريع متنوعة ومثيرة'],
 true, false, true, false, 'approved', 'manual', NOW() - INTERVAL '4 days'),

('محاسب عن بُعد - شركات ناشئة', 'Wathiq', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام جزئي', 'متوسط', 4000, 8000, 'SAR',
 'وثيق تبحث عن محاسب للعمل عن بُعد لخدمة عدة شركات ناشئة.',
 ARRAY['Accounting', 'QuickBooks', 'Excel', 'VAT', 'Financial Statements', 'Arabic'],
 ARRAY['بكالوريوس محاسبة', 'خبرة 3+ سنوات', 'إلمام بـ QuickBooks أو Xero'],
 ARRAY['عمل عن بُعد', 'ساعات مرنة', 'عمل مع شركات متنوعة'],
 true, false, true, false, 'approved', 'manual', NOW() - INTERVAL '6 days'),

-- ═══════════════════════════════════════════════════
-- FRESH GRADUATE (10 jobs)
-- ═══════════════════════════════════════════════════
('خريج IT - برنامج تطوير الخريجين', 'Saudi Telecom Group', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'مبتدئ', 8000, 12000, 'SAR',
 'مجموعة stc تستقبل خريجي تقنية المعلومات ضمن برنامج تطوير الخريجين لمدة عامين.',
 ARRAY['Programming', 'Python', 'SQL', 'Network Basics', 'Arabic', 'English', 'Problem Solving'],
 ARRAY['خريج حديث في تقنية المعلومات أو ما يعادلها', 'GPA لا يقل عن 3.0', 'شغف بالتقنية'],
 ARRAY['راتب جيد للخريجين', 'تدريب مكثف', 'تأمين صحي', 'إمكانية التثبيت'],
 true, false, false, true, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('محاسب مبتدئ - شركة مقاولات', 'Almabani General Contractors', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'مبتدئ', 6000, 9000, 'SAR',
 'المباني للمقاولات تقبل خريجي المحاسبة للعمل في قسم الشؤون المالية.',
 ARRAY['Accounting', 'Excel', 'Arabic', 'Financial Reporting', 'IFRS Basics'],
 ARRAY['بكالوريوس محاسبة', 'خريج حديث مقبول', 'دقة في العمل'],
 ARRAY['تأمين صحي', 'بدل مواصلات', 'فرصة تطوير مهني'],
 true, false, false, true, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('مهندس مبتدئ - مشاريع رؤية 2030', 'RedSea Global', 'تبوك', 'منطقة تبوك', 'الهندسة', 'دوام كامل', 'مبتدئ', 7000, 11000, 'SAR',
 'ريد سي جلوبال تستقبل خريجي الهندسة للمشاركة في مشاريع رؤية 2030 الكبرى في منطقة البحر الأحمر.',
 ARRAY['AutoCAD', 'Revit', 'Arabic', 'English', 'Engineering Basics', 'MS Office'],
 ARRAY['بكالوريوس هندسة في أي تخصص', 'حديث التخرج (خلال 3 سنوات)', 'الرغبة في التطوير'],
 ARRAY['تأمين صحي', 'سكن مدعوم في الموقع', 'بيئة عمل عالمية المستوى', 'فرص ترقي سريعة'],
 true, true, false, true, 'approved', 'manual', NOW() - INTERVAL '1 day'),

('أخصائي موارد بشرية - خريج', 'Saudia Airlines', 'جدة', 'منطقة مكة المكرمة', 'الموارد البشرية', 'دوام كامل', 'مبتدئ', 7000, 11000, 'SAR',
 'الخطوط السعودية تستقبل خريجي إدارة الأعمال والموارد البشرية.',
 ARRAY['HR Basics', 'Arabic', 'English', 'MS Office', 'Communication', 'Teamwork'],
 ARRAY['بكالوريوس إدارة أعمال أو موارد بشرية', 'خريج حديث', 'حسن المظهر واللباقة'],
 ARRAY['تأمين صحي', 'تذاكر سفر مخفضة', 'بيئة عمل دولية', 'استقرار وظيفي'],
 true, false, false, true, 'approved', 'manual', NOW() - INTERVAL '4 days'),

-- ═══════════════════════════════════════════════════
-- ADDITIONAL HIGH-DEMAND JOBS (25 jobs)
-- ═══════════════════════════════════════════════════
('Product Manager - FinTech', 'stc pay', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 22000, 32000, 'SAR',
 'stc pay تبحث عن مدير منتج لقيادة تطوير منتجات الدفع الرقمي.',
 ARRAY['Product Management', 'Agile', 'Scrum', 'Jira', 'Data Analysis', 'FinTech', 'Arabic', 'English'],
 ARRAY['خبرة 5+ سنوات في إدارة المنتجات', 'خلفية في FinTech مفضّلة', 'تفكير مبني على البيانات'],
 ARRAY['راتب تنافسي جداً', 'أسهم الشركة', 'تأمين صحي', 'مرونة في العمل'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('UI/UX Designer - تصميم تجربة المستخدم', 'Careem', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 14000, 20000, 'SAR',
 'كريم تبحث عن مصمم UX/UI لتحسين تجربة المستخدم في تطبيق كريم في السوق السعودي.',
 ARRAY['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems', 'Arabic UX', 'Mobile Design'],
 ARRAY['بكالوريوس تصميم أو ما يعادلها', 'معرض أعمال قوي', 'خبرة 3+ سنوات'],
 ARRAY['تأمين صحي', 'اشتراك كريم مجاني', 'مرونة في العمل', 'بيئة إبداعية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('مهندس AI/ML - رؤية الحاسوب', 'KACST', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 22000, 35000, 'SAR',
 'مدينة الملك عبدالعزيز للعلوم والتقنية تبحث عن مهندس AI متخصص في رؤية الحاسوب.',
 ARRAY['Computer Vision', 'OpenCV', 'YOLO', 'TensorFlow', 'PyTorch', 'Python', 'Deep Learning', 'GPU'],
 ARRAY['ماجستير فأعلى في الذكاء الاصطناعي', 'خبرة في نماذج الرؤية الحاسوبية', 'أبحاث منشورة'],
 ARRAY['بيئة بحثية عالمية المستوى', 'راتب تنافسي', 'تمويل الدراسات العليا'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '1 day'),

('مستشار ERP - SAP', 'IBM Saudi Arabia', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 20000, 30000, 'SAR',
 'IBM السعودية تبحث عن مستشار SAP متمرس لتنفيذ مشاريع ERP في القطاع الحكومي.',
 ARRAY['SAP', 'SAP S/4HANA', 'FI/CO', 'MM', 'SD', 'ABAP', 'Project Management', 'Arabic'],
 ARRAY['شهادة SAP معتمدة', 'خبرة 7+ سنوات في تنفيذ SAP', 'خلفية في القطاع الحكومي مفضّلة'],
 ARRAY['راتب تنافسي', 'بدل سفر', 'تأمين صحي', 'بيئة دولية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '4 days'),

('مطوّر WordPress/WooCommerce', 'Arab Digital Agency', 'جدة', 'منطقة مكة المكرمة', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 9000, 14000, 'SAR',
 'وكالة رقمية تبحث عن مطوّر WordPress لبناء وتطوير مواقع عملائها التجارية.',
 ARRAY['WordPress', 'WooCommerce', 'PHP', 'CSS', 'JavaScript', 'Elementor', 'SEO', 'Arabic'],
 ARRAY['خبرة 2+ سنوات في WordPress', 'معرض مواقع منشورة'],
 ARRAY['بيئة مرنة', 'مشاريع متنوعة', 'تطوير مهني'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('مدير استثمار - صندوق الاستثمارات', 'PIF Related Entity', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'متقدم', 35000, 60000, 'SAR',
 'جهة تابعة لصندوق الاستثمارات العامة تبحث عن مدير استثمار لإدارة محفظة القطاع الرقمي.',
 ARRAY['Investment Management', 'Private Equity', 'Financial Modeling', 'CFA', 'Due Diligence', 'Arabic', 'English'],
 ARRAY['شهادة CFA مطلوبة', 'ماجستير مالية من جامعة مرموقة', 'خبرة 8+ سنوات في الاستثمار'],
 ARRAY['حزمة مالية استثنائية', 'تأمين شامل', 'مكافآت أداء عالية', 'بيئة عمل رائدة'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('مدير مشتريات - قطاع البتروكيماويات', 'SABIC', 'الجبيل', 'المنطقة الشرقية', 'الإدارة', 'دوام كامل', 'متقدم', 22000, 32000, 'SAR',
 'سابك تبحث عن مدير مشتريات استراتيجية لإدارة موردي القطاع الصناعي.',
 ARRAY['Procurement', 'Supply Chain', 'SAP MM', 'Negotiation', 'Arabic', 'English', 'Category Management'],
 ARRAY['خبرة 7+ سنوات في المشتريات الصناعية', 'شهادة CIPS مفضّلة', 'إلمام بـ SAP MM'],
 ARRAY['راتب تنافسي', 'بدل سكن', 'تأمين صحي للعائلة', 'مكافآت سنوية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('مستشار اكتواري', 'Bupa Arabia', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'متقدم', 25000, 38000, 'SAR',
 'بوبا العربية تبحث عن مستشار اكتواري لتسعير منتجات التأمين الصحي.',
 ARRAY['Actuarial Science', 'R', 'Python', 'Pricing', 'Risk Modeling', 'Health Insurance', 'Arabic'],
 ARRAY['شهادة FIA أو FSA أو FCAS', 'خبرة 5+ سنوات في التأمين الصحي'],
 ARRAY['راتب استثنائي', 'تأمين صحي ممتاز', 'دعم الشهادات الاكتوارية'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('مدير مبيعات إقليمي - الغرب', 'L''Oreal Saudi Arabia', 'جدة', 'منطقة مكة المكرمة', 'التسويق والمبيعات', 'دوام كامل', 'متقدم', 20000, 30000, 'SAR',
 'لوريال تبحث عن مدير مبيعات إقليمي لمنطقة الغرب لقيادة فريق البيع في الصيدليات والمستشفيات.',
 ARRAY['Sales Management', 'Pharmacy', 'Team Leadership', 'P&L', 'Arabic', 'English', 'CRM'],
 ARRAY['خبرة 7+ سنوات في مبيعات المنتجات الصحية', 'قيادة فرق 10+'],
 ARRAY['راتب + عمولة سخية', 'سيارة الشركة', 'تأمين صحي شامل'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '6 days'),

('أخصائي علاقات حكومية', 'Saudi Vision Holding', 'الرياض', 'منطقة الرياض', 'الإدارة', 'دوام كامل', 'متقدم', 18000, 26000, 'SAR',
 'مجموعة رؤية سعودية تبحث عن أخصائي علاقات حكومية لتسهيل التراخيص والامتثال.',
 ARRAY['Government Relations', 'Arabic', 'Regulatory', 'Communication', 'Networking', 'Legal Knowledge'],
 ARRAY['خبرة 5+ سنوات في العلاقات الحكومية', 'شبكة علاقات واسعة في الجهات الحكومية'],
 ARRAY['سيارة الشركة', 'تأمين صحي', 'بدلات متميزة'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '7 days'),

('مدير تطوير أعمال - SaaS', 'Marn POS', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'متوسط', 15000, 22000, 'SAR',
 'مارن لأنظمة نقاط البيع تبحث عن مدير تطوير أعمال لتوسيع قاعدة عملاء SaaS.',
 ARRAY['Business Development', 'SaaS Sales', 'CRM', 'Arabic', 'English', 'Demos', 'Contract Negotiation'],
 ARRAY['خبرة 4+ سنوات في مبيعات SaaS', 'معرفة بقطاع المطاعم أو التجزئة مفضّلة'],
 ARRAY['راتب + عمولة', 'أسهم الشركة', 'بيئة شركة ناشئة', 'تأمين صحي'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '8 days'),

('مهندس جودة - ISO/IATF', 'Zahid Motors', 'جدة', 'منطقة مكة المكرمة', 'الهندسة', 'دوام كامل', 'متوسط', 14000, 20000, 'SAR',
 'زاهد موتورز تبحث عن مهندس جودة لتطبيق معايير ISO والإشراف على عمليات ضبط الجودة.',
 ARRAY['Quality Management', 'ISO 9001', 'IATF 16949', 'Six Sigma', 'Root Cause Analysis', 'Arabic'],
 ARRAY['بكالوريوس هندسة', 'خبرة 3+ سنوات في ضبط الجودة', 'شهادة ISO Lead Auditor مفضّلة'],
 ARRAY['تأمين صحي', 'بدل سكن', 'مكافآت أداء'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '9 days'),

('مشرف مستودع - شركة توزيع', 'Al-Dabbagh Group', 'الرياض', 'منطقة الرياض', 'الإدارة', 'دوام كامل', 'متوسط', 9000, 13000, 'SAR',
 'مجموعة الدباغ تبحث عن مشرف مستودع لإدارة عمليات استلام وتسليم البضائع.',
 ARRAY['Warehouse Management', 'SAP WM', 'Inventory Control', 'Arabic', 'Team Leadership', 'Safety'],
 ARRAY['خبرة 3+ سنوات في إدارة المستودعات', 'إلمام بـ WMS'],
 ARRAY['تأمين صحي', 'بدل مواصلات', 'وجبة مجانية'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '10 days'),

('خبير امتثال - AML/KYC', 'Bank AlJazira', 'الرياض', 'منطقة الرياض', 'المالية والمحاسبة', 'دوام كامل', 'متقدم', 18000, 27000, 'SAR',
 'بنك الجزيرة يبحث عن خبير امتثال متخصص في مكافحة غسيل الأموال.',
 ARRAY['AML', 'KYC', 'CAMS', 'Compliance', 'Risk Assessment', 'Banking Regulations', 'Arabic', 'English'],
 ARRAY['شهادة CAMS مطلوبة', 'خبرة 5+ سنوات في الامتثال البنكي', 'معرفة بنظام مؤسسة النقد'],
 ARRAY['راتب تنافسي', 'تأمين صحي', 'استقرار وظيفي'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '4 days'),

('مصمم جرافيك - هوية بصرية', 'Seddiqi & Sons', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'متوسط', 9000, 14000, 'SAR',
 'شركة فاخرة تبحث عن مصمم جرافيك للإشراف على الهوية البصرية وإنتاج المواد التسويقية.',
 ARRAY['Adobe Illustrator', 'Photoshop', 'InDesign', 'Arabic Typography', 'Brand Identity', 'Motion Graphics'],
 ARRAY['بكالوريوس تصميم جرافيك', 'معرض أعمال احترافي', 'خبرة 3+ سنوات'],
 ARRAY['تأمين صحي', 'بيئة فاخرة', 'تطوير مهني'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '11 days'),

('مهندس دعم تقني L2', 'Siemens Saudi Arabia', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متوسط', 12000, 18000, 'SAR',
 'سيمنز السعودية تبحث عن مهندس دعم تقني من المستوى الثاني لخدمة عملاء المؤسسات.',
 ARRAY['Technical Support', 'Windows Server', 'Active Directory', 'ITIL', 'Cisco', 'Arabic', 'English'],
 ARRAY['بكالوريوس تقنية معلومات', 'شهادة ITIL', 'خبرة 3+ سنوات في الدعم التقني'],
 ARRAY['بيئة دولية', 'تدريب على أحدث التقنيات', 'تأمين صحي'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '6 days'),

('مدير عقارات تجارية', 'CBRE Saudi Arabia', 'الرياض', 'منطقة الرياض', 'الإدارة', 'دوام كامل', 'متقدم', 20000, 32000, 'SAR',
 'CBRE السعودية تبحث عن مدير عقارات تجارية لإدارة محافظ العملاء المؤسسيين.',
 ARRAY['Real Estate', 'Asset Management', 'Leasing', 'Valuation', 'Arabic', 'English', 'Financial Modeling'],
 ARRAY['بكالوريوس إدارة أو هندسة', 'ترخيص وسيط عقاري', 'خبرة 7+ سنوات في العقارات التجارية'],
 ARRAY['راتب + عمولة', 'سيارة الشركة', 'تأمين صحي'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '7 days'),

('طبيب أسنان - عيادة خاصة', 'مجموعة عيادات الابتسامة', 'الرياض', 'منطقة الرياض', 'الرعاية الصحية', 'دوام كامل', 'متوسط', 20000, 35000, 'SAR',
 'مجموعة عيادات تبحث عن طبيب أسنان عام للانضمام إلى فريقها المتخصص.',
 ARRAY['Dentistry', 'Implants', 'Orthodontics', 'Cosmetic Dentistry', 'Arabic', 'English', 'Patient Relations'],
 ARRAY['بكالوريوس طب الأسنان', 'ترخيض هيئة الصحة السعودية', 'خبرة 3+ سنوات'],
 ARRAY['نسبة من الإيرادات', 'تأمين صحي', 'أدوات حديثة'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '3 days'),

('أخصائي علاج طبيعي', 'مستشفى الأمل', 'الرياض', 'منطقة الرياض', 'الرعاية الصحية', 'دوام كامل', 'متوسط', 12000, 18000, 'SAR',
 'مستشفى الأمل يبحث عن أخصائي علاج طبيعي لخدمة مرضى الحوادث والعمليات.',
 ARRAY['Physical Therapy', 'Manual Therapy', 'Electrotherapy', 'Rehabilitation', 'Arabic', 'English'],
 ARRAY['بكالوريوس علاج طبيعي', 'ترخيص هيئة الصحة', 'خبرة 2+ سنوات'],
 ARRAY['تأمين صحي', 'بدل مناوبات', 'بيئة عمل داعمة'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '8 days'),

('مدير تجربة العملاء CX', 'Lulu Hypermarket', 'الرياض', 'منطقة الرياض', 'التسويق والمبيعات', 'دوام كامل', 'متقدم', 16000, 24000, 'SAR',
 'لولو للتسوق تبحث عن مدير CX لرفع مستوى تجربة العملاء في فروع الرياض.',
 ARRAY['Customer Experience', 'NPS', 'CSAT', 'CRM', 'Feedback Analysis', 'Arabic', 'English', 'Leadership'],
 ARRAY['خبرة 5+ سنوات في تجربة العملاء', 'إلمام بأدوات قياس CX'],
 ARRAY['راتب تنافسي', 'خصومات تسوق', 'تأمين صحي'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '5 days'),

('Scrum Master - تقنية', 'STC', 'الرياض', 'منطقة الرياض', 'تقنية المعلومات', 'دوام كامل', 'متقدم', 18000, 26000, 'SAR',
 'stc تبحث عن Scrum Master لقيادة فرق التطوير الرشيق في مشاريع التحول الرقمي.',
 ARRAY['Scrum', 'Agile', 'Jira', 'Confluence', 'Coaching', 'Arabic', 'English', 'CSM'],
 ARRAY['شهادة CSM أو PSM', 'خبرة 4+ سنوات كـ Scrum Master', 'إلمام بـ SAFe'],
 ARRAY['راتب مميز', 'تأمين صحي', 'بيئة تقنية متطورة', 'مرونة في العمل'],
 true, false, false, false, 'approved', 'manual', NOW() - INTERVAL '2 days'),

('مستشار استراتيجية', 'McKinsey & Company', 'الرياض', 'منطقة الرياض', 'الإدارة', 'دوام كامل', 'متقدم', 35000, 55000, 'SAR',
 'ماكنزي تبحث عن مستشار استراتيجية للعمل مع كبار عملاء القطاعين الحكومي والخاص.',
 ARRAY['Strategy', 'Business Analysis', 'PowerPoint', 'Excel', 'Arabic', 'English', 'Problem Solving', 'Frameworks'],
 ARRAY['MBA من جامعة عالمية مرموقة', 'خبرة 3+ سنوات في الاستشارات الإدارية', 'تحليل كمي قوي'],
 ARRAY['حزمة مالية استثنائية', 'تنقل دولي', 'تطوير سريع', 'بيئة عمل نخبوية'],
 true, true, false, false, 'approved', 'manual', NOW() - INTERVAL '1 day');
