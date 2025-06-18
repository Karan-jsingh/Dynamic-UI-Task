import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserManagerComponent } from './user-manager.component';
import { SchemaService } from '../../core/services/schema.service';
import { UserService } from '../../core/services/user.service';
import { of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

describe('UserManagerComponent', () => {
  let component: UserManagerComponent;
  let fixture: ComponentFixture<UserManagerComponent>;
  let mockSchemaService: any;
  let mockUserService: any;

  const schemaMock = {
    listColumns: [{ columnName: 'UserID', displayName: 'User ID' }],
    formTabs: [
      {
        title: 'Tab 1',
        fields: [
          { fieldName: 'UserID', label: 'User ID', type: 'text' }
        ]
      }
    ]
  };

  const userMock = [{ UserID: '123' }];

  beforeEach(() => {
    mockSchemaService = {
      getSchema: jasmine.createSpy().and.returnValue(of(schemaMock))
    };

    mockUserService = {
      load: jasmine.createSpy().and.returnValue(of(userMock)),
      setAll: jasmine.createSpy(),
      getAll: jasmine.createSpy().and.returnValue(userMock),
      update: jasmine.createSpy(),
      get: jasmine.createSpy().and.returnValue({ UserID: '123' })
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        UserManagerComponent
      ],
      providers: [
        { provide: SchemaService, useValue: mockSchemaService },
        { provide: UserService, useValue: mockUserService }
      ]
    });

    fixture = TestBed.createComponent(UserManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize schema and users', () => {
    expect(mockSchemaService.getSchema).toHaveBeenCalled();
    expect(mockUserService.load).toHaveBeenCalled();
    expect(component.userList.length).toBe(1);
    expect(component.formGroups.length).toBe(1);
    expect(component.formGroups[0].get('UserID')).toBeTruthy();
  });

  it('should populate form when a row is selected', () => {
    const userRef = component.userList[0]; 
    component.onRowSelect(userRef);
    expect(component.selectedUserIndex).toBe(0);
    expect(component.activeTabIndex).toBe(1);
    expect(component.formGroups[0].get('UserID')?.value).toBe('123');
  });  

  it('should submit form and update user', () => {
    component.selectedUserIndex = 0;
    component.formGroups = [
      new FormGroup({
        UserID: new FormControl('UpdatedUser')
      })
    ];
    component.onSubmit();
    expect(mockUserService.update).toHaveBeenCalledWith(0, jasmine.objectContaining({ UserID: 'UpdatedUser' }));
    expect(component.activeTabIndex).toBe(0);
  });

  it('should not submit if no user is selected', () => {
    component.selectedUserIndex = null;
    component.onSubmit();
    expect(mockUserService.update).not.toHaveBeenCalled();
  });
});
