export interface ColumnDefinition {
    columnName: string;
    displayName: string;
  }
  
  export interface FieldDefinition {
    fieldName: string;
    label: string;
    type: string;
  }
  
  export interface FormTab {
    title: string;
    fields: FieldDefinition[];
  }
  
  export interface FormSchema {
    listColumns: ColumnDefinition[];
    formTabs: FormTab[];
  }