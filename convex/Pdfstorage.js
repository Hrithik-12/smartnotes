import { useMutation } from "convex/react";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const Addpdffiletodb = mutation({
  args: {
    FileId: v.string(),
    StorageId: v.string(),
    CreatedBy: v.string(),
    FileName: v.string(),
    Fileurl: v.string(), // Added Fileurl to the arguments
  },
  handler: async (ctx, args) => {
    try {
      const newFile = await ctx.db.insert("Pdf", {
        FileId: args.FileId,
        StorageId: args.StorageId,
        CreatedBy: args.CreatedBy,
        FileName: args.FileName,
        Fileurl: args.Fileurl,
        createdAt: new Date().toISOString(),
      });
      return { success: true, id: newFile };
    } catch (error) {
      console.error("Error inserting file:", error);
      throw error;
    }
  },
});

export const geturl = mutation({
  args: {
    StorageId: v.string()
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.StorageId);
    return url;
  }
});

export const GetfileRecord = query({
  args: {
    FileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Querying for FileId:", args.FileId); // Debug log
      
      const record = await ctx.db
        .query("Pdf")
        .filter((q) => q.eq(q.field("FileId"), args.FileId))
        .unique();
      
      console.log("Found record:", record); // Debug log
      return record;
    } catch (error) {
      console.error("Error in GetfileRecord:", error);
      throw error;
    }
  },
});
export const Getuserfile=query({
  args:{
    userEmail:v.string(),
  },
  handler:async (ctx,args)=>{
    const res=await ctx.db.query('Pdf').filter((q)=>q.eq(q.field('CreatedBy'),args.userEmail)).collect();
    return res;
  }
})