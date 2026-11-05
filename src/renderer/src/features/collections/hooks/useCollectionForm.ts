import { useState, useCallback, useEffect } from 'react';
import { CollectionFormData, CollectionFormErrors } from '../types/collection.types';
import { DEFAULT_COLLECTION_FORM } from '../constants/collection.constants';

export function useCollectionForm(initialData?: Partial<CollectionFormData> | null) {
  const [formData, setFormData] = useState<CollectionFormData>(DEFAULT_COLLECTION_FORM);
  const [errors, setErrors] = useState<CollectionFormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...DEFAULT_COLLECTION_FORM,
        ...initialData,
        product_ids: initialData.product_ids || [],
      });
    } else {
      setFormData(DEFAULT_COLLECTION_FORM);
    }
    setErrors({});
  }, [initialData]);

  const handleChange = useCallback(<K extends keyof CollectionFormData>(field: K, value: CollectionFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && typeof value === 'string') {
        const autoSlug = value
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\u0600-\u06FF_-]/g, '');
        if (!prev.slug) {
          updated.slug = autoSlug;
        }
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const toggleProduct = useCallback((productId: string) => {
    setFormData((prev) => {
      const current = prev.product_ids || [];
      const exists = current.includes(productId);
      const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
      return { ...prev, product_ids: next };
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: CollectionFormErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'اسم المجموعة مطلوب';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_COLLECTION_FORM);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    handleChange,
    toggleProduct,
    validate,
    resetForm,
    setFormData,
  };
}
