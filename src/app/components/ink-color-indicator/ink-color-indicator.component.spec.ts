import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InkColorIndicatorComponent } from './ink-color-indicator.component';

describe('InkColorIndicatorComponent', () => {
  let component: InkColorIndicatorComponent;
  let fixture: ComponentFixture<InkColorIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InkColorIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InkColorIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
