import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';
import { CustomersHeader } from '../components/CustomersHeader';
import { CustomersKpis } from '../components/CustomersKpis';
import { CustomersFilterBar } from '../components/CustomersFilterBar';
import { CustomersTable } from '../components/CustomersTable';
import { CustomerProfileModal } from '../components/CustomerProfileModal';
import { TargetedCampaignModal } from '../components/TargetedCampaignModal';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    filteredCustomers,
    activeSegment,
    setActiveSegment,
    searchQuery,
    setSearchQuery,
    cityFilter,
    setCityFilter,
    selectedCustomer,
    setSelectedCustomer,
    toastMessage,
    showCampaignModal,
    setShowCampaignModal,
    campaignTitle,
    setCampaignTitle,
    campaignText,
    setCampaignText,
    handleSync,
    handleExport,
    handleSendSingleWhatsApp,
    handleLaunchCampaign
  } = useCustomers();

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Quick Actions */}
      <CustomersHeader
        onSync={handleSync}
        onExport={handleExport}
        onLaunchCampaign={() => setShowCampaignModal(true)}
      />

      {/* 2. KPI Metrics Grid */}
      <CustomersKpis customers={customers} />

      {/* 3. Smart Segments Tabs & Filters */}
      <CustomersFilterBar
        activeSegment={activeSegment}
        onSegmentChange={setActiveSegment}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cityFilter={cityFilter}
        onCityChange={setCityFilter}
        filteredCount={filteredCustomers.length}
        totalCount={customers.length}
      />

      {/* 4. CRM Customers Data Table */}
      <CustomersTable
        customers={filteredCustomers}
        onOpenWhatsApp={handleSendSingleWhatsApp}
        onSelectCustomer={setSelectedCustomer}
      />

      {/* 5. Customer 360 Profile Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onOpenWhatsApp={handleSendSingleWhatsApp}
      />

      {/* 6. Targeted WhatsApp Campaign Modal */}
      <TargetedCampaignModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        onSubmit={handleLaunchCampaign}
        campaignTitle={campaignTitle}
        onTitleChange={setCampaignTitle}
        campaignText={campaignText}
        onTextChange={setCampaignText}
        targetCount={filteredCustomers.length}
      />
    </div>
  );
};
