import {Component, Input, OnChanges} from '@angular/core';
import {Abilities, CardData, LorcanaAPI} from "lorcana-api";
import {NgForOf, NgIf} from "@angular/common";

type RulingsInfo = {
  name: string,
  url: string | undefined,
}

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.css'
})
export class CardDetailsComponent implements OnChanges {
  @Input()
  setNum: number | undefined;

  @Input()
  cardNum: number | undefined;

  card: CardData | undefined;
  rulingsPages: RulingsInfo[] = [];

  constructor(
    private api: LorcanaAPI,
  ) {}

  async ngOnChanges() {
    this.card = undefined;
    this.rulingsPages = [];

    if(!this.setNum || !this.cardNum) {
      return;
    }

    // TODO probably refactor this to pull from the global card list to reduce network load
    this.card = await this.api.getCardByIDs(this.setNum, this.cardNum);

    if(!this.card) return;

    const wikiName = this.cardNameToWikiFormat(this.card.Name);

    // TODO optimize all this to happen in parallel
    // TODO indicate we're still loading the wiki links
    if(await this.doesMushuWikiRulingsPageExist(wikiName)) {
      this.rulingsPages.push({
        name: 'Card rulings',
        url: this.getMushuWikiRulingsUrl(wikiName),
      });
    }

    for(const ability of Abilities) {
      if(this.card.Body_Text?.includes(ability)) {
        if(await this.doesMushuWikiRulingsPageExist(ability)) {
          this.rulingsPages.push({
            name: `Rulings on ${ability}`,
            url: this.getMushuWikiRulingsUrl(ability),
          });
        } else {
          this.rulingsPages.push({
            name: `No rulings available for ${ability}`,
            url: undefined,
          });
        }
      }
    }
  }

  // TODO Cache this somewhere, at least for the session.
  async doesMushuWikiRulingsPageExist(pageName: string): Promise<boolean> {
    const resp = await fetch(`https://wiki.mushureport.com/api.php?action=parse&format=json&origin=*&page=Rulings%3A${pageName}&prop=displaytitle`);
    const json = await resp.json();
    return !json.error;
  }

  getMushuWikiRulingsUrl(pageName: string) {
    return `https://wiki.mushureport.com/wiki/Rulings:${pageName}`;
  }

  cardNameToWikiFormat(cardName: string): string {
    return cardName
      .replace(/ /g, '_')
      ;
  }
}
