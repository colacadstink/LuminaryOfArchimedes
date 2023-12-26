import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InkCostComponent } from './ink-cost.component';

describe('InkCostComponent', () => {
  let component: InkCostComponent;
  let fixture: ComponentFixture<InkCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InkCostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InkCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
