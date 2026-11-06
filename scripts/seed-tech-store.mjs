import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';

const dbPath = path.join(os.homedir(), '.config/whatsapp-store-bot-marketing/whatsapp_store.db');
console.log(`[Seed] Connecting to SQLite database at: ${dbPath}`);
const db = new Database(dbPath);

const TECH_CATEGORIES = [
  {
    id: 'cat_smartphones',
    name: 'هواتف ذكية وأجهزة لوحية',
    slug: 'smartphones-tablets',
    description: 'أحدث الهواتف الذكية الرائدة من آبل وسامسونج وشاومي مع ضمان محلي معتمد',
    icon: 'Smartphone',
    color: '#3B82F6',
    sort_order: 1,
  },
  {
    id: 'cat_laptops',
    name: 'أجهزة حاسوب ولابتوبات',
    slug: 'laptops-computers',
    description: 'حواسيب محمولة ومكتبية فائقة الأداء للأعمال وصناع المحتوى والطلاب',
    icon: 'Laptop',
    color: '#8B5CF6',
    sort_order: 2,
  },
  {
    id: 'cat_audio_tech',
    name: 'صوتيات وسماعات رأس',
    slug: 'audio-tech',
    description: 'سماعات احترافية تدعم عزل الضوضاء النشط والصوت عالي الدقة Hi-Res',
    icon: 'Headphones',
    color: '#10B981',
    sort_order: 3,
  },
  {
    id: 'cat_wearables_tech',
    name: 'ساعات وأجهزة ذكية',
    slug: 'smart-wearables',
    description: 'ساعات رياضية ذكية وأساور تتبع اللياقة والصحة بمستشعرات دقيقة',
    icon: 'Watch',
    color: '#F59E0B',
    sort_order: 4,
  },
  {
    id: 'cat_gaming_consoles',
    name: 'أجهزة ألعاب وملحقاتها',
    slug: 'gaming-consoles',
    description: 'منصات ألعاب الجيل الجديد بلايستيشن وأجهزة التحكم والإكسسوارات',
    icon: 'Gamepad2',
    color: '#6366F1',
    sort_order: 5,
  },
  {
    id: 'cat_digital_cards',
    name: 'بطاقات رقمية واشتراكات',
    slug: 'digital-cards-gaming',
    description: 'بطاقات شحن ألعاب، واشتراكات ترفيهية، وتراخيص برمجية مع تسليم فوري وتلقائي عبر واتساب',
    icon: 'CreditCard',
    color: '#EC4899',
    sort_order: 6,
  },
];

const TECH_PRODUCTS = [
  // 1. هواتف ذكية
  {
    id: 'prod_ip16_pm',
    name: 'هاتف آبل آيفون Apple iPhone 16 Pro Max (256GB - صحراوي تيتانيوم)',
    type: 'physical',
    category: 'هواتف ذكية وأجهزة لوحية',
    category_id: 'cat_smartphones',
    brand: 'Apple',
    sku: 'APL-IP16PM-256',
    barcode: '195949123456',
    price: 4899,
    cost_price: 4350,
    compare_at_price: 5199,
    stock: 18,
    weight: 0.227,
    media: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
    ],
    description: 'الهاتف الأقوى من أبل iPhone 16 Pro Max مع شاشة Super Retina XDR مقاس 6.9 بوصة، معالج A18 Pro فائق السرعة، وزر التحكم بالكاميرا الاحترافي، مع بطارية تدوم حتى 33 ساعة تشغيل فيديو وهيكل تيتانيوم صلب وخفيف.',
    whatsapp_short_desc: 'آيفون 16 برو ماكس سعة 256GB تيتانيوم صحراوي، معالج A18 Pro وضمان سنتين حاسبات العرب مع شحن سريع مجاني.',
    tags: ['آيفون', 'ايفون', 'أبل', 'ابل', 'تيتانيوم', '5G', 'iPhone', 'Pro Max'],
    is_featured: 1,
  },
  {
    id: 'prod_s25_ultra',
    name: 'هاتف سامسونج جالكسي Samsung Galaxy S25 Ultra (512GB - رمادي تيتانيوم)',
    type: 'physical',
    category: 'هواتف ذكية وأجهزة لوحية',
    category_id: 'cat_smartphones',
    brand: 'Samsung',
    sku: 'SAM-S25U-512',
    barcode: '880609123456',
    price: 4599,
    cost_price: 4050,
    compare_at_price: 4999,
    stock: 15,
    weight: 0.232,
    media: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600',
    ],
    description: 'قمة ابتكارات سامسونج مع قلم S-Pen مدمج، معالج Snapdragon 8 Elite المخصص، كاميرا رئيسية 200 ميجابكسل تدعم زووم خارق وتقنيات الذكاء الاصطناعي التوليدي Galaxy AI المتطورة لتعديل الصور والترجمة الفورية.',
    whatsapp_short_desc: 'سامسونج جالكسي S25 الترا 512GB مع قلم S-Pen مدمج، كاميرا 200MP وضمان الوكيل سنتين.',
    tags: ['سامسونج', 'جالكسي', 'S-Pen', 'أندرويد', 'Galaxy AI', 'Samsung', 'S25'],
    is_featured: 1,
  },
  {
    id: 'prod_mi14t_pro',
    name: 'هاتف شاومي Xiaomi 14T Pro (512GB - أسود تيتان)',
    type: 'physical',
    category: 'هواتف ذكية وأجهزة لوحية',
    category_id: 'cat_smartphones',
    brand: 'Xiaomi',
    sku: 'MI-14TP-512',
    barcode: '694181234567',
    price: 2499,
    cost_price: 2150,
    compare_at_price: 2799,
    stock: 22,
    weight: 0.209,
    media: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
    ],
    description: 'هاتف الفئة الرائدة مع منظومة عدسات لايكا Leica الاحترافية، معالج MediaTek Dimensity 9300+ الجبار، شاشة AMOLED بتردد 144Hz، وشحن فائق السرعة HyperCharge بقدرة 120 واط يملأ البطارية في 19 دقيقة فقط.',
    whatsapp_short_desc: 'شاومي 14T برو 512GB بكاميرات لايكا الألمانية وشاحن فائق السرعة 120W داخل الصندوق.',
    tags: ['شاومي', 'لايكا', 'شحن سريع', '144Hz', 'Xiaomi'],
    is_featured: 0,
  },

  // 2. أجهزة لابتوب وإلكترونيات
  {
    id: 'prod_mba_m3',
    name: 'لابتوب أبل ماك بوك Apple MacBook Air M3 (شاشة 13.6 بوصة / 16GB RAM / 512GB SSD - رمادي فلكي)',
    type: 'physical',
    category: 'أجهزة حاسوب ولابتوبات',
    category_id: 'cat_laptops',
    brand: 'Apple',
    sku: 'APL-MBA-M3-16',
    barcode: '195949789012',
    price: 4799,
    cost_price: 4250,
    compare_at_price: 5299,
    stock: 10,
    weight: 1.24,
    media: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600',
    ],
    description: 'قوة وسرعة مذهلة بفضل شريحة Apple M3 مع تصميم بدون مروحة فائق الهدوء ونحافة لا تتجاوز 11.3 مم. شاشة Liquid Retina غنية بالألوان، بطارية تدوم حتى 18 ساعة، مع لوحة مفاتيح عربية/إنجليزية رسمية.',
    whatsapp_short_desc: 'ماك بوك اير شريحة M3 رام 16GB وذاكرة 512GB فائق النحافة والخفة ببطارية تدوم 18 ساعة.',
    tags: ['ماك بوك', 'لابتوب', 'Apple M3', 'أبل', 'MacBook'],
    is_featured: 1,
  },
  {
    id: 'prod_sony_xm5',
    name: 'سماعة رأس لاسلكية سوني Sony WH-1000XM5 (عازلة للضوضاء - أسود فاخر)',
    type: 'physical',
    category: 'صوتيات وسماعات رأس',
    category_id: 'cat_audio_tech',
    brand: 'Sony',
    sku: 'SNY-XM5-BLK',
    barcode: '454873123456',
    price: 1199,
    cost_price: 940,
    compare_at_price: 1399,
    stock: 25,
    weight: 0.25,
    media: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
    ],
    description: 'رائدة تقنية إلغاء الضوضاء عالمياً مع معالجين متقدمين ومكبر صوت كربوني 30 مم لجودة صوت أسطورية Hi-Res Audio. تدعم التبديل السلس بين جهازين، بطارية تدوم 30 ساعة مع شحن 3 دقائق يكفي لـ 3 ساعات.',
    whatsapp_short_desc: 'سماعة سوني XM5 الأصلية، العزل الأفضل في العالم وبطارية 30 ساعة مع صوت فائق النقاوة.',
    tags: ['سوني', 'سماعات', 'عزل ضوضاء', 'Hi-Res', 'Sony', 'XM5'],
    is_featured: 0,
  },
  {
    id: 'prod_apple_watch_ultra2',
    name: 'ساعة أبل واتش Apple Watch Ultra 2 (هيكل تيتانيوم 49 مم - سوار أوشن أزرق)',
    type: 'physical',
    category: 'ساعات وأجهزة ذكية',
    category_id: 'cat_wearables_tech',
    brand: 'Apple',
    sku: 'APL-AWU2-OCN',
    barcode: '195949345678',
    price: 3199,
    cost_price: 2820,
    compare_at_price: 3499,
    stock: 12,
    weight: 0.061,
    media: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600',
    ],
    description: 'الساعة الأكثر قدرة وقوة للمغامرات والرياضات الاحترافية مع هيكل تيتانيوم متين ومقاوم للغوص حتى 100 متر. شاشة فائقة السطوع 3000 شمعة، نظام تحديد مواقع GPS ثنائي التردد عالي الدقة، وبطارية تدوم أياماً.',
    whatsapp_short_desc: 'أبل واتش ألترا 2 تيتانيوم 49 مم للرياضيين والغواصين مع GPS فائق الدقة وبطارية طويلة.',
    tags: ['ساعة ذكية', 'أبل واتش', 'تيتانيوم', 'Ultra 2', 'Apple Watch'],
    is_featured: 1,
  },
  {
    id: 'prod_ps5_slim',
    name: 'منصة ألعاب سوني بلايستيشن Sony PlayStation 5 Slim Digital Edition (1TB SSD)',
    type: 'physical',
    category: 'أجهزة ألعاب وملحقاتها',
    category_id: 'cat_gaming_consoles',
    brand: 'Sony',
    sku: 'SNY-PS5-SLIM',
    barcode: '711719572345',
    price: 1749,
    cost_price: 1550,
    compare_at_price: 1899,
    stock: 14,
    weight: 2.6,
    media: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
    ],
    description: 'جهاز بلايستيشن 5 سليم بتصميم أنحف وأخف مع مساحة تخزين داخلية 1 تيرابايت SSD فائق السرعة، مع ذراع تحكم DualSense اللاسلكي بدعم الملاحظات اللمسية ومحفزات التكيف ورسومات مذهلة بدقة 4K بمعدل 120 إطاراً.',
    whatsapp_short_desc: 'بلايستيشن 5 سليم ديجيتال 1TB SSD مع يد تحكم دوال سينس وضمان سنتين من سوني السعودية.',
    tags: ['بلايستيشن', 'PS5', 'ألعاب', 'Sony', 'PlayStation'],
    is_featured: 1,
  },

  // 3. بطاقات رقمية واشتراكات مع تسليم فوري للمفاتيح
  {
    id: 'prod_card_psn_100',
    name: 'بطاقة بلايستيشن ستور سعودي 100 دولار (PlayStation Network SA $100)',
    type: 'digital',
    category: 'بطاقات رقمية واشتراكات',
    category_id: 'cat_digital_cards',
    brand: 'PlayStation',
    sku: 'PSN-SA-100D',
    barcode: null,
    price: 375,
    cost_price: 350,
    compare_at_price: 399,
    stock: 6,
    weight: 0,
    media: [
      'https://images.unsplash.com/photo-1612287233207-6f81b1915473?w=600',
    ],
    description: 'كود رقمي رسمي لشحن رصيد حسابك في متجر بلايستيشن السعودي بقيمة 100 دولار لشراء الألعاب والإضافات واشتراكات PS Plus على أجهزة PS5 و PS4. التسليم فوري وتلقائي عبر محادثة واتساب فور إتمام الدفع.',
    whatsapp_short_desc: 'بطاقة بلايستيشن ستور سعودي 100$، كود تفعيل أصلي 100% مع تسليم فوري بالواتساب فور الدفع.',
    tags: ['بلايستيشن', 'بطاقات ألعاب', 'PSN', 'تسليم فوري'],
    is_featured: 1,
    keys: [
      'PSN-SA100-8X9Y-4K2L-99AQ',
      'PSN-SA100-3M7N-5P8Q-11BW',
      'PSN-SA100-9D2F-7G4H-88CE',
      'PSN-SA100-5J1K-6L9Z-33DR',
      'PSN-SA100-2W4E-8R6T-77FT',
      'PSN-SA100-1Z8X-9C3V-55GN',
    ],
  },
  {
    id: 'prod_card_apple_100',
    name: 'بطاقة أبل ستور وآيتونز 100 ريال سعودي (Apple Gift Card SA 100 SAR)',
    type: 'digital',
    category: 'بطاقات رقمية واشتراكات',
    category_id: 'cat_digital_cards',
    brand: 'Apple',
    sku: 'APL-GIFT-100SA',
    barcode: null,
    price: 100,
    cost_price: 94,
    compare_at_price: 105,
    stock: 6,
    weight: 0,
    media: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600',
    ],
    description: 'بطاقة شحن رصيد Apple ID السعودي، صالحة للاشتراك في خدمات iCloud+، Apple Music، Apple Arcade، وشراء التطبيقات والكتب والألعاب من App Store. تسليم فوري وتلقائي للكود عبر واتساب.',
    whatsapp_short_desc: 'بطاقة أبل ستور سعودي 100 ريال، شحن فوري لحسابك في App Store وخدمات iCloud الموسعة.',
    tags: ['أبل', 'آيتونز', 'App Store', 'بطاقة رقمية'],
    is_featured: 1,
    keys: [
      'APL-SA100-X7Y8-Z9W1',
      'APL-SA100-K2L3-M4N5',
      'APL-SA100-P6Q7-R8S9',
      'APL-SA100-T1U2-V3W4',
      'APL-SA100-A5B6-C7D8',
      'APL-SA100-E9F0-G1H2',
    ],
  },
  {
    id: 'prod_sub_shahid_vip',
    name: 'اشتراك شاهد VIP شامل باقة الرياضة (سنة كاملة - تفعيل رسمي)',
    type: 'digital',
    category: 'بطاقات رقمية واشتراكات',
    category_id: 'cat_digital_cards',
    brand: 'Shahid',
    sku: 'SHD-VIP-SPORT-1Y',
    barcode: null,
    price: 399,
    cost_price: 325,
    compare_at_price: 499,
    stock: 5,
    weight: 0,
    media: [
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600',
    ],
    description: 'قسيمة تفعيل رسمية لاشتراك سنوي في منصة شاهد VIP شاملة باقة قنوات SSC الرياضية لمتابعة دوري روشن السعودي، بطولات آسيا، فورمولا 1، ومكتبة ضخمة من المسلسلات والأفلام الحصرية بدقة 4K بدون فواصل إعلانية.',
    whatsapp_short_desc: 'قسيمة شاهد VIP شامل الرياضة سنة كاملة، كود تفعيل فوري يدعم المشاهدة بجودة 4K على التلفزيون والجوال.',
    tags: ['شاهد', 'دوري روشن', 'VIP', 'اشتراكات ترفيهية'],
    is_featured: 1,
    keys: [
      'SHD-SPORT-8821-XKZL',
      'SHD-SPORT-4490-PMQW',
      'SHD-SPORT-7733-BCDA',
      'SHD-SPORT-1166-VRTY',
      'SHD-SPORT-9900-QAZX',
    ],
  },
  {
    id: 'prod_win11_pro',
    name: 'مفتاح تفعيل Microsoft Windows 11 Pro أصلي (مدى الحياة - تفعيل مباشر)',
    type: 'digital',
    category: 'بطاقات رقمية واشتراكات',
    category_id: 'cat_digital_cards',
    brand: 'Microsoft',
    sku: 'MS-WIN11-PRO',
    barcode: null,
    price: 89,
    cost_price: 45,
    compare_at_price: 199,
    stock: 6,
    weight: 0,
    media: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600',
    ],
    description: 'مفتاح رقمي أصلي 100% لتفعيل نظام ويندوز 11 برو (Windows 11 Professional) مدى الحياة لجهاز كمبيوتر واحد. يدعم اللغتين العربية والإنجليزية، الترقية من Home إلى Pro، واستقبال كافة التحديثات الرسمية من مايكروسوفت.',
    whatsapp_short_desc: 'كود تفعيل ويندوز 11 برو أصلي مدى الحياة مع دعم التحديثات وتفعيل مباشر أونلاين.',
    tags: ['ويندوز', 'مايكروسوفت', 'برامج', 'تراخيص'],
    is_featured: 0,
    keys: [
      'W11P-VK7JG-NPHTM-C97JM-9MPGT',
      'W11P-NRM8K-R6F43-G4RDT-VFTJ2',
      'W11P-B3H2M-489XK-F8Y8P-QKV36',
      'W11P-T8R9K-23X7P-L8M5N-W6Q4V',
      'W11P-C4D5F-6G7H8-J9K0L-M1N2P',
      'W11P-X9Y8Z-7W6V5-U4T3S-2R1Q0',
    ],
  },
  {
    id: 'prod_pubg_660',
    name: 'بطاقة شحن ببجي موبايل 660 شدة UC (PUBG Mobile 660 UC)',
    type: 'digital',
    category: 'بطاقات رقمية واشتراكات',
    category_id: 'cat_digital_cards',
    brand: 'PUBG',
    sku: 'PUBG-UC-660',
    barcode: null,
    price: 42,
    cost_price: 36,
    compare_at_price: 49,
    stock: 6,
    weight: 0,
    media: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    ],
    description: 'كود شحن 660 شدة (UC) للعبة ببجي موبايل العالمية. يمكن شحن الكود مباشرة عبر موقع Midasbuy الرسمي بإدخال الـ Player ID الخاص بك. التسليم فوري وتلقائي عبر الواتساب فور إتمام عملية الدفع.',
    whatsapp_short_desc: 'كود شحن شدات ببجي 660 UC، تفعيل فوري عبر Midasbuy مع تسليم آلي بالواتساب.',
    tags: ['ببجي', 'ألعاب', 'شدات', 'UC'],
    is_featured: 0,
    keys: [
      'PUBG-660UC-K9A8-L7M6',
      'PUBG-660UC-P5Q4-R3S2',
      'PUBG-660UC-T1U0-V9W8',
      'PUBG-660UC-X7Y6-Z5A4',
      'PUBG-660UC-B3C2-D1E0',
      'PUBG-660UC-F9G8-H7J6',
    ],
  },
];

const insertCategory = db.prepare(`
  INSERT INTO categories (id, name, slug, description, icon, color, sort_order, active)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    slug = excluded.slug,
    description = excluded.description,
    icon = excluded.icon,
    color = excluded.color,
    sort_order = excluded.sort_order,
    active = 1
`);

const insertProduct = db.prepare(`
  INSERT INTO products (
    id, name, type, description, media, category, category_id, active,
    cost_price, compare_at_price, barcode, sku, brand,
    weight, length, width, height, shipping_type, shipping_fee,
    low_stock_threshold, tax_rate, is_tax_inclusive, tags,
    whatsapp_short_desc, is_featured, allow_backorders
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, 1,
    ?, ?, ?, ?, ?,
    ?, 0, 0, 0, 'default', 0,
    5, 15, 1, ?,
    ?, ?, 0
  )
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    type = excluded.type,
    description = excluded.description,
    media = excluded.media,
    category = excluded.category,
    category_id = excluded.category_id,
    cost_price = excluded.cost_price,
    compare_at_price = excluded.compare_at_price,
    barcode = excluded.barcode,
    sku = excluded.sku,
    brand = excluded.brand,
    weight = excluded.weight,
    tags = excluded.tags,
    whatsapp_short_desc = excluded.whatsapp_short_desc,
    is_featured = excluded.is_featured,
    active = 1
`);

const insertVariant = db.prepare(`
  INSERT INTO variants (id, product_id, sku, options_json, price, currency, stock_qty)
  VALUES (?, ?, ?, '{}', ?, 'SAR', ?)
  ON CONFLICT(id) DO UPDATE SET
    price = excluded.price,
    stock_qty = excluded.stock_qty
`);

const insertLicenseKey = db.prepare(`
  INSERT OR IGNORE INTO license_keys (id, product_id, key_code, status)
  VALUES (?, ?, ?, 'available')
`);

console.log('[Seed] Seeding tech categories...');
for (const cat of TECH_CATEGORIES) {
  insertCategory.run(cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.color, cat.sort_order);
}

console.log('[Seed] Seeding tech products & digital keys...');
let totalKeys = 0;
for (const prod of TECH_PRODUCTS) {
  insertProduct.run(
    prod.id,
    prod.name,
    prod.type,
    prod.description,
    JSON.stringify(prod.media),
    prod.category,
    prod.category_id,
    prod.cost_price,
    prod.compare_at_price,
    prod.barcode,
    prod.sku,
    prod.brand,
    prod.weight,
    JSON.stringify(prod.tags),
    prod.whatsapp_short_desc,
    prod.is_featured
  );

  const variantId = `var_${prod.id}`;
  insertVariant.run(variantId, prod.id, prod.sku, prod.price, prod.stock);

  if (prod.keys && prod.keys.length > 0) {
    prod.keys.forEach((key, idx) => {
      const keyId = `key_${prod.id}_${idx + 1}`;
      insertLicenseKey.run(keyId, prod.id, key);
      totalKeys++;
    });
  }
}

console.log(`[Seed] Successfully seeded:`);
console.log(` - ${TECH_CATEGORIES.length} Tech categories`);
console.log(` - ${TECH_PRODUCTS.length} Tech products (Smartphones, Devices & Digital Cards)`);
console.log(` - ${totalKeys} Digital license keys available for instant delivery`);
