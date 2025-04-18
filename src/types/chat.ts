
export type MessageType = {
  id: string;
  type: "user" | "system";
  content: string | React.ReactNode;
  timestamp: Date;
};

export type ProcessingStepType = {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed" | "error" | "warning";
  details?: string;
  icon: React.ReactNode;
  source?: string;
};

export type FormFieldType = {
  id: string;
  label: string;
  value: string;
  source?: string;
  conflictValue?: string;
  conflictSource?: string;
  required: boolean;
  category: string;
};
