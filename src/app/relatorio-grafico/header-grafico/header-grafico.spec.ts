import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGrafico } from './header-grafico';

describe('HeaderGrafico', () => {
  let component: HeaderGrafico;
  let fixture: ComponentFixture<HeaderGrafico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderGrafico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderGrafico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
