import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private initPromise: Promise<void>;

  constructor(private storage: Storage) {
    this.initPromise = this.init();
  }

  private async init(): Promise<void> {
    this._storage = await this.storage.create();
  }

  private async ready(): Promise<Storage> {
    await this.initPromise;

    if (!this._storage) {
      throw new Error('Storage not initialized');
    }

    return this._storage;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const storage = await this.ready();
    await storage.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    const storage = await this.ready();
    const value = await storage.get(key);
    return value ?? null;
  }

  async remove(key: string): Promise<void> {
    const storage = await this.ready();
    await storage.remove(key);
  }

  async clear(): Promise<void> {
    const storage = await this.ready();
    await storage.clear();
  }
}