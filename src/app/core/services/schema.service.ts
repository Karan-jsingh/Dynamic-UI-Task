import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FormSchema, ColumnDefinition, FormTab } from '../models/schema.model';

@Injectable({ providedIn: 'root' })
export class SchemaService {
  constructor(private http: HttpClient) {}

  getSchema(): Observable<FormSchema> {
    return this.http.get<any>('assets/user-schema.json').pipe(
      map((data: any) => {
        const columns = data.arguments[0].jsonresp.columns;
        const layouts = data.arguments[0].jsonresp.form.customLayout;

        const listColumns: ColumnDefinition[] = columns
          .filter((col: any) => col.dataField)
          .map((col: any) => ({
            columnName: col.dataField,
            displayName: col.title || col.dataField,
          }));

        const formTabs: FormTab[] = layouts.map((layout: any) => ({
          title: layout.title || 'Tab',
          fields: layout.fields.map((f: any) => ({
            fieldName: f.dataField,
            label: f.title || f.dataField,
            type: f.dataType || 'text',
          })),
        }));

        return { listColumns, formTabs };
      })
    );
  }
}
