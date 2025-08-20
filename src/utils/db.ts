// lib/db.ts
import { openDB } from "idb";

const DB_NAME = "myAppDB";
const STORE_NAME = "contacts";

export interface Contact {
  id?: number;
  nameContact: string;
  numberPhone: string;
}

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function addContact(contact: Contact) {
  const db = await getDB();
  await db.add(STORE_NAME, contact);
}

export async function getContacts(): Promise<Contact[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}
export async function deleteContact(id: number) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}