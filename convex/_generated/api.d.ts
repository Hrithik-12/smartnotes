/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as Note from "../Note.js";
import type * as Pdfstorage from "../Pdfstorage.js";
import type * as Schema from "../Schema.js";
import type * as langchain_db from "../langchain/db.js";
import type * as myAction from "../myAction.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  Note: typeof Note;
  Pdfstorage: typeof Pdfstorage;
  Schema: typeof Schema;
  "langchain/db": typeof langchain_db;
  myAction: typeof myAction;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
