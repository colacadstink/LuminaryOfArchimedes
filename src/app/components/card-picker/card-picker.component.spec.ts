import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPickerComponent } from './card-picker.component';

describe('CardPickerComponent', () => {
  let component: CardPickerComponent;
  let fixture: ComponentFixture<CardPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
