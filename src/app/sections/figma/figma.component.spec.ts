import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FigmaComponent} from './figma.component';

describe('FigmaComponent', () => {
  let component: FigmaComponent;
  let fixture: ComponentFixture<FigmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FigmaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
