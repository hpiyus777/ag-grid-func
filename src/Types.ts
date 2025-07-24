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
  status?: "active" | "completed";
  totalHours?: number;
  date?: string;
  newTimeCard?: boolean;
  newCard?: TimeCard;
  breaks?: Break[];
}

export interface CrewCard {
  id: number;
  employees?: string;
  supervisor?: string;
  project?: string;
  costCode?: string;
  notes?: string;
  clockInTime?: string;
  clockOutTime?: string;
  status?: "clocked-in" | "break" | "resumed" | "clocked-out";
  lastBreakStart?: string;
  lastBreakEnd?: string;
  breaks: Break[];
  date?: string;
}

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

export interface ActiveTimer {
  startTime: number;
  type: "timecard" | "crewcard";
}

export interface TimeCardContextType {
  timeCards: TimeCard[];
  crewCards: CrewCard[] ;
  crewSheets: CrewSheet[];
  activeTimers: Record<number, ActiveTimer>;
  addTimeCard: (
    timeCard: Omit<TimeCard, "id" | "date" | "totalHours">
  ) => TimeCard;
  updateTimeCard: (id: number, updates: Partial<TimeCard>) => void;
  addCrewCard: (crewCard: Omit<CrewCard, "id" | "date" | "breaks">) => CrewCard;
  updateCrewCard: (id: number, updates: Partial<CrewCard>) => void;
  addCrewSheet: (crewSheet: Omit<CrewSheet, "id" | "date">) => CrewSheet;
  startTimer: (cardId: number, type: "timecard" | "crewcard") => void;
  stopTimer: (cardId: number) => number;
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

// export interface FormData {
//   workDate: string;
//   supervisor: string;
//   project: string;
//   notes: string;
// }

export interface CrewSheet {
  workDate?: string;
  supervisor?: string;
  project?: string;
  notes?: string;
  entries?: Entry[];
  totalEmployees?: number;
}

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

export interface CrewCard {
  id: number;
  employees?: string;
  supervisor?: string;
  project?: string;
  costCode?: string;
  notes?: string;
  clockInTime?: string;
  status?: "clocked-in" | "break" | "resumed" | "clocked-out";
  lastBreakStart?: string;
  lastBreakEnd?: string;
  clockOutTime?: string;
  newCrewCard?: boolean;
}

export interface TimeCard {
  id?: number;
  clockInTime?: string;
  status?: string;
  project?: string;
  serviceTicket?: string;
  costCode?: string;
  employeeName?: string;
  notes?: string;
  newTimeCard?: boolean;
}

export interface DisplayCard {
  id: string ;
  type: "timecard" | "crewcard" | "crewsheet";
  timeCards?: TimeCard[];
  crewCard?: CrewCard;
  crewSheet?: CrewSheet;
  displayName: string;
  displayDate: string;
  displayLocation: string;
  displayStatus: string;
  DisplayCard: string;
}


