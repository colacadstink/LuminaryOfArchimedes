import { Injectable } from '@angular/core';
import {HOURS, LocalStorageCache} from "./local-storage-cache.service";

type InitPromise = Promise<{
  keywordRulings: string[],
  cardRulings: string[],
}>;

const WIKI_ROOT = 'https://wiki.mushureport.com';
const CACHE_VALID_FOR = 18 * HOURS;

@Injectable({
  providedIn: 'root'
})
export class MushuWikiService {
  #keywordRulingsCache: LocalStorageCache<string[]>;
  #cardRulingsCache: LocalStorageCache<string[]>;

  readonly #initPromise: InitPromise;
  get initPromise() {
    return this.#initPromise;
  }

  constructor() {
    this.#keywordRulingsCache = new LocalStorageCache('keywordRulings', CACHE_VALID_FOR, async () => {
      const json = await this.#apiRequest({
        action: 'query',
        generator: 'categorymembers',
        gcmtitle: 'Category:Keyword_Rulings',
        gcmlimit: 'max',
        cllimit: 'max',
      });
      return getCategoryTitles(json);
    });
    this.#cardRulingsCache = new LocalStorageCache('cardRulings', CACHE_VALID_FOR, async () => {
      const json = await this.#apiRequest({
        action: 'query',
        generator: 'categorymembers',
        gcmtitle: 'Category:Card_Rulings',
        gcmlimit: 'max',
        cllimit: 'max',
      });
      return getCategoryTitles(json);
    });

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
    const resp = await fetch(`${WIKI_ROOT}/api.php?${searchParams}`);
    return await resp.json();
  }

  async #init(): InitPromise {
    const [
      keywordRulings,
      cardRulings,
    ] = await Promise.all([
      this.#keywordRulingsCache.get(),
      this.#cardRulingsCache.get(),
    ]);

    return {keywordRulings, cardRulings};
  }

  async doesRulingsPageExist(conceptName: string): Promise<boolean> {
    return (
      await this.doesCardRulingsPageExist(conceptName) ||
      await this.doesKeywordRulingsPageExist(conceptName)
    );
  }

  async doesCardRulingsPageExist(cardName: string): Promise<boolean> {
    const cardRulings = await this.#cardRulingsCache.get();
    return cardRulings.includes(`Rulings:${cardName}`);
  }

  async doesKeywordRulingsPageExist(keyword: string): Promise<boolean> {
    const keywordRulings = await this.#keywordRulingsCache.get();
    return keywordRulings.includes(`Rulings:${keyword}`);
  }

  getRulingsUrl(cardName: string) {
    return `${WIKI_ROOT}/wiki/Rulings:${this.#conceptToWikiFormat(cardName)}`;
  }
}

function getCategoryTitles(json: any): string[] {
  if(!json.query) {
    console.error(json);
    throw new Error('Category query failed somehow');
  }

  return Object.values(json.query.pages)?.map((page: any) => page?.title) ?? [];
}
