import React from 'react';
import { Share2, Camera, AtSign, Video, Globe } from 'lucide-react';
import { StoreIdentity } from '../../types/settings.types';

interface SocialLinksCardProps {
  identity: StoreIdentity;
  onChange: (updated: StoreIdentity) => void;
}

export const SocialLinksCard: React.FC<SocialLinksCardProps> = ({ identity, onChange }) => {
  const links = identity.socialLinks || {};

  const updateLink = (key: keyof NonNullable<StoreIdentity['socialLinks']>, val: string) => {
    onChange({
      ...identity,
      socialLinks: { ...links, [key]: val },
    });
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">قنوات التواصل الاجتماعي</h3>
          <p className="text-[11px] text-slate-400">حسابات المتجر الرسمية لإتاحة مشاركتها التلقائية في المحادثات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Instagram
          </label>
          <div className="relative">
            <Camera className="w-3.5 h-3.5 text-pink-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              dir="ltr"
              value={links.instagram || ''}
              onChange={(e) => updateLink('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-medium text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            منصة X (تويتر سابقاً)
          </label>
          <div className="relative">
            <AtSign className="w-3.5 h-3.5 text-sky-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              dir="ltr"
              value={links.twitter || ''}
              onChange={(e) => updateLink('twitter', e.target.value)}
              placeholder="https://x.com/..."
              className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-medium text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            TikTok
          </label>
          <div className="relative">
            <Video className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              dir="ltr"
              value={links.tiktok || ''}
              onChange={(e) => updateLink('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@..."
              className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-medium text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Snapchat
          </label>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 text-amber-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              dir="ltr"
              value={links.snapchat || ''}
              onChange={(e) => updateLink('snapchat', e.target.value)}
              placeholder="https://snapchat.com/add/..."
              className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-medium text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
