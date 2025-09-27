import { openDB, type DBSchema } from "idb";

type Assistant = {
  id?: number;
  name: string;
};

interface Schema extends DBSchema {
  assistants: {
    key: number;
    value: Assistant;
  };
}

const db = await openDB<Schema>("blaze-chat", 1, {
  async upgrade(db) {
    const assistants = db.createObjectStore("assistants", {
      keyPath: "id",
      autoIncrement: true,
    });

    await assistants.add({
      id: 0,
      name: "默认助手",
    });
  },
});

export async function getAssistants() {
  return await db.getAll("assistants");
}

export async function addAssistant(name: string) {
  await db.add("assistants", {
    name,
  });
}

export async function getAssistantById(id: number) {
  return await db.get("assistants", id);
}
