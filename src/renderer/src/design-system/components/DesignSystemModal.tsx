import React, { useState } from 'react';
import { X, Palette, Type, Layers, Box } from 'lucide-react';
import { ColorPaletteSection } from './ColorPaletteSection';
import { TypographyScaleSection } from './TypographyScaleSection';
import { ComponentTokensSection } from './ComponentTokensSection';
import { ELEVATION_SCALE } from '../constants/elevation.constants';
import { useThemeStore } from '../../features/theme';
import { useCustomization } from '../../features/customization';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'colors' | 'typography' | 'components' | 'elevation';

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const { isDark, toggleTheme } = useThemeStore();
  const { settings, setAccentColor } = useCustomization();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* شريط الرأس */}
        <div className="p-4 border-b border-slate-200 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                نظام تصميم واسل المعياري والألوان (WaSell Design System)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                المعايير البصرية، لوحات الألوان، الإيقاع الطباعي، ومستويات الارتفاع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* أشرطة التبويب */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-200 dark:border-[#1F293D] bg-slate-50/50 dark:bg-slate-900/30">
          {[
            { id: 'colors', label: 'لوحات الألوان والسمات', icon: Palette },
            { id: 'typography', label: 'سلم الخط العربي', icon: Type },
            { id: 'components', label: 'المكونات والشارات', icon: Box },
            { id: 'elevation', label: 'مستويات الارتفاع والظلال', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* محتوى التبويب */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'colors' && (
            <ColorPaletteSection
              currentPaletteId={settings.accentColor}
              onSelectPalette={(id) => setAccentColor(id)}
            />
          )}
          {activeTab === 'typography' && <TypographyScaleSection />}
          {activeTab === 'components' && <ComponentTokensSection />}
          {activeTab === 'elevation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ELEVATION_SCALE.map((el) => (
                <div
                  key={el.level}
                  style={{ boxShadow: isDark ? el.darkShadow : el.shadow }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]"
                >
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {el.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    {el.purpose}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 truncate">
                    {el.shadow}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

