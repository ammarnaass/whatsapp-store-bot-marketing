import React, { useState } from 'react';
import { StoreIdentity } from '../types/settings.types';
import {
  IdentityHeader,
  BrandIdentityCard,
  LegalTaxCard,
  StoreContactCard,
  RegionalLocaleCard,
  SocialLinksCard,
  UploadLogoModal,
} from './identity';

interface StoreIdentitySectionProps {
  identity: StoreIdentity;
  onChange: (updated: StoreIdentity) => void;
  onTestSync: () => void;
  isTestingSync: boolean;
}

export const StoreIdentitySection: React.FC<StoreIdentitySectionProps> = ({
  identity,
  onChange,
  onTestSync,
  isTestingSync,
}) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <IdentityHeader
        identity={identity}
        onTestSync={onTestSync}
        isTestingSync={isTestingSync}
      />

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Brand & Visuals (Span 7) */}
        <div className="xl:col-span-7">
          <BrandIdentityCard
            identity={identity}
            onChange={onChange}
            onOpenLogoModal={() => setIsLogoModalOpen(true)}
          />
        </div>

        {/* Legal & Taxes (Span 5) */}
        <div className="xl:col-span-5">
          <LegalTaxCard identity={identity} onChange={onChange} />
        </div>

        {/* Contact & Location (Span 6) */}
        <div className="xl:col-span-6">
          <StoreContactCard
            identity={identity}
            onChange={onChange}
            onTestSync={onTestSync}
            isTestingSync={isTestingSync}
          />
        </div>

        {/* Regional & Currency & Dialect (Span 6) */}
        <div className="xl:col-span-6">
          <RegionalLocaleCard identity={identity} onChange={onChange} />
        </div>

        {/* Social Accounts (Span 12) */}
        <div className="xl:col-span-12">
          <SocialLinksCard identity={identity} onChange={onChange} />
        </div>
      </div>

      {/* Upload Logo Modal */}
      <UploadLogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogoUrl={identity.logoUrl}
        onSaveLogo={(newUrl) => onChange({ ...identity, logoUrl: newUrl })}
      />
    </div>
  );
};
