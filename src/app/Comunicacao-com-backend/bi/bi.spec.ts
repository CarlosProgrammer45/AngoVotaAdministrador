import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BI } from './bi';

describe('BI', () => {
  let component: BI;
  let fixture: ComponentFixture<BI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
