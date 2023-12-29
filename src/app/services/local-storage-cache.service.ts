
export type LocalStorageCacheFetcher<T> = () => T | Promise<T>;

type LocalStorageCacheEnvelope<T> = {
  value: T,
  expires: number,
}

export const HOURS = 1000 * 60 *60;
export class LocalStorageCache<T> {
  constructor(
    private name: string,
    private validForMillis: number,
    private fetcher: LocalStorageCacheFetcher<T>,
  ) { }

  async get(forceRefresh = false): Promise<T> {
    const envelopeString = localStorage.getItem(this.name);
    const envelope: LocalStorageCacheEnvelope<T> | null = JSON.parse(envelopeString ?? 'null');
    if(envelope && envelope.expires > Date.now() && !forceRefresh) {
      return envelope.value;
    }

    const newEnvelope: LocalStorageCacheEnvelope<T> = {
      expires: Date.now() + this.validForMillis,
      value: await this.fetcher(),
    };
    localStorage.setItem(this.name, JSON.stringify(newEnvelope));
    return newEnvelope.value;
  }
}
