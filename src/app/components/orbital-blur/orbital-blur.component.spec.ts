import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrbitalBlurComponent} from './orbital-blur.component';

describe('OrbitalBlurComponent', () => {
  let component: OrbitalBlurComponent;
  let fixture: ComponentFixture<OrbitalBlurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrbitalBlurComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrbitalBlurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
