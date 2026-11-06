-- إعدادات الأداء الفائق لقاعدة البيانات SQLite
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA synchronous = NORMAL;

-- 1. الجلسات وأرقام الواتساب
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'DISCONNECTED',
    proxy TEXT,
    agent_mode TEXT DEFAULT 'AUTONOMOUS',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. جهات الاتصال والعملاء مع ذاكرة الوكيل
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

-- 3. المحادثات وحالة المسؤول عنها
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

-- 4. الرسائل
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

-- 5. إعدادات وكيل الذكاء الاصطناعي وحدود الأمان
CREATE TABLE IF NOT EXISTS agent_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    persona_name TEXT NOT NULL DEFAULT 'مساعد المتجر الذكي',
    tone TEXT NOT NULL DEFAULT 'friendly',
    languages TEXT DEFAULT '["ar", "en"]',
    system_instructions TEXT DEFAULT 'أنت موظف مبيعات وخدمة عملاء ذكي في المتجر. تحدث بالعربية الفصحى المبسطة مع فهم كامل لكل اللهجات العربية. هدفك خدمة العميل وتقديم المنتجات بدقة، لا تقدم أي خصم إضافي غير معتمد في المتجر. إذا غضب العميل أو طلب التحدث مع موظف بشري قم بتحويله فوراً.',
    max_discount_percent REAL DEFAULT 0.0,
    max_order_amount_auto REAL DEFAULT 200.0,
    daily_cost_limit REAL DEFAULT 10.0,
    provider TEXT DEFAULT 'gemini',
    model_name TEXT DEFAULT 'gemini-2.5-flash',
    api_key TEXT,
    api_keys_json TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. بنك المعرفة والأسئلة الشائعة وسياسات المتجر
CREATE TABLE IF NOT EXISTS knowledge_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    source_type TEXT DEFAULT 'text_faq',
    content TEXT NOT NULL,
    source TEXT DEFAULT 'OWNER_INPUT',
    summary TEXT,
    source_url TEXT,
    file_path TEXT,
    tokens_count INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 3,
    active INTEGER DEFAULT 1,
    hit_count INTEGER DEFAULT 0,
    last_used_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. سجل تشغيل وقرارات الوكيل (Decision Audit Log)
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

-- 8. تقييم وتصحيح أداء الوكيل (Human Review & RLHF)
CREATE TABLE IF NOT EXISTS agent_reviews (
    id TEXT PRIMARY KEY,
    run_id TEXT REFERENCES agent_runs(id) ON DELETE CASCADE,
    rating TEXT NOT NULL,
    correction_text TEXT,
    applied_to_kb INTEGER DEFAULT 0,
    reviewed_by TEXT,
    reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8.5. فئات وتصنيفات المنتجات
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

-- 9. المنتجات
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    media TEXT DEFAULT '[]',
    category TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. متغيرات المنتجات والمخزون
CREATE TABLE IF NOT EXISTS variants (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    options_json TEXT DEFAULT '{}',
    price REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    stock_qty INTEGER NOT NULL DEFAULT 0,
    reserved_qty INTEGER NOT NULL DEFAULT 0
);

-- 10.5. المجموعات التسويقية والذكية
CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    banner_url TEXT,
    icon TEXT DEFAULT 'Sparkles',
    color TEXT DEFAULT '#7C3AED',
    is_smart INTEGER DEFAULT 0,
    rules_json TEXT DEFAULT '{}',
    active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_collections (
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    collection_id TEXT REFERENCES collections(id) ON DELETE CASCADE,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, collection_id)
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_prod_collections_prod ON product_collections(product_id);
CREATE INDEX IF NOT EXISTS idx_prod_collections_coll ON product_collections(collection_id);

-- 10.6. إعدادات وبوابة بوت تليغرام
CREATE TABLE IF NOT EXISTS telegram_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    bot_token TEXT,
    bot_username TEXT,
    bot_first_name TEXT,
    is_active INTEGER DEFAULT 0,
    auto_reply INTEGER DEFAULT 1,
    webhook_mode INTEGER DEFAULT 0,
    webhook_url TEXT,
    last_sync_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10.7. إعدادات وبوابة واتساب السحابية الرسمية (Meta WhatsApp Cloud API)
CREATE TABLE IF NOT EXISTS whatsapp_cloud_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    phone_number_id TEXT,
    wbaid TEXT,
    access_token TEXT,
    verify_token TEXT DEFAULT 'wasell_webhook_token_2026',
    webhook_url TEXT DEFAULT 'http://127.0.0.1:3005/webhook/whatsapp',
    active_provider TEXT DEFAULT 'openwa_gateway',
    is_active INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. الأصول والتراخيص الرقمية
CREATE TABLE IF NOT EXISTS digital_assets (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    file_path TEXT,
    download_url_template TEXT
);

-- 12. مخزن مفاتيح التراخيص
CREATE TABLE IF NOT EXISTS license_keys (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    key_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    order_id TEXT,
    sold_at DATETIME
);

-- 13. مناطق الشحن
CREATE TABLE IF NOT EXISTS shipping_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cities_json TEXT NOT NULL DEFAULT '[]',
    fee REAL NOT NULL DEFAULT 0.0,
    free_over REAL
);

-- 14. الطلبات
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    contact_id TEXT REFERENCES contacts(id),
    source TEXT NOT NULL DEFAULT 'agent',
    status TEXT NOT NULL DEFAULT 'NEW',
    payment_method TEXT NOT NULL DEFAULT 'PAYMENT_LINK',
    payment_link TEXT,
    payment_status TEXT DEFAULT 'PENDING',
    subtotal REAL NOT NULL,
    discount_amount REAL DEFAULT 0.0,
    shipping_fee REAL DEFAULT 0.0,
    total REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 15. عناصر الطلب
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES variants(id),
    product_name TEXT NOT NULL,
    variant_desc TEXT,
    qty INTEGER NOT NULL,
    unit_price REAL NOT NULL
);

-- 16. الشحنات والتتبع
CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    address_json TEXT NOT NULL,
    carrier TEXT,
    tracking_no TEXT,
    tracking_url TEXT,
    status TEXT DEFAULT 'PREPARING',
    shipped_at DATETIME,
    delivered_at DATETIME
);

-- 17. المرتجعات
CREATE TABLE IF NOT EXISTS returns (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    reason TEXT,
    status TEXT DEFAULT 'REQUESTED',
    restocked INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 18. الفواتير
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    pdf_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 19. الكوبونات
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value REAL NOT NULL,
    expires_at DATETIME,
    max_uses INTEGER DEFAULT 100,
    times_used INTEGER DEFAULT 0
);

-- 20. الحملات التسويقية
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 21. مستلمو الحملات
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id TEXT PRIMARY KEY,
    campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id TEXT REFERENCES contacts(id),
    status TEXT DEFAULT 'PENDING',
    sent_at DATETIME,
    error_message TEXT
);

-- 22. قائمة الحظر والانسحاب
CREATE TABLE IF NOT EXISTS blocklist (
    phone TEXT PRIMARY KEY,
    reason TEXT DEFAULT 'OPT_OUT',
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 23. سجل التدقيق
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details_json TEXT,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 24. طابور الرسائل الصادرة الدائم (Outbound Queue)
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

-- 25. طابور الأحداث الواردة الدائم (Inbound Events Queue)
CREATE TABLE IF NOT EXISTS inbound_events_queue (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    processed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 26. إعدادات المتجر وهوية العلامة التجارية وبوابات الدفع والشحن
CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 27. المستخدمون وإدارة الحسابات وفريق العمل
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner',
    permissions TEXT DEFAULT '["*"]',
    phone TEXT,
    avatar TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_by TEXT REFERENCES users(id),
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 28. سجل تدقيق حركات وتعديلات المخزون
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

-- 29. جلسات دخول المستخدمين وتأمين الحسابات
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    device_name TEXT,
    ip_address TEXT,
    expires_at DATETIME NOT NULL,
    is_active INTEGER DEFAULT 1,
    last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- الفهارس
CREATE INDEX IF NOT EXISTS idx_inventory_logs_variant ON inventory_logs(variant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_messages_conv_ts ON messages(conversation_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON variants(sku);
CREATE INDEX IF NOT EXISTS idx_agent_runs_conv_ts ON agent_runs(conversation_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_items(category, active);
CREATE INDEX IF NOT EXISTS idx_outbound_queue_status ON outbound_queue(status, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_inbound_queue_processed ON inbound_events_queue(processed, created_at ASC);
