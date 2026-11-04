import { useState, useMemo, useEffect, useCallback } from 'react';
import { ProductFormData, ProductFormErrors } from '../types/products.types';
import { DEFAULT_PRODUCT_FORM } from '../constants/products.constants';
import { analyzeProfitability } from '../utils/profit-calculator';

export type ProductFormTab = 'basic' | 'pricing' | 'shipping' | 'inventory' | 'media';

export function useProductForm(initialData?: Partial<ProductFormData> | null) {
  const [formData, setFormData] = useState<ProductFormData>(() => ({
    ...DEFAULT_PRODUCT_FORM,
    ...(initialData || {}),
  }));

  const [activeTab, setActiveTab] = useState<ProductFormTab>('basic');
  const [errors, setErrors] = useState<ProductFormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...DEFAULT_PRODUCT_FORM,
        ...initialData,
      });
    } else {
      setFormData(DEFAULT_PRODUCT_FORM);
    }
  }, [initialData]);

  const updateField = useCallback(<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field as keyof ProductFormErrors] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const profitAnalysis = useMemo(() => {
    return analyzeProfitability(
      formData.price,
      formData.cost_price,
      formData.tax_rate,
      formData.is_tax_inclusive,
      formData.length,
      formData.width,
      formData.height
    );
  }, [formData.price, formData.cost_price, formData.tax_rate, formData.is_tax_inclusive, formData.length, formData.width, formData.height]);

  const validate = useCallback((): boolean => {
    const errs: ProductFormErrors = {};
    if (!formData.name.trim()) errs.name = 'اسم المنتج مطلوب';
    if (formData.price < 0) errs.price = 'سعر البيع لا يمكن أن يكون سالباً';
    if (formData.cost_price < 0) errs.cost_price = 'سعر التكلفة لا يمكن أن يكون سالباً';
    if (formData.stock < 0) errs.stock = 'الكمية لا يمكن أن تكون سالبة';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(DEFAULT_PRODUCT_FORM);
    setErrors({});
    setActiveTab('basic');
  }, []);

  return {
    formData,
    setFormData,
    updateField,
    profitAnalysis,
    activeTab,
    setActiveTab,
    errors,
    validate,
    reset,
  };
}

