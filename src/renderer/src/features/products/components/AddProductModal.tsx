import React from 'react';
import { ProductFormModal } from './modals/ProductFormModal';
import { ProductFormData } from '../types/products.types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductFormData) => void;
  onAddProduct?: (data: ProductFormData) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onAddProduct,
}) => {
  const handleSubmit = (data: ProductFormData) => {
    onSubmit?.(data);
    onAddProduct?.(data);
  };

  return (
    <ProductFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
};
