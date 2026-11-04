import { AppDatabase } from '../../database/db';
import { AgentGuardrails } from '../guardrails/guardrails';

export class AgentToolExecutor {
  private static db = AppDatabase.getInstance().db;

  public static execute(name: string, args: Record<string, any>): any {
    console.log(`[ToolExecutor] Executing tool: ${name} with args:`, args);

    switch (name) {
      case 'search_catalog': {
        const query = `%${args.query || ''}%`;
        const products = this.db.prepare(`
          SELECT p.id, p.name, p.type, p.description, p.category,
                 min(v.price) as min_price, max(v.price) as max_price
          FROM products p
          LEFT JOIN variants v ON p.id = v.product_id
          WHERE p.active = 1 AND (p.name LIKE ? OR p.description LIKE ? OR p.category LIKE ?)
          GROUP BY p.id
          LIMIT 5
        `).all(query, query, query);
        return { count: products.length, products };
      }

      case 'get_product': {
        const product = this.db.prepare(`
          SELECT id, name, type, description, category, media FROM products WHERE id = ?
        `).get(args.productId) as any;

        if (!product) return { error: 'المنتج غير موجود' };

        const variants = this.db.prepare(`
          SELECT id, sku, options_json, price, currency, stock_qty, reserved_qty
          FROM variants WHERE product_id = ?
        `).all(args.productId);

        return {
          ...product,
          media: JSON.parse(product.media || '[]'),
          variants: variants.map((v: any) => ({
            ...v,
            options: JSON.parse(v.options_json || '{}'),
            available_qty: Math.max(0, v.stock_qty - v.reserved_qty),
          })),
        };
      }

      case 'check_stock': {
        const variant = this.db.prepare(`
          SELECT id, stock_qty, reserved_qty, price FROM variants WHERE id = ?
        `).get(args.variantId) as any;

        if (!variant) return { available: false, error: 'المتغير غير موجود' };
        const availableQty = Math.max(0, variant.stock_qty - variant.reserved_qty);
        return {
          available: availableQty > 0,
          available_qty: availableQty,
          price: variant.price,
        };
      }

      case 'get_shipping_quote': {
        const city = args.city || '';
        const zones = this.db.prepare('SELECT * FROM shipping_zones').all() as any[];

        for (const zone of zones) {
          const cities = JSON.parse(zone.cities_json || '[]');
          if (cities.some((c: string) => city.includes(c) || c.includes(city))) {
            return {
              zone_name: zone.name,
              fee: zone.fee,
              free_over: zone.free_over,
              estimated_days: '2-4 أيام عمل',
            };
          }
        }

        // تكلفة افتراضية لباقي المدن
        return {
          zone_name: 'شحن قياسي لكافة المدن',
          fee: 8.0,
          free_over: 70.0,
          estimated_days: '3-5 أيام عمل',
        };
      }

      case 'validate_coupon': {
        const coupon = this.db.prepare(`
          SELECT * FROM coupons WHERE code = ?
        `).get((args.code || '').trim().toUpperCase()) as any;

        if (!coupon) return { valid: false, error: 'كود الكوبون غير صحيح' };
        if (coupon.times_used >= coupon.max_uses) return { valid: false, error: 'الكوبون استنفد الحد الأقصى للاستخدام' };

        let discount = 0;
        if (coupon.discount_type === 'percentage') {
          discount = (args.subtotal * coupon.discount_value) / 100;
        } else {
          discount = Math.min(coupon.discount_value, args.subtotal);
        }

        return {
          valid: true,
          code: coupon.code,
          discount_amount: discount,
          new_subtotal: Math.max(0, args.subtotal - discount),
        };
      }

      case 'create_draft_order': {
        const variant = this.db.prepare(`
          SELECT v.*, p.name as product_name, p.type as product_type
          FROM variants v
          JOIN products p ON v.product_id = p.id
          WHERE v.id = ?
        `).get(args.variantId) as any;

        if (!variant) return { error: 'المتغير المطلوب غير موجود' };

        const qty = Math.max(1, parseInt(args.quantity) || 1);
        const subtotal = variant.price * qty;

        // تطبيق حواجز الأمان للحدود المالية
        const limitCheck = AgentGuardrails.validateOrderAmount(subtotal);
        if (!limitCheck.allowed) {
          return {
            error: limitCheck.reason,
            requires_human: true,
          };
        }

        // تسجيل أو تحديث جهة الاتصال
        let contact = this.db.prepare('SELECT id FROM contacts WHERE phone = ?').get(args.contactPhone) as any;
        const contactId = contact ? contact.id : `cnt_${Date.now()}`;

        if (!contact) {
          this.db.prepare(`
            INSERT INTO contacts (id, phone, name, address_json, source)
            VALUES (?, ?, ?, ?, 'WHATSAPP')
          `).run(contactId, args.contactPhone, args.contactName || '', JSON.stringify({ city: args.city, address: args.address }));
        }

        // احتساب الشحن إن كان المنتج فيزيائياً
        let shippingFee = 0;
        if (variant.product_type === 'physical') {
          shippingFee = subtotal >= 50 ? 0 : 5;
        }

        const total = subtotal + shippingFee;
        const orderId = `ord_${Date.now()}`;

        // إنشاء الطلب وحجز المخزون ضمن معاملة ذرية واحدة (Atomic Transaction)
        const createOrderTx = this.db.transaction(() => {
          this.db.prepare(`
            INSERT INTO orders (id, contact_id, source, status, payment_method, subtotal, shipping_fee, total, notes)
            VALUES (?, ?, 'agent', 'NEW', 'PAYMENT_LINK', ?, ?, ?, ?)
          `).run(orderId, contactId, subtotal, shippingFee, total, args.notes || '');

          this.db.prepare(`
            INSERT INTO order_items (id, order_id, variant_id, product_name, variant_desc, qty, unit_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(`item_${Date.now()}`, orderId, variant.id, variant.product_name, variant.sku, qty, variant.price);

          this.db.prepare(`
            UPDATE variants SET reserved_qty = reserved_qty + ? WHERE id = ?
          `).run(qty, variant.id);
        });

        createOrderTx();

        return {
          success: true,
          order_id: orderId,
          subtotal,
          shipping_fee: shippingFee,
          total,
          product_name: variant.product_name,
          qty,
          summary: `تم إنشاء الطلب #${orderId} بنجاح بإجمالي ${total}$`,
        };
      }

      case 'create_payment_link': {
        const order = this.db.prepare('SELECT id, total FROM orders WHERE id = ?').get(args.orderId) as any;
        if (!order) return { error: 'الطلب غير موجود' };

        // رابط دفع إلكتروني مخصص
        const paymentUrl = `https://checkout.mystore.com/pay/${order.id}?amount=${order.total}`;
        this.db.prepare('UPDATE orders SET payment_link = ? WHERE id = ?').run(paymentUrl, order.id);

        return {
          order_id: order.id,
          total: order.total,
          payment_url: paymentUrl,
        };
      }

      case 'get_order_status': {
        const order = this.db.prepare(`
          SELECT o.id, o.status, o.total, o.created_at, s.carrier, s.tracking_no, s.tracking_url
          FROM orders o
          JOIN contacts c ON o.contact_id = c.id
          LEFT JOIN shipments s ON o.id = s.order_id
          WHERE c.phone = ? ${args.orderId ? 'AND o.id = ?' : ''}
          ORDER BY o.created_at DESC LIMIT 1
        `).get(...(args.orderId ? [args.contactPhone, args.orderId] : [args.contactPhone])) as any;

        if (!order) return { found: false, message: 'لم يتم العثور على أي طلبات مسجلة بهذا الرقم' };

        return {
          found: true,
          order_id: order.id,
          status: order.status,
          total: order.total,
          carrier: order.carrier || 'قيد التجهيز',
          tracking_no: order.tracking_no || 'غير متوفر حالياً',
          tracking_url: order.tracking_url || '',
        };
      }

      case 'handoff_to_human': {
        return {
          handoff_triggered: true,
          reason: args.reason,
          summary: args.summary,
          message: 'تم تحويل المحادثة لأحد ممثلي خدمة العملاء وسيقوم بالرد عليك مباشرة.',
        };
      }

      default:
        return { error: `الأداة ${name} غير معروفة في النظام.` };
    }
  }
}
