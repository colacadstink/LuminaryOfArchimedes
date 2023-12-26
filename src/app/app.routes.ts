import { Routes } from '@angular/router';
import {CardDetailsComponent} from "./components/card-details/card-details.component";
import {DefaultViewComponent} from "./components/default-view/default-view.component";

export const routes: Routes = [{
  path: 'card/:setID/:cardNum',
  component: CardDetailsComponent,
}, {
  path: '**',
  component: DefaultViewComponent,
}];
