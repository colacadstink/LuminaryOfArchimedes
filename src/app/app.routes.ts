import { Routes } from '@angular/router';
import {CardDetailsComponent} from "./card-details/card-details.component";

export const routes: Routes = [{
  path: 'card/:setNum/:cardNum',
  component: CardDetailsComponent,
}];
