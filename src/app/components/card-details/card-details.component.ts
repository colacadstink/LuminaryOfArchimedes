import {Component, Input, OnChanges} from '@angular/core';
import {Abilities, CardData, LorcanaAPI} from "lorcana-api";
import {NgForOf, NgIf} from "@angular/common";
import {MushuWikiService} from "../../services/mushu-wiki.service";

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
  setID: string | undefined;

  @Input()
  cardNum: string | undefined;

  card: CardData | undefined;
  rulingsPages: RulingsInfo[] = [];

  constructor(
    private api: LorcanaAPI,
    private mushu: MushuWikiService,
  ) {}

  async ngOnChanges() {
    this.card = undefined;
    this.rulingsPages = [];

    if(!this.setID || !this.cardNum) {
      return;
    }
    const setID = this.setID;
    const cardNum = +this.cardNum;

    this.card = (await this.api.getCardsList()).find((c) => c.Set_ID === setID && c.Card_Num === cardNum);

    if(!this.card) return;

    // TODO optimize all this to happen in parallel
    // TODO indicate we're still loading the wiki links
    if(await this.mushu.doesRulingsPageExist(this.card.Name)) {
      this.rulingsPages.push({
        name: 'Card rulings',
        url: this.mushu.getRulingsUrl(this.card.Name),
      });
    }

    for(const ability of Abilities) {
      if(this.card.Body_Text?.includes(ability)) {
        if(await this.mushu.doesRulingsPageExist(ability)) {
          this.rulingsPages.push({
            name: `Rulings on ${ability}`,
            url: this.mushu.getRulingsUrl(ability),
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
}
