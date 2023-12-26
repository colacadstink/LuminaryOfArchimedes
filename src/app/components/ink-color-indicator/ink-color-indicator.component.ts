import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Color} from "lorcana-api";

@Component({
  selector: 'app-ink-color-indicator',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './ink-color-indicator.component.html',
  styleUrl: './ink-color-indicator.component.less'
})
export class InkColorIndicatorComponent {
  @Input()
  color: Color = Color.Steel;

  getColorSvg() {
    return `assets/${this.color.toLowerCase()}.svg`;
  }
}
