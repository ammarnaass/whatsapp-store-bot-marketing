import { useState, useCallback, useEffect } from 'react';
import { KnowledgeFormData, KnowledgeFormErrors, KnowledgeItem } from '../types/knowledge.types';
import { DEFAULT_KNOWLEDGE_FORM } from '../constants/knowledge.constants';

export function useKnowledgeForm(initialItem?: KnowledgeItem | null) {
  const [formData, setFormData] = useState<KnowledgeFormData>(DEFAULT_KNOWLEDGE_FORM);
  const [errors, setErrors] = useState<KnowledgeFormErrors>({});

  useEffect(() => {
    if (initialItem) {
      setFormData({
        id: initialItem.id,
        title: initialItem.title || '',
        category: initialItem.category || 'shipping',
        source_type: initialItem.source_type || 'text_faq',
        content: initialItem.content || '',
        summary: initialItem.summary || '',
        source_url: initialItem.source_url || '',
        file_path: initialItem.file_path || '',
        priority: initialItem.priority || 3,
        active: initialItem.active !== false,
      });
    } else {
      setFormData(DEFAULT_KNOWLEDGE_FORM);
    }
    setErrors({});
  }, [initialItem]);

  const handleChange = useCallback(<K extends keyof KnowledgeFormData>(field: K, value: KnowledgeFormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'content' && !prev.summary && typeof value === 'string') {
        next.summary = value.slice(0, 120);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const errs: KnowledgeFormErrors = {};
    if (!formData.title.trim()) errs.title = 'عنوان الوثيقة أو الموضوع مطلوب';
    if (!formData.content.trim()) errs.content = 'محتوى المعرفة أو الإجابة مطلوبة';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_KNOWLEDGE_FORM);
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

