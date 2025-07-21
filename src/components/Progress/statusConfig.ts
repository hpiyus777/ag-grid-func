import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  RefreshCw,
} from "lucide-react";
import type { StatusConfig } from "../../Types";

export const statusConfig: Record<string, StatusConfig> = {
  Completed: {
    color: "bg-green-600",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  Approved: {
    color: "bg-green-500",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  "On Hold": {
    color: "bg-blue-500",
    icon: Clock,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  Estimating: {
    color: "bg-blue-600",
    icon: Clock,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  "Pending Approval": {
    color: "bg-orange-500",
    icon: AlertCircle,
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
  "Re-Estimating": {
    color: "bg-yellow-500",
    icon: RefreshCw,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
  },
  Lost: {
    color: "bg-red-500",
    icon: XCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  Template: {
    color: "bg-purple-500",
    icon: FileText,
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
};
