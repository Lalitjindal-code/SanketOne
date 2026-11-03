export interface LocationZone {
  code: string;
  name: string;
  quadrant: string;
  subZones: string[];
}

export const CAMPUS_ZONES: LocationZone[] = [
  {
    code: 'ACAD_B',
    name: 'Academic Block B',
    quadrant: 'North Quad',
    subZones: ['Floor 1 Corridor West', 'Floor 2 Corridor East', 'Floor 3 Seminar Rooms', 'Terrace Labs'],
  },
  {
    code: 'LIB',
    name: 'Central Library',
    quadrant: 'Central Quad',
    subZones: ['Floor 1 Circulation', 'Floor 2 Stacks', 'Floor 3 Quiet Study & IT', 'Floor 4 Archives'],
  },
  {
    code: 'HOSTEL_4',
    name: 'Hostel Block IV (Mahanadi)',
    quadrant: 'South Residential Quad',
    subZones: ['Wing A Floors 1-4', 'Wing B Floors 1-4', 'Common Room', 'Dining Hall'],
  },
  {
    code: 'BLDG_3',
    name: 'Building 3 Engineering Labs',
    quadrant: 'West Tech Quad',
    subZones: ['Ground Floor Mechanical', 'Floor 1 Robotics', 'Floor 2 Clean Rooms', 'Chiller Yard'],
  },
];

