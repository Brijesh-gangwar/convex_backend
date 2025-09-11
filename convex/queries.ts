import { query } from "./_generated/server";
import { v } from "convex/values";

// Get User Details
export const getUserDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});
