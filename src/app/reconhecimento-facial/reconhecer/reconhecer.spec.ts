import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reconhecer } from './reconhecer';

describe('Reconhecer', () => {
  let component: Reconhecer;
  let fixture: ComponentFixture<Reconhecer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reconhecer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reconhecer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
