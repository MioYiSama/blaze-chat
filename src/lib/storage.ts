import { openDB, type DBSchema } from "idb";

interface MyDB extends DBSchema {
  assistants: {
    key: string;
    value: {};
  };
}

export interface Assistant {
  id: number;
  name: string;
}

const defaultAssistant: Assistant = {
  id: 0,
  name: "默认助手",
};
async function f() {
  const db = await openDB<MyDB>("my-db");
  db.add("assistants", {}, "1");
}
export function getAssistants(): Assistant[] {
  return [
    defaultAssistant,
    { id: 1, name: "Assistant 1" },
    { id: 2, name: "Assistant 2" },
  ];
}
