import React from 'react';
import { ProductFormModal } from './modals/ProductFormModal';
import { ProductFormData } from '../types/products.types';

interface EditProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ProductFormData) => void;
  onSubmit?: (data: ProductFormData) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  onSubmit,
}) => {
  const handleSubmit = (data: ProductFormData) => {
    onSave?.(data);
    onSubmit?.(data);
  };

  return (
    <ProductFormModal
      isOpen={isOpen}
      initialData={product}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
};
