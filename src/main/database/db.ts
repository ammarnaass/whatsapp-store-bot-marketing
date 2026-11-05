import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { hashPassword } from '../auth/auth-crypto';

export class AppDatabase {
  private static instance: AppDatabase;
  public db: Database.Database;

  private constructor() {
    // تحديد مسار تخزين قاعدة البيانات محلياً
    let dbPath: string;
    try {
      const userDataPath = app ? app.getPath('userData') : process.cwd();
      dbPath = path.join(userDataPath, 'whatsapp_store.db');
    } catch {
      dbPath = path.join(process.cwd(), 'whatsapp_store.db');
    }

    console.log(`[Database] Initializing SQLite at: ${dbPath}`);
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('synchronous = NORMAL');

    this.initializeSchema();
    this.seedInitialDataIfEmpty();
  }

  public static getInstance(): AppDatabase {
    if (!AppDatabase.instance) {
      AppDatabase.instance = new AppDatabase();
    }
    return AppDatabase.instance;
  }

  private initializeSchema() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    let schemaSql = '';

    if (fs.existsSync(schemaPath)) {
      schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    } else {
      // احتياطي في حال تم تجميع التطبيق أو مسار التطوير
      const altPath = path.join(process.cwd(), 'src/main/database/schema.sql');
      if (fs.existsSync(altPath)) {
        schemaSql = fs.readFileSync(altPath, 'utf-8');
      }
    }

    if (schemaSql) {
      this.db.exec(schemaSql);
      console.log('[Database] Schema initialized successfully.');
    } else {
      console.warn('[Database] Schema file not found, applying built-in DDL fallback.');
      this.applyInlineSchema();
    }

    this.runMigrations();
  }

  private runMigrations() {
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS store_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'owner',
          phone TEXT,
          avatar TEXT,
          status TEXT NOT NULL DEFAULT 'active',
          last_login_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS inventory_logs (
          id TEXT PRIMARY KEY,
          variant_id TEXT REFERENCES variants(id) ON DELETE CASCADE,
          change_qty INTEGER NOT NULL,
          quantity_before INTEGER NOT NULL,
          quantity_after INTEGER NOT NULL,
          reason TEXT NOT NULL,
          order_id TEXT,
          created_by TEXT DEFAULT 'system',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_inventory_logs_variant ON inventory_logs(variant_id, created_at DESC);
      `);

      const userCount = (this.db.prepare('SELECT count(*) as count FROM users').get() as any)?.count || 0;
      if (userCount === 0) {
        const { hash, salt } = hashPassword('admin123');
        this.db.prepare(`
          INSERT INTO users (id, email, name, password_hash, salt, role, phone, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
        `).run(
          'usr_default_owner',
          'admin@wasell.store',
          'عبدالعزيز التميمي (مدير المتجر)',
          hash,
          salt,
          'owner',
          '+213555220620'
        );
        console.log('[Database] Seeded initial admin owner user: admin@wasell.store');
      }

      const info = this.db.prepare('PRAGMA table_info(contacts)').all() as any[];
      const cols = new Set(info.map((c) => c.name));
      if (!cols.has('avatar')) {
        this.db.exec('ALTER TABLE contacts ADD COLUMN avatar TEXT');
        console.log('[Database] Migrated: added contacts.avatar');
      }
      if (!cols.has('notes')) {
        this.db.exec('ALTER TABLE contacts ADD COLUMN notes TEXT');
        console.log('[Database] Migrated: added contacts.notes');
      }

      // ترقية جدول المنتجات بكافة حقول الربحية والشحن والتصنيف والمخزون
      const prodInfo = this.db.prepare('PRAGMA table_info(products)').all() as any[];
      const prodCols = new Set(prodInfo.map((c) => c.name));
      const newProdCols: [string, string][] = [
        ['cost_price', 'REAL DEFAULT 0'],
        ['compare_at_price', 'REAL DEFAULT 0'],
        ['barcode', 'TEXT'],
        ['sku', 'TEXT'],
        ['brand', 'TEXT'],
        ['weight', 'REAL DEFAULT 0'],
        ['length', 'REAL DEFAULT 0'],
        ['width', 'REAL DEFAULT 0'],
        ['height', 'REAL DEFAULT 0'],
        ['shipping_type', "TEXT DEFAULT 'default'"],
        ['shipping_fee', 'REAL DEFAULT 0'],
        ['low_stock_threshold', 'INTEGER DEFAULT 5'],
        ['tax_rate', 'REAL DEFAULT 15'],
        ['is_tax_inclusive', 'INTEGER DEFAULT 1'],
        ['tags', "TEXT DEFAULT '[]'"],
        ['whatsapp_short_desc', 'TEXT'],
        ['is_featured', 'INTEGER DEFAULT 0'],
        ['allow_backorders', 'INTEGER DEFAULT 0'],
        ['category_id', 'TEXT REFERENCES categories(id) ON DELETE SET NULL'],
      ];

      for (const [colName, colDef] of newProdCols) {
        if (!prodCols.has(colName)) {
          this.db.exec(`ALTER TABLE products ADD COLUMN ${colName} ${colDef}`);
          console.log(`[Database] Migrated: added products.${colName}`);
        }
      }

      // ترقية جدول بنك المعرفة ومصادر المعرفة
      const kbInfo = this.db.prepare('PRAGMA table_info(knowledge_items)').all() as any[];
      const kbCols = new Set(kbInfo.map((c) => c.name));
      const newKbCols: [string, string][] = [
        ['source_type', "TEXT DEFAULT 'text_faq'"],
        ['summary', 'TEXT'],
        ['source_url', 'TEXT'],
        ['file_path', 'TEXT'],
        ['tokens_count', 'INTEGER DEFAULT 0'],
        ['priority', 'INTEGER DEFAULT 3'],
        ['hit_count', 'INTEGER DEFAULT 0'],
        ['last_used_at', 'DATETIME'],
      ];
      for (const [colName, colDef] of newKbCols) {
        if (!kbCols.has(colName)) {
          this.db.exec(`ALTER TABLE knowledge_items ADD COLUMN ${colName} ${colDef}`);
          console.log(`[Database] Migrated: added knowledge_items.${colName}`);
        }
      }

      // تهيئة جدول الفئات والتصنيفات
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          icon TEXT DEFAULT 'Folder',
          color TEXT DEFAULT '#128C7E',
          parent_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
          sort_order INTEGER DEFAULT 0,
          active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
        CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
      `);

      // تهيئة الفئات الافتراضية إذا كان الجدول فارغاً
      const catCount = (this.db.prepare('SELECT count(*) as count FROM categories').get() as any)?.count || 0;
      if (catCount === 0) {
        const insertCat = this.db.prepare(`
          INSERT INTO categories (id, name, slug, description, icon, color, sort_order, active)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `);
        const initialCategories = [
          ['cat_perfumes', 'عطور وباقات', 'perfumes', 'عطور فاخرة، دهن عود، وباقات هدايا منسقة', 'Sparkles', '#10B981', 1],
          ['cat_electronics', 'إلكترونيات وساعات', 'electronics', 'ساعات ذكية، أجهزة ذكية وملحقات رقمية', 'Watch', '#3B82F6', 2],
          ['cat_fashion', 'أزياء وإكسسوارات', 'fashion', 'أزياء عصرية، حقائب جلدية وإكسسوارات متميزة', 'Shirt', '#EC4899', 3],
          ['cat_digital', 'منتجات رقمية وتراخيص', 'digital', 'اشتراكات برمجية، تراخيص رقمية وبطاقات إلكترونية', 'Key', '#8B5CF6', 4],
          ['cat_home', 'مستلزمات منزلية', 'home', 'ديكورات ومستلزمات منزلية ومباخر فاخرة', 'Home', '#F59E0B', 5],
          ['cat_beauty', 'صحة وجمال', 'beauty', 'مستحضرات عناية بالبشرة ومستلزمات العناية الشخصية', 'Heart', '#06B6D4', 6],
        ];
        for (const cat of initialCategories) {
          insertCat.run(...cat);
        }
        console.log('[Database] Seeded initial categories.');
      }

      // ربط المنتجات الحالية بمعرفات الفئات تلقائياً
      this.db.exec(`
        UPDATE products SET category_id = (
          SELECT id FROM categories WHERE categories.name = products.category LIMIT 1
        ) WHERE category_id IS NULL AND category IS NOT NULL;
        UPDATE products SET category_id = 'cat_electronics', category = 'إلكترونيات وساعات' WHERE category LIKE '%إلكترونيات%' AND (category_id IS NULL OR category_id = '');
        UPDATE products SET category_id = 'cat_digital', category = 'منتجات رقمية وتراخيص' WHERE (category LIKE '%رقمية%' OR category LIKE '%برمجيات%' OR category LIKE '%تراخيص%') AND (category_id IS NULL OR category_id = '');
        UPDATE products SET category_id = 'cat_perfumes', category = 'عطور وباقات' WHERE (category LIKE '%عطور%' OR category LIKE '%باقات%') AND (category_id IS NULL OR category_id = '');
        UPDATE products SET category_id = 'cat_fashion', category = 'أزياء وإكسسوارات' WHERE (category LIKE '%أزياء%' OR category LIKE '%ملابس%' OR category LIKE '%إكسسوارات%') AND (category_id IS NULL OR category_id = '');
        UPDATE products SET category_id = 'cat_home', category = 'مستلزمات منزلية' WHERE (category LIKE '%منزل%' OR category LIKE '%ديكور%') AND (category_id IS NULL OR category_id = '');
        UPDATE products SET category_id = 'cat_beauty', category = 'صحة وجمال' WHERE (category LIKE '%صحة%' OR category LIKE '%جمال%' OR category LIKE '%عناية%') AND (category_id IS NULL OR category_id = '');
      `);

      // تهيئة مناطق الشحن الافتراضية إذا كان الجدول فارغاً
      const zonesCount = (this.db.prepare('SELECT count(*) as count FROM shipping_zones').get() as any)?.count || 0;
      if (zonesCount === 0) {
        const insertZone = this.db.prepare('INSERT INTO shipping_zones (id, name, cities_json, fee, free_over) VALUES (?, ?, ?, ?, ?)');
        insertZone.run('zone_central', 'المنطقة الوسطى (الرياض، القصيم، الخرج)', JSON.stringify(['الرياض', 'الخرج', 'بريدة', 'عنيزة']), 25, 200);
        insertZone.run('zone_western', 'المنطقة الغربية (جدة، مكة، المدينة)', JSON.stringify(['جدة', 'مكة المكرمة', 'المدينة المنورة', 'ينبع', 'الطائف']), 28, 250);
        insertZone.run('zone_eastern', 'المنطقة الشرقية (الدمام، الخبر، الأحساء)', JSON.stringify(['الدمام', 'الخبر', 'الأحساء', 'الجبيل']), 28, 250);
        insertZone.run('zone_other', 'سائر مناطق المملكة (الجنوبية والشمالية)', JSON.stringify(['أبها', 'خميس مشيط', 'تبوك', 'حائل', 'جازان', 'نجران']), 35, 300);
        console.log('[Database] Seeded initial shipping zones.');
      }

      // تهيئة وتأكيد جداول التسويق والكوبونات
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS coupons (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          discount_type TEXT NOT NULL DEFAULT 'PERCENTAGE',
          discount_value REAL NOT NULL,
          min_order_amount REAL DEFAULT 0,
          expires_at DATETIME,
          max_uses INTEGER DEFAULT 100,
          times_used INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS campaigns (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          template TEXT NOT NULL,
          media_path TEXT,
          status TEXT DEFAULT 'DRAFT',
          scheduled_at DATETIME,
          min_delay_sec INTEGER DEFAULT 20,
          max_delay_sec INTEGER DEFAULT 45,
          daily_limit INTEGER DEFAULT 200,
          audience_filter TEXT DEFAULT '{}',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS campaign_recipients (
          id TEXT PRIMARY KEY,
          campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
          contact_id TEXT REFERENCES contacts(id),
          phone TEXT,
          name TEXT,
          status TEXT DEFAULT 'PENDING',
          sent_at DATETIME,
          error_message TEXT
        );

        CREATE TABLE IF NOT EXISTS blocklist (
          phone TEXT PRIMARY KEY,
          reason TEXT DEFAULT 'OPT_OUT',
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // ترحيل أعمدة إضافية في جداول التسويق
      const campInfo = this.db.prepare('PRAGMA table_info(campaigns)').all() as any[];
      const campCols = new Set(campInfo.map((c) => c.name));
      if (!campCols.has('audience_filter')) {
        this.db.exec("ALTER TABLE campaigns ADD COLUMN audience_filter TEXT DEFAULT '{}'");
      }

      const coupInfo = this.db.prepare('PRAGMA table_info(coupons)').all() as any[];
      const coupCols = new Set(coupInfo.map((c) => c.name));
      if (!coupCols.has('min_order_amount')) {
        this.db.exec('ALTER TABLE coupons ADD COLUMN min_order_amount REAL DEFAULT 0');
      }
      if (!coupCols.has('is_active')) {
        this.db.exec('ALTER TABLE coupons ADD COLUMN is_active INTEGER DEFAULT 1');
      }
      if (!coupCols.has('created_at')) {
        this.db.exec('ALTER TABLE coupons ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
      }

      const recInfo = this.db.prepare('PRAGMA table_info(campaign_recipients)').all() as any[];
      const recCols = new Set(recInfo.map((c) => c.name));
      if (!recCols.has('phone')) {
        this.db.exec('ALTER TABLE campaign_recipients ADD COLUMN phone TEXT');
      }
      if (!recCols.has('name')) {
        this.db.exec('ALTER TABLE campaign_recipients ADD COLUMN name TEXT');
      }

      // إضافة كوبونات أولية إذا كان الجدول فارغاً
      const couponCount = (this.db.prepare('SELECT count(*) as count FROM coupons').get() as any)?.count || 0;
      if (couponCount === 0) {
        const insCoupon = this.db.prepare(`
          INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, expires_at, max_uses, times_used, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insCoupon.run('coup_welcome10', 'WELCOME10', 'PERCENTAGE', 10, 50, '2027-12-31', 500, 14, 1);
        insCoupon.run('coup_freeship', 'FREESHIP', 'FIXED', 25, 150, '2027-12-31', 200, 32, 1);
        insCoupon.run('coup_vip20', 'VIP20', 'PERCENTAGE', 20, 200, '2027-12-31', 50, 8, 1);
        console.log('[Database] Seeded initial marketing coupons: WELCOME10, FREESHIP, VIP20');
      }
    } catch (err: any) {
      console.warn('[Database] Migration note:', err.message);
    }
  }

  private applyInlineSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        status TEXT NOT NULL DEFAULT 'DISCONNECTED',
        proxy TEXT,
        agent_mode TEXT DEFAULT 'DISABLED',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        phone TEXT UNIQUE NOT NULL,
        name TEXT,
        avatar TEXT,
        notes TEXT,
        tags TEXT DEFAULT '[]',
        opted_out INTEGER DEFAULT 0,
        address_json TEXT,
        memory_summary TEXT,
        source TEXT DEFAULT 'WHATSAPP',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
        contact_id TEXT REFERENCES contacts(id) ON DELETE CASCADE,
        handler TEXT NOT NULL DEFAULT 'agent',
        state TEXT NOT NULL DEFAULT 'open',
        assignee TEXT,
        unread_count INTEGER DEFAULT 0,
        last_message_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
        direction TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'text',
        body TEXT,
        media_path TEXT,
        status TEXT DEFAULT 'SENT',
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        media TEXT DEFAULT '[]',
        category TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS variants (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
        sku TEXT UNIQUE NOT NULL,
        options_json TEXT DEFAULT '{}',
        price REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        stock_qty INTEGER DEFAULT 0,
        reserved_qty INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS license_keys (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
        key_code TEXT NOT NULL,
        status TEXT DEFAULT 'available',
        order_id TEXT,
        sold_at DATETIME
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        contact_id TEXT REFERENCES contacts(id) ON DELETE CASCADE,
        source TEXT DEFAULT 'agent',
        status TEXT DEFAULT 'NEW',
        payment_method TEXT DEFAULT 'PAYMENT_LINK',
        payment_link TEXT,
        payment_status TEXT DEFAULT 'PENDING',
        subtotal REAL NOT NULL,
        discount_amount REAL DEFAULT 0.0,
        shipping_fee REAL DEFAULT 0.0,
        total REAL NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
        variant_id TEXT,
        product_name TEXT NOT NULL,
        variant_desc TEXT,
        qty INTEGER NOT NULL,
        unit_price REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS agent_config (
        id TEXT PRIMARY KEY DEFAULT 'default',
        persona_name TEXT NOT NULL DEFAULT 'مساعد المتجر الذكي',
        tone TEXT NOT NULL DEFAULT 'friendly',
        languages TEXT DEFAULT '["ar", "en"]',
        system_instructions TEXT,
        max_discount_percent REAL DEFAULT 0.0,
        max_order_amount_auto REAL DEFAULT 200.0,
        daily_cost_limit REAL DEFAULT 10.0,
        provider TEXT DEFAULT 'gemini',
        model_name TEXT DEFAULT 'gemini-3.8-flash',
        api_key TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS knowledge_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        content TEXT NOT NULL,
        source TEXT DEFAULT 'OWNER_INPUT',
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS agent_runs (
        id TEXT PRIMARY KEY,
        conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
        user_input TEXT NOT NULL,
        context_used_json TEXT,
        tools_called_json TEXT,
        agent_output TEXT NOT NULL,
        prompt_tokens INTEGER DEFAULT 0,
        completion_tokens INTEGER DEFAULT 0,
        cost_estimate REAL DEFAULT 0.0,
        latency_ms INTEGER,
        confidence_score REAL,
        ts DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS outbound_queue (
        id TEXT PRIMARY KEY,
        session_id TEXT DEFAULT 'default',
        chat_id TEXT NOT NULL,
        type TEXT DEFAULT 'text',
        payload_json TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        idempotency_key TEXT UNIQUE,
        attempts INTEGER DEFAULT 0,
        last_error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inbound_events_queue (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        processed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[Database] Built-in DDL fallback applied successfully.');
  }

  private seedInitialDataIfEmpty() {
    // 1. التحقق من إعدادات الوكيل
    const agentConfigRow = this.db.prepare('SELECT id FROM agent_config WHERE id = ?').get('default');
    if (!agentConfigRow) {
      this.db.prepare(`
        INSERT INTO agent_config (
          id, persona_name, tone, languages, system_instructions,
          max_discount_percent, max_order_amount_auto, daily_cost_limit, provider, model_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'default',
        'مساعد المتجر الذكي',
        'friendly',
        JSON.stringify(['ar', 'en']),
        'أنت موظف مبيعات وخدمة عملاء ذكي في المتجر. تحدث بالعربية الفصحى المبسطة مع فهم كامل لكل اللهجات العربية. هدفك خدمة العميل وتقديم المنتجات بدقة، لا تقدم أي خصم إضافي غير معتمد في المتجر. إذا غضب العميل أو طلب التحدث مع موظف بشري قم بتحويله فوراً.',
        0.0, // 0% خصم بناءً على رغبة المالك
        200.0,
        10.0,
        'gemini',
        'gemini-3.8-flash'
      );
      console.log('[Database] Seeded default agent_config.');
    }

    // 2. التحقق من بنك المعرفة الافتراضي وتهيئته
    const kbCount = (this.db.prepare('SELECT count(*) as cnt FROM knowledge_items').get() as { cnt: number }).cnt;
    if (kbCount === 0) {
      const insertKb = this.db.prepare(`
        INSERT INTO knowledge_items (id, title, category, source_type, content, summary, priority, tokens_count, active, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'STORE_POLICY')
      `);

      insertKb.run(
        'kb_shipping_sa',
        'سياسة الشحن والتوصيل لجميع مناطق المملكة',
        'shipping',
        'text_faq',
        'نوفر الشحن السريع لكافة مناطق ومدن المملكة العربية السعودية عبر شركائنا المعتمدين (سمسا، أرامكس، سبل). مدة التوصيل داخل الرياض والمدن الكبرى 24-48 ساعة عمل، ولباقي المناطق من 2 إلى 4 أيام عمل. رسوم الشحن 25 ر.س للمنطقة الوسطى، 28 ر.س للمنطقة الغربية والشرقية، و35 ر.س للمناطق الأخرى. الشحن مجاني لجميع الطلبات التي تتجاوز 200 ر.س.',
        'تفاصيل رسوم ومدد الشحن للمدن السعودية وحد الشحن المجاني (200 ر.س)',
        5,
        135
      );

      insertKb.run(
        'kb_returns_warranty',
        'سياسة الاستبدال والاسترجاع والضمان الذهبي',
        'returns_warranty',
        'text_faq',
        'نلتزم بنظام التجارة الإلكترونية السعودي. يحق للعميل استرجاع المنتج خلال 7 أيام أو استبداله خلال 14 يوماً من الاستلام بشرط بقاء المنتج بغلافه الأصلي غير مفتوح أو مستخدم. يتحمل المتجر كافة تكاليف الإرجاع في حال وجود عيب مصنعي أو خطأ بالطلب. المنتجات الرقمية والتراخيص المفعلة لا يمكن استرجاعها بعد التسليم.',
        'مدة الاسترجاع 7 أيام والاستبدال 14 يوماً وشروط الضمان الذهبي',
        5,
        120
      );

      insertKb.run(
        'kb_payments_sa',
        'طرق الدفع والتحصيل المعتمدة',
        'payment_bank',
        'text_faq',
        'نقبل جميع وسائل الدفع المعتمدة في السعودية: بطاقات مدى، Apple Pay، فيزا وماستركارد عبر روابط الدفع الإلكتروني المباشرة والآمنة 100%. كما نوفر خيار التقسيط الميسر عبر تابي وتمارا (4 دفعات بدون فوائد)، إضافة إلى خيار التحويل البنكي المباشر لحساب المتجر في مصرف الراجحي والبنك الأهلي.',
        'وسائل الدفع: مدى، Apple Pay، البطاقات، تابي، تمارا، والتحويل البنكي',
        4,
        110
      );

      insertKb.run(
        'kb_work_hours',
        'ساعات العمل وأوقات خدمة العملاء',
        'hours_locations',
        'text_faq',
        'فريق خدمة العملاء متاح للرد على محادثات واتساب يومياً من السبت إلى الخميس من الساعة 9:00 صباحاً حتى 11:00 مساءً، ويوم الجمعة من 2:00 ظهراً حتى 11:00 مساءً. الطلبات المسجلة قبل الساعة 3:00 عصراً يتم تجهيزها وتسليمها لشركة الشحن في نفس اليوم.',
        'مواعيد خدمة العملاء بالواتساب ومواعيد الشحن الفوري بنفس اليوم',
        4,
        95
      );

      insertKb.run(
        'kb_order_tracking',
        'كيفية تتبع الشحنة وتعديل العنوان',
        'general',
        'text_faq',
        'بمجرد شحن طلبك، ستصلك رسالة واتساب آلية تحتوي على رقم التتبع ورابط مباشر لمتابعة مسار الشحنة. إذا كنت ترغب في تعديل عنوان التوصيل أو رقم المستلم، يمكنك إرسال العنوان الجديد في هذه المحادثة فوراً قبل تسليم الطلب لمندوب التوصيل.',
        'آلية تتبع الشحنات وتعديل بيانات العنوان قبل خروج الشحنة',
        3,
        90
      );

      console.log('[Database] Seeded initial advanced knowledge items.');
    }

    // 3. التحقق من مناطق الشحن الافتراضية
    const zoneCount = (this.db.prepare('SELECT count(*) as cnt FROM shipping_zones').get() as { cnt: number }).cnt;
    if (zoneCount === 0) {
      const insertZone = this.db.prepare(`
        INSERT INTO shipping_zones (id, name, cities_json, fee, free_over)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertZone.run('zone_1', 'المنطقة الرئيسية', JSON.stringify(['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة']), 5.0, 50.0);
      insertZone.run('zone_2', 'باقي المناطق والمحافظات', JSON.stringify(['أبها', 'تبوك', 'حائل', 'القصيم', 'جازان']), 8.0, 75.0);
      console.log('[Database] Seeded initial shipping zones.');
    }

    // 4. التحقق من وجود منتجات تجريبية للبدء الفوري
    const productCount = (this.db.prepare('SELECT count(*) as cnt FROM products').get() as { cnt: number }).cnt;
    if (productCount === 0) {
      const insertProd = this.db.prepare(`
        INSERT INTO products (id, name, type, description, media, category, active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const insertVariant = this.db.prepare(`
        INSERT INTO variants (id, product_id, sku, options_json, price, currency, stock_qty)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const insertKey = this.db.prepare(`
        INSERT INTO license_keys (id, product_id, key_code, status)
        VALUES (?, ?, ?, ?)
      `);

      // منتج فيزيائي: سماعات بلوتوث
      insertProd.run(
        'prod_1',
        'سماعة بلوتوث لاسلكية عازلة للضوضاء Pro',
        'physical',
        'سماعات لاسلكية تدعم عزل الضوضاء النشط ANC مع بطارية تدوم حتى 36 ساعة متواصلة ومقاومة للماء IPX5.',
        JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']),
        'إلكترونيات',
        1
      );
      insertVariant.run('var_1', 'prod_1', 'HP-PRO-BLK', JSON.stringify({ 'اللون': 'أسود ملكي' }), 45.0, 'USD', 25);
      insertVariant.run('var_2', 'prod_1', 'HP-PRO-WHT', JSON.stringify({ 'اللون': 'أبيض لؤلؤي' }), 45.0, 'USD', 18);

      // منتج رقمي: ترخيص برنامج إنتاجية سنوي
      insertProd.run(
        'prod_2',
        'ترخيص برنامج إدارة المبيعات الاحترافي (سنة واحدة)',
        'digital',
        'نسخة رقمية رسمية تتضمن ترخيصاً لمدة سنة كاملة مع التحديثات والدعم الفني، تسليم فوري بعد الدفع.',
        JSON.stringify(['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500']),
        'برمجيات وتراخيص',
        1
      );
      insertVariant.run('var_3', 'prod_2', 'SW-PRO-1Y', JSON.stringify({ 'الخطة': 'اشتراك 1 سنة' }), 29.0, 'USD', 100);

      // مفاتيح تراخيص تجريبية في المخزن
      insertKey.run('key_1', 'prod_2', 'SWPRO-2026-X98A-B47C', 'available');
      insertKey.run('key_2', 'prod_2', 'SWPRO-2026-K12M-Q89Z', 'available');
      insertKey.run('key_3', 'prod_2', 'SWPRO-2026-T55P-L03W', 'available');

      console.log('[Database] Seeded initial physical and digital products.');
    }
  }
}
