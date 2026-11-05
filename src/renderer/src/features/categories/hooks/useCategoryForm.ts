import { useState, useCallback, useEffect } from 'react';
import { CategoryFormData, CategoryFormErrors } from '../types/category.types';
import { DEFAULT_CATEGORY_FORM } from '../constants/category.constants';

export function useCategoryForm(initialData?: Partial<CategoryFormData> | null) {
  const [formData, setFormData] = useState<CategoryFormData>(DEFAULT_CATEGORY_FORM);
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...DEFAULT_CATEGORY_FORM,
        ...initialData,
        slug: initialData.slug || '',
      });
    } else {
      setFormData(DEFAULT_CATEGORY_FORM);
    }
    setErrors({});
  }, [initialData]);

  const handleChange = useCallback(<K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // توليد الرمز التعريفي (Slug) تلقائياً عند كتابة الاسم إذا كان فارغاً أو كان اسماً جديداً
      if (field === 'name' && !prev.id && typeof value === 'string') {
        const autoSlug = value
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\u0600-\u06FF_-]/g, '');
        if (!prev.slug || prev.slug === '') {
          updated.slug = autoSlug;
        }
      }
      return updated;
    });

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: CategoryFormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'اسم الفئة مطلوب';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_CATEGORY_FORM);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    handleChange,
    validate,
    resetForm,
    setFormData,
  };
}
