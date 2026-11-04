import { useState } from 'react';
import { CreateCouponFormData } from '../types/marketing.types';

export function useCreateCouponForm(
  onSubmit: (data: CreateCouponFormData) => Promise<{ success: boolean; error?: string }>,
  onClose: () => void
) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(50);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountValue <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await onSubmit({
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_amount: Number(minOrderAmount) || 0,
        max_uses: Number(maxUses) || 100,
        expires_at: expiresAt || undefined,
      });
      if (res.success) {
        onClose();
        setCode('');
      } else {
        alert(res.error || 'حدث خطأ أثناء حفظ الكوبون');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    code,
    setCode,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    minOrderAmount,
    setMinOrderAmount,
    maxUses,
    setMaxUses,
    expiresAt,
    setExpiresAt,
    isSubmitting,
    handleSubmit,
  };
}

