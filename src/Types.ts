export interface GridData {
  id: number;
  section: string;
  data: string;
}

export interface GridState {
  gridData: GridData[];
  loading: boolean;
  error: string | null;
}

export interface GridItem {
  sub: string;
  item_id: number;
  estimate_id: number;
  subject: string;
  quantity: number;
  unit: string;
  unit_cost: string;
  markup: string;
  total: string;
  section_name: string;
  item_type_name: string;
  company_estimate_id: string;
  section_id: string;
  assigned_to: any;
  cost_code: string;
  variation: string;
  is_optional: any;
  newItem: any;
}

export interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  responseTime: string;
  data: {
    items: GridItem[];
    sections: { section_id: number; section_name: string }[];
    all_item_total: any;
  };
}
export interface DataState {
  sections: any;
  showOnlyZero: any;
  visibleSections: any;
  mountedSections: any;
  pendingDrops: any;
  gridData: GridItem[];
  groupedItems: {
    section_id: number;
    section_name: string;
    items: GridItem[];
  }[];
  loading: boolean;
  error: string | null;
  visibleCount: number;
  isOpen: boolean;
  selectedRowData: string;
  selectedRows: string[];
  sidebarMode?:
    | "row"
    | "section"
    | "addSection"
    | "addItem"
    | "viewItem"
    | undefined;
  currentSectionData: {
    section_id: number;
    section_name: string;
    itemCount: number;
  } | null;
}
export interface SectionData {
  section_id: number;
  section_name: string;
  itemCount: number;
}

export interface CustomRowSelectionParams {
  mode: "single" | "multiple";
  headerCheckboxSelection: boolean;
  headerCheckboxSelectionFilteredOnly: boolean;
}

export interface RowData {
  subject?: string;
  quantity?: number;
  unit_cost?: number | string;
  total?: number | string;
  markup?: number | string;
  data?: number | string;
  assigned_to?: string;
}

export interface GroupedSection {
  section_id: number;
  section_name: string;
  description?: string;
  isOptional?: boolean;
  items: GridItem[];
}

export interface Estimate {
  id: string;
  title: string;
  customer: string;
  estimateNumber: string;
  total: number;
  cost: number;
  profit: number;
  mu: number;
  pm: string;
  type: string;
  status: string;
  progress: number;
  details: Record<string, any>;
  createdAt: string;
}

export interface StatusConfig {
  color: string;
  icon: any;
  bgColor: string;
  textColor: string;
}

// types/timeCard.types.ts
export interface TimeCard {
  id?: number;
  employeeName?: string;
  clockInTime?: string;
  clockOutTime?: string;
  project?: string;
  serviceTicket?: string;
  costCode?: string;
  notes?: string;
  status?: "active" | "completed" | "inactive";
  totalHours?: number;
  date?: string;
  newTimeCard?: boolean;
  newCard?: TimeCard;
  breaks?: Break[];
}

// Removed commented out CrewCard interface

export interface Break {
  start: string;
  end?: string;
}

export interface CrewSheetEntry {
  id: number;
  employee: string;
  clockIn: string;
  clockOut: string;
  totalHours: string;
  project: string;
  costCode: string;
  injured: "Yes" | "No";
}

export interface CrewSheet {
  id: number;
  workDate?: string;
  supervisor?: string;
  project?: string;
  notes?: string;
  entries?: CrewSheetEntry[];
  totalEmployees?: number;
  date?: string;
}

// Removed duplicate interface

export interface TimeCardContextType {
  timeCards: TimeCard[];
  crewCards: CrewCard[];
  crewSheets: CrewSheet[];
  activeTimers: Record<number, Timer>;
  addTimeCard: (card: Omit<TimeCard, "id">) => TimeCard;
  addCrewCard: (card: Omit<CrewCard, "id">) => CrewCard;
  addCrewSheet: (sheet: Omit<CrewSheet, "id">) => CrewSheet;
  updateCrewCard: (id: string, updatedCard: CrewCard) => void;
  startTimer: (id: number, type: "timecard" | "crewcard") => void;
  stopTimer: (id: number) => number;
  removeTimeCard: (id: number | string) => void;
  removeCrewCard: (id: string | number) => void;
  removeCrewSheet: (id: string | number) => void;
}

export interface Entry {
  id: number;
  employee: string;
  clockIn: string;
  clockOut: string;
  totalHours: string;
  project: string;
  costCode: string;
  injured: "No" | "Yes";
}

// Removed commented out FormData interface

// CrewSheet interface is already defined above (lines 180-189)

export interface FormData {
  workDate?: string;
  employees?: string;
  supervisor?: string;
  project?: string;
  costCode?: string;
  clockInTime?: string;
  notes?: string;
  serviceTicket?: string;
  employeeName?: string;
}

// Removed commented out CrewCard interface

// TimeCard interface is already defined above

export interface DisplayCard {
  id: string | number;
  type: "timecard" | "crewcard" | "crewsheet";
  displayName: string;
  displayDate: string;
  displayLocation: string;
  displayStatus: string;
  displayDetails?: string;
}

export interface Timer {
  startTime: number;
  type: "timecard" | "crewcard";
}

// Removed commented out FormData interface

export interface CrewCardHistory {
  timestamp: string;
  action: "clock-in" | "break" | "resume" | "clock-out";
  employee: string;
  project?: string;
  costCode?: string;
}

export interface CrewCard {
  id: string;
  date: string;
  employees: string;
  supervisor: string;
  project: string;
  costCode: string;
  notes: string;
  status: "idle" | "clocked-in" | "break" | "resumed" | "clocked-out";
  clockInTime?: string;
  clockOutTime?: string;
  lastBreakStart?: string;
  lastBreakEnd?: string;
  totalBreakTime?: number;
  history: CrewCardHistory[];
  injury?: boolean;
  totalHours?: number;
}

// Removed commented out DisplayCard interface
