import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Color} from "lorcana-api";

@Component({
    selector: 'app-ink-color-indicator',
    imports: [
        NgOptimizedImage
    ],
    templateUrl: './ink-color-indicator.component.html',
    styleUrl: './ink-color-indicator.component.less'
})
export class InkColorIndicatorComponent {
  @Input()
  color: string = Color.Steel;

  getColorSvg(color: string): string {
    return `assets/${color.trim().toLowerCase()}.svg`;
  }

  getColorSvgs(): string[] {
    return this.color.split(',').map(c => this.getColorSvg(c));
  }
}
