import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
export class UserManagerComponent implements OnInit, AfterViewInit {
  schema!: FormSchema;
  formGroups: FormGroup[] = [];
  displayedColumns: string[] = [];
  userList: User[] = [];
  selectedUserIndex: number | null = null;
  activeTabIndex = 0;
  showEmptyFields = false;

  @ViewChild('formContainer', { static: false }) formContainer!: ElementRef;
  xMultiplier = 10;
  yMultiplier = 20;

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
          tab.fields.forEach(field => {
            group[field.fieldName] = this.createControlFromField(field);
          });
          return new FormGroup(group);
        });

        this.userService.load().subscribe(users => {
          this.userService.setAll(users);
          this.userList = users;
        });
      },
      error: err => console.error('Failed to load schema:', err)
    });
  }

  getControl(i: number, fieldName: string): FormControl {
    return this.formGroups[i].get(fieldName) as FormControl;
  }

  private createControlFromField(field: any): FormControl {
    const validators = [];
    const isDisabled = field.enabled === false;
    if (typeof field.maxChars === 'number') {
      validators.push(Validators.maxLength(field.maxChars));
    }

    return new FormControl({ value: '', disabled: isDisabled }, validators);
  }

  enforceMaxChars(event: KeyboardEvent, field: any): void {
    const input = event.target as HTMLInputElement;
    const maxChars = field?.maxChars;

    if (typeof maxChars !== 'number') return;

    const currentLength = input.value.length;
    const selectionLength = input.selectionEnd! - input.selectionStart!;
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (
      currentLength - selectionLength >= maxChars &&
      !allowedKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.formContainer?.nativeElement) {
        const container = this.formContainer.nativeElement as HTMLElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        this.xMultiplier = width / 132;
        this.yMultiplier = height / 37;
      }
    }, 0);
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
