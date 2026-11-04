/**
 * الواجهة العامة الموحدة لخدمة OpenWA (Backward Compatibility Facade)
 * تم تفكيك وإعادة هيكلة هذه الخدمة إلى وحدات صغيرة مستقلة داخل src/main/services/openwa/
 */
export { OpenWAManager } from './openwa';
export * from './openwa/openwa-types';
