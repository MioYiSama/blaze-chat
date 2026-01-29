import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Data } from "effect";

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly cause: DOMException;
}> {}

export class TransactionError extends Data.TaggedError("TransactionError")<{
  readonly cause: DOMException;
}> {}

export class ObjectStoreError extends Data.TaggedError("ObjectStoreError")<{
  readonly cause: DOMException;
}> {}

export class IndexError extends Data.TaggedError("IndexError")<{
  readonly cause: DOMException;
}> {}

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly cause: readonly StandardSchemaV1.Issue[];
}> {}
