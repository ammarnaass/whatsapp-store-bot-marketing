import { StateInfo } from './types';

// إمارات دولة الإمارات العربية المتحدة (7 إمارات)
export const UAE_EMIRATES: StateInfo[] = [
  { code: 'AE-DXB', name: 'إمارة دبي (Dubai)', region: 'الوسط' },
  { code: 'AE-AUH', name: 'إمارة أبوظبي (Abu Dhabi والعين)', region: 'العاصمة' },
  { code: 'AE-SHJ', name: 'إمارة الشارقة (Sharjah)', region: 'الشمالية' },
  { code: 'AE-AJM', name: 'إمارة عجمان (Ajman)', region: 'الشمالية' },
  { code: 'AE-RAK', name: 'إمارة رأس الخيمة (Ras Al Khaimah)', region: 'الشمالية' },
  { code: 'AE-FUJ', name: 'إمارة الفجيرة (Fujairah)', region: 'الشرقية' },
  { code: 'AE-UAQ', name: 'إمارة أم القيوين (Umm Al Quwain)', region: 'الشمالية' },
];

// محافظات جمهورية مصر العربية الرئيسية
export const EGYPT_GOVERNORATES: StateInfo[] = [
  { code: 'EG-C', name: 'القاهرة (Cairo)', region: 'القاهرة الكبرى' },
  { code: 'EG-GZ', name: 'الجيزة (Giza)', region: 'القاهرة الكبرى' },
  { code: 'EG-ALX', name: 'الإسكندرية (Alexandria)', region: 'الساحل' },
  { code: 'EG-KB', name: 'القليوبية (Qalyubia)', region: 'الدلتا' },
  { code: 'EG-DK', name: 'الدقهلية (المنصورة)', region: 'الدلتا' },
  { code: 'EG-SHR', name: 'الشرقية (الزقازيق)', region: 'الدلتا' },
  { code: 'EG-GH', name: 'الغربية (طنطا والمحلة)', region: 'الدلتا' },
  { code: 'EG-MNF', name: 'المنوفية (شبين الكوم)', region: 'الدلتا' },
  { code: 'EG-BA', name: 'البحر الأحمر (الغردقة)', region: 'القناة والساحل' },
  { code: 'EG-PTS', name: 'بورسعيد (Port Said)', region: 'القناة' },
  { code: 'EG-SUZ', name: 'السويس (Suez)', region: 'القناة' },
  { code: 'EG-IS', name: 'الإسماعيلية (Ismailia)', region: 'القناة' },
  { code: 'EG-ASN', name: 'أسوان (Aswan)', region: 'الصعيد' },
  { code: 'EG-LX', name: 'الأقصر (Luxor)', region: 'الصعيد' },
  { code: 'EG-AST', name: 'أسيوط (Asyut)', region: 'الصعيد' },
  { code: 'EG-SW', name: 'سوهاج (Sohag)', region: 'الصعيد' },
];

// جهات وعمالات المملكة المغربية
export const MOROCCO_REGIONS: StateInfo[] = [
  { code: 'MA-06', name: 'الدار البيضاء - سطات (Casablanca-Settat)', region: 'الوسط' },
  { code: 'MA-04', name: 'الرباط - سلا - القنيطرة (Rabat-Salé-Kénitra)', region: 'الشمال الغربي' },
  { code: 'MA-01', name: 'طنجة - تطوان - الحسيمة (Tanger-Tétouan)', region: 'الشمال' },
  { code: 'MA-07', name: 'مراكش - آسفي (Marrakech-Safi)', region: 'الجنوب' },
  { code: 'MA-03', name: 'فاس - مكناس (Fès-Meknès)', region: 'الوسط الشرقي' },
  { code: 'MA-09', name: 'سوس - ماسة (أكادير Agadir)', region: 'الجنوب' },
  { code: 'MA-02', name: 'الجهة الشرقية (وجدة والناظور)', region: 'الشرق' },
];

// ولايات الجمهورية التونسية الرئيسية
export const TUNISIA_GOVERNORATES: StateInfo[] = [
  { code: 'TN-11', name: 'تونس الكبرى (Tunis)', region: 'الشمال الشرقي' },
  { code: 'TN-31', name: 'صفاقس (Sfax)', region: 'الوسط الشرقي' },
  { code: 'TN-51', name: 'سوسة (Sousse)', region: 'الساحل' },
  { code: 'TN-21', name: 'نابل (Nabeul والوطن القبلي)', region: 'الشمال الشرقي' },
  { code: 'TN-12', name: 'أريانة (Ariana)', region: 'الشمال الشرقي' },
  { code: 'TN-13', name: 'بن عروس (Ben Arous)', region: 'الشمال الشرقي' },
  { code: 'TN-14', name: 'منوبة (Manouba)', region: 'الشمال الشرقي' },
  { code: 'TN-52', name: 'المنستير (Monastir)', region: 'الساحل' },
  { code: 'TN-41', name: 'القيروان (Kairouan)', region: 'الوسط' },
];
