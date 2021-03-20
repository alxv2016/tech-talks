import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValuePropComponent} from './value-prop.component';

describe('ValuePropComponent', () => {
  let component: ValuePropComponent;
  let fixture: ComponentFixture<ValuePropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValuePropComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
