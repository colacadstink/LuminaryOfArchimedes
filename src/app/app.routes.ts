import { Routes } from '@angular/router';
import {CardDetailsComponent} from "./components/card-details/card-details.component";

export const routes: Routes = [{
  path: 'card/:setID/:cardNum',
  component: CardDetailsComponent,
}];
