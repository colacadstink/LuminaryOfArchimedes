import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CardData, LorcanaAPI} from "lorcana-api";
import {MushuWikiService} from "./services/mushu-wiki.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    {provide: LorcanaAPI, useValue: new LorcanaAPI()},
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef<HTMLInputElement> | undefined;

  cards: CardData[] | undefined;
  filteredCards: CardData[] = [];
  error: any | undefined;

  constructor(
    private api: LorcanaAPI,
    private mushuWiki: MushuWikiService,
  ) {}

  async ngOnInit() {
    try {
      await this.mushuWiki.initPromise;
      this.cards = await this.api.getCardsList();
    } catch (e) {
      console.error(e);
      this.error = e;
    }
  }

  updateFilter(rawSearchText: string) {
    const searchText = rawSearchText.toLowerCase().trim();
    if(searchText === '') {
      this.filteredCards = [];
      return;
    }

    this.filteredCards = this.cards!.filter((c) => c.Name.toLowerCase().includes(searchText));
  }

  reset() {
    this.filter!.nativeElement.value = '';
    this.updateFilter('');
    this.filter!.nativeElement.focus();
  }
}
