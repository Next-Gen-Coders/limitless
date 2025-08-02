import { openDB } from "idb";

export interface CounterData {
  id: string;
  value: number;
  updatedAt: Date;
}

class IndexedDBService {
  private db: any = null;
  private readonly DB_NAME = "limitless-db";
  private readonly DB_VERSION = 1;

  async initDB() {
    if (this.db) return this.db;

    this.db = await openDB(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Create counters store
        if (!db.objectStoreNames.contains("counters")) {
          const counterStore = db.createObjectStore("counters", {
            keyPath: "id",
          });
          counterStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      },
    });

    return this.db;
  }

  async getCounter(id: string): Promise<CounterData | undefined> {
    const db = await this.initDB();
    return await db.get("counters", id);
  }

  async setCounter(id: string, value: number): Promise<void> {
    const db = await this.initDB();
    const counterData: CounterData = {
      id,
      value,
      updatedAt: new Date(),
    };
    await db.put("counters", counterData);
  }

  async getAllCounters(): Promise<CounterData[]> {
    const db = await this.initDB();
    return await db.getAll("counters");
  }

  async deleteCounter(id: string): Promise<void> {
    const db = await this.initDB();
    await db.delete("counters", id);
  }
}

export const indexedDBService = new IndexedDBService();
