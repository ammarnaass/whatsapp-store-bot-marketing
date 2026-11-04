import React from 'react';
import { AdminAlertSettings } from '../types/settings.types';
import {
  AlertsHeader,
  AlertsChannelsCard,
  AlertsTriggersCard,
  AlertsEscalationCard,
  AlertsQuietHoursCard,
  AlertsRecentLogCard,
} from './alerts';

interface AdminAlertsSectionProps {
  alerts: AdminAlertSettings;
  onChange: (updated: AdminAlertSettings) => void;
  onSendTestAlert: () => void;
  isSendingAlert: boolean;
}

export const AdminAlertsSection: React.FC<AdminAlertsSectionProps> = ({
  alerts,
  onChange,
  onSendTestAlert,
  isSendingAlert,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Alerts Header */}
      <AlertsHeader
        alerts={alerts}
        onSendTestAlert={onSendTestAlert}
        isSendingAlert={isSendingAlert}
      />

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Destination Channels (Span 6) */}
        <div className="xl:col-span-6">
          <AlertsChannelsCard alerts={alerts} onChange={onChange} />
        </div>

        {/* Sales & Inventory Triggers (Span 6) */}
        <div className="xl:col-span-6">
          <AlertsTriggersCard alerts={alerts} onChange={onChange} />
        </div>

        {/* AI & Human Escalation (Span 6) */}
        <div className="xl:col-span-6">
          <AlertsEscalationCard alerts={alerts} onChange={onChange} />
        </div>

        {/* Quiet Hours & Reports (Span 6) */}
        <div className="xl:col-span-6">
          <AlertsQuietHoursCard alerts={alerts} onChange={onChange} />
        </div>

        {/* Recent Dispatch Activity Log (Span 12) */}
        <div className="xl:col-span-12">
          <AlertsRecentLogCard />
        </div>
      </div>
    </div>
  );
};
