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