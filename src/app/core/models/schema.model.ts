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
  }
  
  export interface FormTab {
    title: string;
    fields: FieldDefinition[];
  }
  
  export interface FormSchema {
    listColumns: ColumnDefinition[];
    formTabs: FormTab[];
  }