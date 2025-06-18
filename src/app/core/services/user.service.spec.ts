import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../core/models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { UserID: 'JS1', ChristianName: 'Jass', Surname: 'Singh' },
    { UserID: 'AN2', ChristianName: 'Anna', Surname: 'Brown' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load users from fallback JSON if sessionStorage is empty', () => {
    service.load().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users[0]['UserID']).toBe('JS1');
    });

    const req = httpMock.expectOne('assets/mock-users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should use sessionStorage data if available', () => {
    sessionStorage.setItem('userList', JSON.stringify(mockUsers));
    service.load().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users[1]['ChristianName']).toBe('Anna');
    });
  });

  it('should update user at given index', () => {
    service.setAll(JSON.parse(JSON.stringify(mockUsers))); 
    service.update(1, { ...mockUsers[1], Surname: 'Green' });
    const users = service.getAll();
    expect(users[1]['Surname']).toBe('Green');
  });

  it('should add a new user', () => {
    service.setAll(JSON.parse(JSON.stringify(mockUsers))); 
    const newUser: User = { UserID: 'ZZ9', ChristianName: 'Zoe', Surname: 'Zen' };
    service.add(newUser);
    const users = service.getAll();
    expect(users.length).toBe(3);
    expect(users[2]['UserID']).toBe('ZZ9');
  });

  it('should delete a user by index', () => {
    const baseUsers = [
      { UserID: 'JS1', ChristianName: 'Jass', Surname: 'Singh' },
      { UserID: 'AN2', ChristianName: 'Anna', Surname: 'Brown' }
    ];
    service.setAll(baseUsers);
    service.delete(1);
    const users = service.getAll();
    expect(users.length).toBe(1);
    expect(users[0]['UserID']).toBe('JS1');
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });
});
