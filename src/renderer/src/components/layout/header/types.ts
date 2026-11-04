export interface AppHeaderProps {
  sessionStatus: string;
  globalSearch: string;
  onGlobalSearchChange: (val: string) => void;
  onEmergencyStop: () => void;
  isAgentStopped?: boolean;
  onOpenDataManager?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

