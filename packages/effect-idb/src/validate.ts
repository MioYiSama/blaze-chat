import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Micro, pipe } from "effect";

import { ValidationError } from "./error";

export function validate<T>(schema: StandardSchemaV1<T>, input: unknown) {
  return pipe(
    Micro.promise(async () => schema["~standard"].validate(input)),
    Micro.flatMap((result) =>
      result.issues
        ? Micro.fail(new ValidationError({ cause: result.issues }))
        : Micro.succeed(result.value),
    ),
  );
}

export function validateAll<T>(
  schema: StandardSchemaV1<T>,
  input: readonly unknown[],
): Micro.Micro<readonly T[], ValidationError> {
  return Micro.forEach(
    input,
    (item) =>
      pipe(
        Micro.promise(async () => schema["~standard"].validate(item)),
        Micro.flatMap((result) =>
          result.issues
            ? Micro.fail(new ValidationError({ cause: result.issues }))
            : Micro.succeed(result.value),
        ),
      ),
    { concurrency: "unbounded" },
  );
}
