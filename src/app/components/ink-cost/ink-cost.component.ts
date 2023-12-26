import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-ink-cost',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './ink-cost.component.html',
  styleUrl: './ink-cost.component.less'
})
export class InkCostComponent {
  @Input()
  cost: number = 0;

  @Input()
  inkable: boolean = false;
}
