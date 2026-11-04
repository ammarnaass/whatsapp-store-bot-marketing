import React, { useState } from 'react';
import { SecuritySettings } from '../types/settings.types';
import {
  SecurityHeader,
  BackupSnapshotCard,
  BackupScheduleCard,
  BackupHistoryCard,
  AccessControlSecurityCard,
  PdplComplianceCard,
  RestoreBackupModal,
} from './security';

interface SecurityBackupSectionProps {
  security: SecuritySettings;
  onChange: (updated: SecuritySettings) => void;
  onDownloadBackup: () => void;
}

export const SecurityBackupSection: React.FC<SecurityBackupSectionProps> = ({
  security,
  onChange,
  onDownloadBackup,
}) => {
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [historyKey, setHistoryKey] = useState(Date.now());

  const handleBackupCreated = () => {
    setHistoryKey(Date.now());
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Security Header */}
      <SecurityHeader onBackupCreated={handleBackupCreated} />

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Instant Snapshot Card (Span 7) */}
        <div className="xl:col-span-7">
          <BackupSnapshotCard
            security={security}
            onDownloadBackup={onDownloadBackup}
            onOpenRestoreModal={() => setIsRestoreModalOpen(true)}
            onRefresh={handleBackupCreated}
          />
        </div>

        {/* Schedule & Retention Policy (Span 5) */}
        <div className="xl:col-span-5">
          <BackupScheduleCard security={security} onChange={onChange} />
        </div>

        {/* 2FA & Session Policies (Span 6) */}
        <div className="xl:col-span-6">
          <AccessControlSecurityCard security={security} onChange={onChange} />
        </div>

        {/* Saudi PDPL & Compliance (Span 6) */}
        <div className="xl:col-span-6">
          <PdplComplianceCard />
        </div>

        {/* Backup History & Audit Log (Span 12) */}
        <div className="xl:col-span-12">
          <BackupHistoryCard lastUpdated={historyKey} />
        </div>
      </div>

      {/* Restore Backup Modal */}
      <RestoreBackupModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onRestored={handleBackupCreated}
      />
    </div>
  );
};
