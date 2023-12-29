import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardData} from "lorcana-api";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {Router} from "@angular/router";
import {NgClass} from "@angular/common";
import {InkCostComponent} from "../ink-cost/ink-cost.component";
import {LorcanaAPIService} from "../../services/lorcana-api.service";

@Component({
  selector: 'app-card-picker',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatInputModule,
    NgClass,
    InkCostComponent
  ],
  templateUrl: './card-picker.component.html',
  styleUrl: './card-picker.component.less'
})
export class CardPickerComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef<HTMLInputElement> | undefined;

  cards: CardData[] = [];
  filteredCards: CardData[] = [];

  constructor(
    private api: LorcanaAPIService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.cards = await this.api.getCardsList();
  }

  updateFilter(rawSearchText: string) {
    const searchText = rawSearchText.toLowerCase().trim();
    if(searchText === '') {
      this.filteredCards = [];
      return;
    }

    this.filteredCards = this.cards!.filter((c) => c.Name.toLowerCase().includes(searchText));
  }

  async select(card: CardData) {
    this.filter!.nativeElement.value = '';
    this.updateFilter('');
    await this.router.navigate(['card', card.Set_ID, card.Card_Num]);
    this.filter!.nativeElement.blur();
  }
}
