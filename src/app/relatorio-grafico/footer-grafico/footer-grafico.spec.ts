import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterGrafico } from './footer-grafico';

describe('FooterGrafico', () => {
  let component: FooterGrafico;
  let fixture: ComponentFixture<FooterGrafico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterGrafico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterGrafico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
