import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderEstatisticas } from './header-estatisticas';

describe('HeaderEstatisticas', () => {
  let component: HeaderEstatisticas;
  let fixture: ComponentFixture<HeaderEstatisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderEstatisticas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderEstatisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
