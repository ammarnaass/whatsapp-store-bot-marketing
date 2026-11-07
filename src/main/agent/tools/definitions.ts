import { FunctionDeclaration, Type } from '@google/genai';

/**
 * مواصفات الأدوات التي يستدعيها وكيل الذكاء الاصطناعي (Function Calling Tools)
 * متوافقة مع أحدث حزمة من @google/genai
 */
export const agentToolsDefinitions: FunctionDeclaration[] = [
  {
    name: 'search_catalog',
    description: 'ابحث في منتجات المتجر المتاحة (فيزيائية أو رقمية) بالاسم أو الفئة أو الحد الأقصى للميزانية.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'كلمة البحث (مثال: سماعات، برنامج، كابل، ترخيص)',
        },
        category: {
          type: Type.STRING,
          description: 'فئة المنتج (اختياري)',
        },
        maxPrice: {
          type: Type.NUMBER,
          description: 'الحد الأقصى للسعر بالدولار (اختياري)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product',
    description: 'جلب تفاصيل منتج محدد ومتغيراته (ألوان، مقاسات، أو خطط تراخيص) والأسعار والمخزون الحي.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: {
          type: Type.STRING,
          description: 'معرف المنتج المطلوب',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'check_stock',
    description: 'التحقق من توفر كمية معينة في المخزون لمتغير محدد قبل تأكيد الطلب.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        variantId: {
          type: Type.STRING,
          description: 'معرف المتغير',
        },
      },
      required: ['variantId'],
    },
  },
  {
    name: 'get_shipping_quote',
    description: 'احتساب تكلفة الشحن ومطابقة الدولة والولاية/المحافظة والمدينة مع شركات وأسعار التوصيل (منزلي أو مكتبي Stop Desk).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        city: {
          type: Type.STRING,
          description: 'اسم المدينة أو البلدية',
        },
        state: {
          type: Type.STRING,
          description: 'اسم أو رقم الولاية أو المحافظة (مثال: وهران، 16، الرياض، مكة)',
        },
        country: {
          type: Type.STRING,
          description: 'رمز أو اسم الدولة (مثال: DZ، SA، الجزائر، السعودية)',
        },
        delivery_type: {
          type: Type.STRING,
          description: 'نوع التوصيل: home (للمنزل) أو desk (استلام من المكتب Stop Desk)',
        },
      },
    },
  },
  {
    name: 'validate_coupon',
    description: 'التحقق من صحة وصلاحية كود خصم أو كوبون أدخله العميل.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        code: {
          type: Type.STRING,
          description: 'كود الكوبون',
        },
        subtotal: {
          type: Type.NUMBER,
          description: 'إجمالي قيمة سلة المشتريات قبل الخصم',
        },
      },
      required: ['code', 'subtotal'],
    },
  },
  {
    name: 'create_draft_order',
    description: 'إنشاء مسودة طلب بعد جمع بيانات العميل والعنوان والمنتجات المختارة، وحجز المخزون مؤقتاً.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        contactPhone: {
          type: Type.STRING,
          description: 'رقم هاتف العميل',
        },
        contactName: {
          type: Type.STRING,
          description: 'اسم العميل الكامل',
        },
        address: {
          type: Type.STRING,
          description: 'عنوان التوصيل بالتفصيل (للمنتجات الفيزيائية)',
        },
        city: {
          type: Type.STRING,
          description: 'المدينة',
        },
        variantId: {
          type: Type.STRING,
          description: 'معرف متغير المنتج المطلوب',
        },
        quantity: {
          type: Type.INTEGER,
          description: 'الكمية المطلوبة',
        },
        notes: {
          type: Type.STRING,
          description: 'ملاحظات إضافية على الطلب',
        },
      },
      required: ['contactPhone', 'variantId', 'quantity'],
    },
  },
  {
    name: 'create_payment_link',
    description: 'توليد رابط الدفع الإلكتروني المخصص للطلب لإرساله للعميل داخل المحادثة.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: {
          type: Type.STRING,
          description: 'معرف الطلب المراد إصدار رابط دفع له',
        },
      },
      required: ['orderId'],
    },
  },
  {
    name: 'get_order_status',
    description: 'الاستعلام عن حالة طلب العميل ورقم التتبع إن وجد.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: {
          type: Type.STRING,
          description: 'رقم أو معرف الطلب',
        },
        contactPhone: {
          type: Type.STRING,
          description: 'رقم هاتف العميل للتحقق من ملكية الطلب',
        },
      },
      required: ['contactPhone'],
    },
  },
  {
    name: 'handoff_to_human',
    description: 'تحويل المحادثة فوراً إلى موظف بشري عند غضب العميل أو طلبه الصريح أو حدوث تعذر في الفهم.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        reason: {
          type: Type.STRING,
          description: 'سبب التحويل (مثال: طلب موظف، عميل غاضب، مفاوضة خارج الحدود)',
        },
        summary: {
          type: Type.STRING,
          description: 'ملخص موجز لسياق المحادثة واحتياج العميل لتقديمه للموظف',
        },
      },
      required: ['reason', 'summary'],
    },
  },
];
