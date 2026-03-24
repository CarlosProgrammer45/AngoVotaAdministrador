import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngolaGlobo } from './angola-globo';

describe('AngolaGlobo', () => {
  let component: AngolaGlobo;
  let fixture: ComponentFixture<AngolaGlobo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngolaGlobo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngolaGlobo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
