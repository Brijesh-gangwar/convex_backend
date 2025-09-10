// convex/wishlist.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add product to wishlist
export const addToWishlist = mutation({
  args: { userId: v.string(), productId: v.id("products") },
  handler: async (ctx, { userId, productId }) => {
    return await ctx.db.insert("wishlist", {
      userId,
      productId,
      createdAt: Date.now(),
    });
  },
});

// Remove product from wishlist
export const removeFromWishlist = mutation({
  args: { id: v.id("wishlist") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Get wishlist for user
export const getWishlist = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("wishlist")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .collect();
  },
});
