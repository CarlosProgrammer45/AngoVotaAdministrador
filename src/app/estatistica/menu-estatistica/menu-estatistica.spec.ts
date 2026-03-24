import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEstatistica } from './menu-estatistica';

describe('MenuEstatistica', () => {
  let component: MenuEstatistica;
  let fixture: ComponentFixture<MenuEstatistica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEstatistica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEstatistica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
