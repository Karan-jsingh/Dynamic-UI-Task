export interface ColumnDefinition {
    columnName: string;
    displayName: string;
  }
  
  export interface FieldDefinition {
    fieldName: string;
    label?: string;
    type?: string;
    labelpos?: { x: number; y: number };
    inputpos?: { x: number; y: number };
    showLabel?: boolean; 
    maxChars?: number;          
    enabled?: boolean;
  }
  
  export interface FormTab {
    formHeight: number;
    formWidth: number;
    title: string;
    fields: FieldDefinition[];
  }
  
  export interface FormSchema {
    listColumns: ColumnDefinition[];
    formTabs: FormTab[];
  }