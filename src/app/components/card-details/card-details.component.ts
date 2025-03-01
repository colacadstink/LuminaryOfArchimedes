import {Component, Input, OnChanges} from '@angular/core';
import {Abilities, CardData, CardType} from "lorcana-api";
import {NgForOf, NgIf} from "@angular/common";
import {MushuWikiService} from "../../services/mushu-wiki.service";
import {InkCostComponent} from "../ink-cost/ink-cost.component";
import {InkColorIndicatorComponent} from "../ink-color-indicator/ink-color-indicator.component";
import {LorcanaAPIService} from "../../services/lorcana-api.service";

type RulingsInfo = {
  name: string,
  url: string | undefined,
}

@Component({
    selector: 'app-card-details',
    imports: [
        NgIf,
        NgForOf,
        InkCostComponent,
        InkColorIndicatorComponent
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

  generalRulingsPages: RulingsInfo[] = [{
    name: 'General',
    url: 'https://wiki.mushureport.com/wiki/Rulings:General',
  }, {
    name: 'Challenges',
    url: 'https://wiki.mushureport.com/wiki/Rulings:Challenges',
  }, {
    name: 'Inkwell',
    url: 'https://wiki.mushureport.com/wiki/Rulings:Inkwell',
  }, {
    name: 'Timing',
    url: 'https://wiki.mushureport.com/wiki/Rulings:Timing',
  }];

  constructor(
    private api: LorcanaAPIService,
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
    } else {
      this.rulingsPages.push({
        name: `No card-specific rulings available for this card`,
        url: undefined,
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

  getBodyText() {
    if(!this.card) {
      return '';
    }

    let bodyText: string = this.card.Type;
    if(this.card.Type === CardType.Character) {
      bodyText += ` - ${this.card.Classifications.join(' ')}`
    }

    bodyText += '\n\n' + (this.card.Body_Text
      ?.trim()
      .replaceAll(/([a-zA-Z,])\n([a-zA-Z])/g, '$1 $2') // Bugfix: Starting with SSK, cards have newlines jammed in
      .replaceAll('\n', '\n\n')
    || '');
    console.log(bodyText);

    bodyText += '\n';
    if(this.card.Type === CardType.Character) {
      bodyText += `\nStrength: ${this.card.Strength}\nWillpower: ${this.card.Willpower}`;
    }
    if(this.card.Type === CardType.Character || this.card.Type === CardType.Location) {
      bodyText += `\nLore pips: ${this.card.Lore}`;
    }

    return bodyText;
  }
}
