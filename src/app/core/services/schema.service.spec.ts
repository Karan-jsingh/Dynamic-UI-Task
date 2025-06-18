import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchemaService } from './schema.service';
import { FormSchema } from '../models/schema.model';

describe('SchemaService', () => {
  let service: SchemaService;
  let httpMock: HttpTestingController;

  const mockJson = {
    arguments: [
      {
        jsonresp: {
          columns: [
            { dataField: 'UserID', title: 'User ID' },
            { dataField: 'Name', title: 'Full Name' },
          ],
          form: {
            customLayout: [
              {
                title: 'Details',
                fields: [
                  { dataField: 'UserID', title: 'User ID', dataType: 'text' },
                  { dataField: 'Name', title: 'Full Name', dataType: 'text' },
                ]}
            ]
        }}
    }]};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SchemaService]
    });
    service = TestBed.inject(SchemaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map and return FormSchema', () => {
    service.getSchema().subscribe((schema: FormSchema) => {
      expect(schema.listColumns.length).toBe(2);
      expect(schema.formTabs.length).toBe(1);
      expect(schema.formTabs[0].fields[0].fieldName).toBe('UserID');
    });

    const req = httpMock.expectOne('assets/user-schema.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockJson);
  });

  afterEach(() => httpMock.verify());
});
