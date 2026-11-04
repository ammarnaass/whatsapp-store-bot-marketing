/**
 * مساعدات معالجة واستبدال نصوص القوالب التسويقية بالمتغيرات الحية
 */
export function parseTemplatePreview(
  template: string,
  sampleData: { name?: string; orderId?: string; coupon?: string; storeUrl?: string } = {}
): string {
  const name = sampleData.name || 'سعد التميمي';
  const orderId = sampleData.orderId || 'ORD-9421';
  const coupon = sampleData.coupon || 'WELCOME10';
  const storeUrl = sampleData.storeUrl || 'https://wasell.store';

  return template
    .replace(/\{الاسم\}|\{name\}/gi, name)
    .replace(/\{رقم_الطلب\}|\{order_id\}/gi, orderId)
    .replace(/\{الكوبون\}|\{coupon\}/gi, coupon)
    .replace(/\{رابط_المتجر\}|\{store_url\}/gi, storeUrl);
}

export function insertVariableAtCursor(
  currentText: string,
  variableTag: string,
  selectionStart: number = currentText.length
): { newText: string; newCursorPos: number } {
  const before = currentText.slice(0, selectionStart);
  const after = currentText.slice(selectionStart);
  const newText = `${before}${variableTag}${after}`;
  return {
    newText,
    newCursorPos: selectionStart + variableTag.length,
  };
}

