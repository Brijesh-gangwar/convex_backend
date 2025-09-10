// convex/cart.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add to cart
export const addToCart = mutation({
  args: { userId: v.string(), productId: v.id("products"), quantity: v.number() },
  handler: async (ctx, { userId, productId, quantity }) => {
    return await ctx.db.insert("cart", {
      userId,
      productId,
      quantity,
      addedAt: Date.now(),
    });
  },
});

// Update cart item
export const updateCartItem = mutation({
  args: { id: v.id("cart"), quantity: v.number() },
  handler: async (ctx, { id, quantity }) => {
    await ctx.db.patch(id, { quantity });
  },
});

// Remove from cart
export const removeFromCart = mutation({
  args: { id: v.id("cart") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Get cart items
export const getCart = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("cart")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .collect();
  },
});
