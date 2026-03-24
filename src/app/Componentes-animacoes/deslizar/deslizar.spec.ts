import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deslizar } from './deslizar';

describe('Deslizar', () => {
  let component: Deslizar;
  let fixture: ComponentFixture<Deslizar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deslizar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deslizar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
