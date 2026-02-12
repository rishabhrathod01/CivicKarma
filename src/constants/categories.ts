import type { Department } from '@/types/complaints';

// ─── Category / Subcategory Seed Data ────────────────────────────────────────

export interface SubcategoryDef {
  name: string;
  nameKn: string;
}

export interface CategoryDef {
  name: string;
  nameKn: string;
  department: Department;
  icon: string;
  subcategories: SubcategoryDef[];
}

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  {
    name: 'BBMP',
    nameKn: 'ಬಿಬಿಎಂಪಿ',
    department: 'bbmp',
    icon: 'building-2',
    subcategories: [
      { name: 'Garbage', nameKn: 'ಕಸ' },
      { name: 'Water Supply', nameKn: 'ನೀರು ಸರಬರಾಜು' },
      { name: 'Drainage', nameKn: 'ಒಳಚರಂಡಿ' },
      { name: 'Street Lights', nameKn: 'ಬೀದಿ ದೀಪಗಳು' },
      { name: 'Parks', nameKn: 'ಉದ್ಯಾನಗಳು' },
    ],
  },
  {
    name: 'Traffic',
    nameKn: 'ಸಂಚಾರ',
    department: 'traffic',
    icon: 'traffic-cone',
    subcategories: [
      { name: 'Illegal Parking', nameKn: 'ಅಕ್ರಮ ಪಾರ್ಕಿಂಗ್' },
      { name: 'Signal Issues', nameKn: 'ಸಿಗ್ನಲ್ ಸಮಸ್ಯೆಗಳು' },
      { name: 'Road Markings', nameKn: 'ರಸ್ತೆ ಗುರುತುಗಳು' },
      { name: 'Speed Violations', nameKn: 'ವೇಗ ಉಲ್ಲಂಘನೆಗಳು' },
    ],
  },
  {
    name: 'Road & Infrastructure',
    nameKn: 'ರಸ್ತೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ',
    department: 'road_infra',
    icon: 'construction',
    subcategories: [
      { name: 'Potholes', nameKn: 'ಗುಂಡಿಗಳು' },
      { name: 'Footpath Damage', nameKn: 'ಫುಟ್\u200Cಪಾತ್ ಹಾನಿ' },
      { name: 'Construction Debris', nameKn: 'ನಿರ್ಮಾಣ ಅವಶೇಷಗಳು' },
      { name: 'Flyover Issues', nameKn: 'ಮೇಲ್ಸೇತುವೆ ಸಮಸ್ಯೆಗಳು' },
    ],
  },
];
