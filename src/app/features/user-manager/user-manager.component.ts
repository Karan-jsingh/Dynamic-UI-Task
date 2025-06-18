import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SchemaService } from '../../core/services/schema.service';
import { UserService } from '../../core/services/user.service';
import { FormSchema, FormTab } from '../../core/models/schema.model';
import { User } from '../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule
  ]
})
export class UserManagerComponent implements OnInit {
  schema!: FormSchema;
  formGroups: FormGroup[] = [];
  displayedColumns: string[] = [];
  userList: User[] = [];
  selectedUserIndex: number | null = null;
  activeTabIndex = 0;
  showEmptyFields = false;

  constructor(
    private schemaService: SchemaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.schemaService.getSchema().subscribe({
      next: (schema: FormSchema) => {
        this.schema = schema;
        this.displayedColumns = schema.listColumns.map((col) => col.columnName);
        this.formGroups = schema.formTabs.map((tab: FormTab) => {
          const group: Record<string, FormControl> = {};
          tab.fields.forEach((field) => {
            group[field.fieldName] = new FormControl('');
          });
          return new FormGroup(group);
        });
        this.userService.load().subscribe(users => {
          this.userService.setAll(users);
          this.userList = users;
        });
      },
      error: (err: any) => console.error('Failed to load schema:', err)
    });
  }

  onRowSelect(user: User): void {
    this.selectedUserIndex = this.userList.findIndex((u) => u === user);
    this.schema.formTabs.forEach((tab: FormTab, tabIndex: number) => {
      const group = this.formGroups[tabIndex];
      tab.fields.forEach((field) => {
        group.get(field.fieldName)?.setValue(user[field.fieldName] || '');
      });
    });
    this.activeTabIndex = 1;
  }

  onToggleShowEmptyFields(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showEmptyFields = target?.checked ?? false;
  }

  onSubmit(): void {
    const merged: Record<string, any> = {};
    this.formGroups.forEach((group) => Object.assign(merged, group.value));

    if (this.selectedUserIndex !== null) {
      this.userService.update(this.selectedUserIndex, merged);
      this.userList = this.userService.getAll();
      alert('User data saved to session storage ✅');
      this.activeTabIndex = 0;
    }
  }
}
