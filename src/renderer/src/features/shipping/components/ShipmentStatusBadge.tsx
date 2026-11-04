import React from 'react';
import { ShipmentStatus } from '../types/shipping.types';
import { STATUS_META } from '../constants/shipping.constants';

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

export const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const meta = STATUS_META[status] || STATUS_META.PREPARING;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${meta.bg} ${meta.text} ${meta.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} animate-pulse`} />
      {meta.label}
    </span>
  );
};

