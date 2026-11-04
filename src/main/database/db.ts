import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

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
  }

  private applyInlineSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        status TEXT NOT NULL DEFAULT 'DISCONNECTED',
        proxy TEXT,
        agent_mode TEXT DEFAULT 'AUTONOMOUS',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        phone TEXT UNIQUE NOT NULL,
        name TEXT,
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

    // 2. التحقق من بنك المعرفة الافتراضي
    const kbCount = (this.db.prepare('SELECT count(*) as cnt FROM knowledge_items').get() as { cnt: number }).cnt;
    if (kbCount === 0) {
      const insertKb = this.db.prepare(`
        INSERT INTO knowledge_items (id, title, category, content, source)
        VALUES (?, ?, ?, ?, ?)
      `);

      insertKb.run(
        'kb_1',
        'سياسة الشحن والتوصيل',
        'shipping',
        'الشحن متوفر لجميع المدن الرئيسية. مدة التوصيل داخل العاصمة 24-48 ساعة، وباقي المدن من 2 إلى 4 أيام عمل. الشحن مجاني للطلبات التي تزيد عن 50 دولار.',
        'OWNER_INPUT'
      );

      insertKb.run(
        'kb_2',
        'سياسة الاسترجاع والاستبدال',
        'return_policy',
        'يمكن استرجاع أو استبدال المنتجات الفيزيائية خلال 14 يوماً من تاريخ الاستلام بشرط أن تكون في حالتها وتغليفها الأصلي. المنتجات الرقمية والتراخيص المفعلة غير قابلة للاسترجاع بعد التسليم.',
        'OWNER_INPUT'
      );

      insertKb.run(
        'kb_3',
        'طرق الدفع المتاحة',
        'faq',
        'نوفر الدفع عبر روابط الدفع الإلكترونية السريعة والآمنة (Custom Payment Link) التي نرسلها لك مباشرة في المحادثة، إضافة إلى التحويل البنكي المباشر والدفع عند الاستلام للمنتجات الفيزيائية.',
        'OWNER_INPUT'
      );

      console.log('[Database] Seeded initial knowledge items.');
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
