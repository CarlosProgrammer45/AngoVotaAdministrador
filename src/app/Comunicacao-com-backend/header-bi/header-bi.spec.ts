import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBi } from './header-bi';

describe('HeaderBi', () => {
  let component: HeaderBi;
  let fixture: ComponentFixture<HeaderBi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
