import { Micro, pipe } from "effect";
import * as v from "valibot";

import { Database } from "./database";
import { defineObjectStoreSchema } from "./object-store";

const userSchema = v.object({
  id: v.string(),
  name: v.string(),
  age: v.number(),
});

const db = await Micro.runPromise(
  Database.open("", 1, {
    user: defineObjectStoreSchema({
      schema: userSchema,
      key: "id",
    }),
  }),
);

const result = await Micro.runPromise(
  db.useTransaction("user", "readonly", (tx) =>
    pipe(
      tx.objectStore("user"),
      Micro.flatMap((x) => x.get("0")),
    ),
  ),
);

console.log(result);
