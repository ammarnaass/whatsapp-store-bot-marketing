import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { Product, Order } from '../../../../shared/types';

export function useStoreData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const prods = await api.catalog.listProducts();
      const ords = await api.orders.list();
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createProduct = async (productData: {
    name: string;
    type: 'physical' | 'digital';
    description: string;
    price: number;
    stock: number;
  }) => {
    await api.catalog.createProduct({
      name: productData.name,
      type: productData.type,
      description: productData.description,
      media: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500'],
      category: productData.type === 'digital' ? 'برمجيات وتراخيص' : 'إلكترونيات',
      variants: [
        {
          id: `var_${Date.now()}`,
          product_id: '',
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          options: {},
          price: productData.price,
          currency: 'USD',
          stock_qty: productData.stock,
          reserved_qty: 0,
        },
      ],
    });
    await loadData();
  };

  return { products, orders, isLoading, createProduct, refresh: loadData };
}
