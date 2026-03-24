import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsers } from './lista-users';

describe('ListaUsers', () => {
  let component: ListaUsers;
  let fixture: ComponentFixture<ListaUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
