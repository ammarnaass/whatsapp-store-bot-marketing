import React from 'react';
import { Truck, Edit2, Trash2, MapPin, Globe, ChevronLeft } from 'lucide-react';
import { ShippingZone } from '../../types/shipping.types';
import { getCountryByCode } from '@shared/shipping/countries.data';
import { getStateName } from '@shared/shipping/states-registry';

interface Props {
  zone: ShippingZone;
  onManageMethods: (zone: ShippingZone) => void;
  onEdit: (zone: ShippingZone) => void;
  onDelete: (id: string) => void;
}

export const ShippingZoneCard: React.FC<Props> = ({ zone, onManageMethods, onEdit, onDelete }) => {
  const country = getCountryByCode(zone.country_code);
  const methods = zone.methods || [];
  const activeCount = methods.filter((m) => m.is_active).length;
  const states = zone.states || [];

  const coverageText = () => {
    if (zone.scope_type === 'specific_states' && states.length > 0) {
      const names = states.slice(0, 3).map((st) => getStateName(zone.country_code, st));
      return `${states.length} ولاية (${names.join('، ')}${states.length > 3 ? '...' : ''})`;
    }
    if (zone.scope_type === 'specific_cities' && zone.cities && zone.cities.length > 0) {
      return `${zone.cities.length} مدينة (${zone.cities.slice(0, 3).join('، ')}${zone.cities.length > 3 ? '...' : ''})`;
    }
    return 'كافة أرجاء الدولة (شحن شامل)';
  };

  return (
    <div className="p-4 bg-card rounded-2xl border border-border shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none" title={country.name}>{country.flag}</span>
            <div>
              <h4 className="font-extrabold text-sm text-foreground leading-tight">{zone.name}</h4>
              <span className="text-[11px] font-semibold text-muted-foreground">{country.name} ({zone.country_code})</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(zone)} className="p-1.5 text-muted-foreground hover:text-blue-500 rounded-lg hover:bg-muted" title="تعديل">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(zone.id)} className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-muted" title="حذف">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {zone.scope_type === 'specific_states' ? <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> : <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
          <span className="truncate font-medium">{coverageText()}</span>
        </div>

        <div className="pt-2 border-t border-border/80">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-bold">
            <span className="text-muted-foreground">الشركات والتسعيرات:</span>
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full font-mono">{activeCount} نشطة</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {methods.length === 0 ? (
              <span className="text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">لم تتم إضافة شركات بعد</span>
            ) : (
              methods.map((m) => (
                <span key={m.id} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${m.is_active ? 'bg-muted text-foreground border-border' : 'bg-muted/40 text-muted-foreground line-through'}`}>
                  {m.name} (🏠 {m.cost}{m.desk_cost != null ? ` | 🏢 ${m.desk_cost}` : ''} {m.currency})
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <button onClick={() => onManageMethods(zone)} className="w-full h-8.5 mt-2 px-3 rounded-xl bg-foreground hover:bg-primary text-background hover:text-primary-foreground text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
        <Truck className="w-4 h-4" /> <span>إدارة شركات الشحن والأسعار</span> <ChevronLeft className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
