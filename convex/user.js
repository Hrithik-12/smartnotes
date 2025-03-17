import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createuser = mutation({
    args: {
        Email: v.string(),
        UserName: v.string(),
        Imageurl: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("Received args:", args); // Add logging
        
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("Email"), args.Email))
            .collect();
        
        if (!user || user.length === 0) {
            const id = await ctx.db.insert("users", {
                Email: args.Email,
                UserName: args.UserName,
                Imageurl: args.Imageurl
            });
            return { success: true, id };
        }
        return { success: false, message: "User already exists" };
    },
});