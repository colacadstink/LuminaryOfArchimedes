import { Injectable } from '@angular/core';
import {CardData, LorcanaAPI} from "lorcana-api";
import {HOURS, LocalStorageCache} from "./local-storage-cache.service";

const CACHE_VALID_FOR = 18 * HOURS;

@Injectable({
  providedIn: 'root'
})
export class LorcanaAPIService {
  #api: LorcanaAPI;
  #cardsListCache: LocalStorageCache<CardData[]>;

  constructor() {
    this.#api = new LorcanaAPI();
    this.#cardsListCache = new LocalStorageCache('cardsList', CACHE_VALID_FOR, () => this.#api.getCardsList())
  }

  getCardsList() {
    return this.#cardsListCache.get();
  }
}
