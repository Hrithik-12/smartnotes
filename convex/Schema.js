import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    Email: v.string(),
    UserName: v.string(),
    Imageurl: v.string(),
  }),
  Pdf: defineTable({
    FileId: v.string(),
    StorageId: v.string(),
    CreatedBy: v.string(),
    FileName: v.string(),
    Fileurl: v.string(),
    createdAt: v.string(),
  }),
  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),
  SavedNotes: defineTable({
    FileId: v.string(),
    Note: v.string(),
    CreatedBy: v.string(),
    createdAt: v.number(),
  }).index("by_fileId", ["FileId"]),
});