import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const GetNotes = query({
    args: {
        FileId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            if (!args.FileId) {
                return '';
            }

            const records = await ctx.db
                .query('SavedNotes')
                .withIndex('by_fileId')  // Use the defined index
                .filter((q) => q.eq('FileId', args.FileId))
                .order('desc')
                .first();

            if (!records) {
                return '';
            }

            return records.Note ?? '';

        } catch (error) {
            console.error('GetNotes Error:', error);
            return '';
        }
    }
});

export const AddNote = mutation({
    args: {
        FileId: v.string(),
        Note: v.string(),
        CreatedBy: v.string(),
    },
    handler: async (ctx, args) => {
        const existingNote = await ctx.db
            .query('SavedNotes')
            .withIndex('by_fileId')
            .filter((q) => q.eq('FileId', args.FileId))
            .first();

        if (!existingNote) {
            await ctx.db.insert('SavedNotes', {
                FileId: args.FileId,
                Note: args.Note,
                CreatedBy: args.CreatedBy,
                createdAt: Date.now(),
            });
        } else {
            await ctx.db.patch(existingNote._id, {
                Note: args.Note
            });
        }
    }
});


