import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultViewComponent } from './default-view.component';

describe('DefaultViewComponent', () => {
  let component: DefaultViewComponent;
  let fixture: ComponentFixture<DefaultViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
