import { Injectable } from '@angular/core';

type InitPromise = Promise<{
  keywordRulings: string[],
  cardRulings: string[],
}>;

@Injectable({
  providedIn: 'root'
})
export class MushuWikiService {
  #initPromise: InitPromise;
  get initPromise() {
    return this.#initPromise;
  }

  #wikiRoot = 'https://wiki.mushureport.com';
  get wikiRoot() {
    return this.#wikiRoot;
  }
  set wikiRoot(value) {
    this.#wikiRoot = value;
    this.#initPromise = this.#init();
  }

  constructor() {
    this.#initPromise = this.#init();
  }

  #conceptToWikiFormat(cardName: string): string {
    return cardName
      .replace(/ /g, '_')
      ;
  }

  async #apiRequest(params: Record<string, string>) {
    const searchParams = new URLSearchParams({
      format: 'json',
      origin: '*',
      ...params,
    }).toString();
    const resp = await fetch(`${this.#wikiRoot}/api.php?${searchParams}`);
    return await resp.json();
  }

  async #init(): InitPromise {
    const [
      keywordRulings,
      cardRulings,
    ] = await Promise.all([
      this.#apiRequest({
        action: 'query',
        generator: 'categorymembers',
        gcmtitle: 'Category:Keyword_Rulings',
        gcmlimit: 'max',
        cllimit: 'max',
      }).then(getCategoryTitles),
      this.#apiRequest({
        action: 'query',
        generator: 'categorymembers',
        gcmtitle: 'Category:Card_Rulings',
        gcmlimit: 'max',
        cllimit: 'max',
      }).then(getCategoryTitles),
    ]);

    return {keywordRulings, cardRulings};
  }

  async doesRulingsPageExist(conceptName: string): Promise<boolean> {
    console.log(await this.initPromise);
    return (
      await this.doesCardRulingsPageExist(conceptName) ||
      await this.doesKeywordRulingsPageExist(conceptName)
    );
  }

  async doesCardRulingsPageExist(cardName: string): Promise<boolean> {
    const {cardRulings} = await this.initPromise;
    console.log('Rulings:'+this.#conceptToWikiFormat(cardName));
    return cardRulings.includes(`Rulings:${cardName}`);
  }

  async doesKeywordRulingsPageExist(keyword: string): Promise<boolean> {
    const {keywordRulings} = await this.initPromise;
    return keywordRulings.includes(`Rulings:${keyword}`);
  }

  getRulingsUrl(cardName: string) {
    return `${this.#wikiRoot}/wiki/Rulings:${this.#conceptToWikiFormat(cardName)}`;
  }
}

function getCategoryTitles(json: any): string[] {
  if(!json.query) {
    console.error(json);
    throw new Error('Category query failed somehow');
  }

  return Object.values(json.query.pages)?.map((page: any) => page?.title) ?? [];
}
