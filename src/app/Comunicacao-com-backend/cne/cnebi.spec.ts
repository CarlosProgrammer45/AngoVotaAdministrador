import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cnebi } from './cnebi';

describe('Cnebi', () => {
  let component: Cnebi;
  let fixture: ComponentFixture<Cnebi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cnebi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cnebi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
