import React from 'react';
import { FileBadge2, Receipt, Building2 } from 'lucide-react';
import { StoreIdentity } from '../../types/settings.types';

interface LegalTaxCardProps {
  identity: StoreIdentity;
  onChange: (updated: StoreIdentity) => void;
}

export const LegalTaxCard: React.FC<LegalTaxCardProps> = ({ identity, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <FileBadge2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">البيانات القانونية والضريبية</h3>
          <p className="text-[11px] text-slate-400">السجل التجاري والأرقام الضريبية المطابقة لهيئة الزكاة (ZATCA)</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم السجل التجاري (CR)
            </label>
            <input
              type="text"
              dir="ltr"
              value={identity.commercialRegistration || ''}
              onChange={(e) => onChange({ ...identity, commercialRegistration: e.target.value })}
              placeholder="1010xxxxxx"
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              الرقم الضريبي (VAT - 15 رقماً)
            </label>
            <input
              type="text"
              dir="ltr"
              value={identity.taxNumber || ''}
              onChange={(e) => onChange({ ...identity, taxNumber: e.target.value })}
              placeholder="3102xxxxxxxxxxx"
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            رقم ترخيص المركز السعودي للأعمال (SBC) / معروف
          </label>
          <input
            type="text"
            dir="ltr"
            value={identity.sbcLicense || ''}
            onChange={(e) => onChange({ ...identity, sbcLicense: e.target.value })}
            placeholder="SBC-000xxxxx"
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
          />
        </div>

        <div className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">طباعة البيانات في فواتير الواتساب</h4>
              <p className="text-[11px] text-slate-400">إدراج الرقم الضريبي والسجل في الفواتير التلقائية</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={identity.showTaxOnInvoice}
            onChange={(e) => onChange({ ...identity, showTaxOnInvoice: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

