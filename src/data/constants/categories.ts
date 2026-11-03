export interface CategoryDefinition {
  id: string;
  name: string;
  subcategories: string[];
  defaultDepartmentCode: string;
}

export const CAMPUS_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'infra',
    name: 'Infrastructure',
    subcategories: ['Water Supply & Coolers', 'Power & Electrical', 'Civil & Structural', 'Elevators & Escalators'],
    defaultDepartmentCode: 'ESTATES',
  },
  {
    id: 'living',
    name: 'Living Quarters',
    subcategories: ['Hostel Rooms', 'Mess & Dining Hall', 'Washrooms & Plumbing', 'Common Areas'],
    defaultDepartmentCode: 'ESTATES',
  },
  {
    id: 'academic',
    name: 'Academic Labs',
    subcategories: ['Lecture Halls & Projectors', 'Lab Equipment', 'HVAC & Chiller Units', 'Safety Showers'],
    defaultDepartmentCode: 'HVAC',
  },
  {
    id: 'network',
    name: 'Network & IT',
    subcategories: ['Campus Wi-Fi Deadzones', 'LAN Ports & Routers', 'Access Control Cards', 'Server Outages'],
    defaultDepartmentCode: 'IT_NET',
  },
  {
    id: 'sanitation',
    name: 'Sanitation',
    subcategories: ['Waste Disposal', 'Pest Control', 'Sanitary Dispensers', 'Outdoor Grounds'],
    defaultDepartmentCode: 'SANITATION',
  },
];

