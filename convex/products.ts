import { query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Get all products
// export const getAllProducts = query({
//   args: {},
//   handler: async (ctx) => {
//     return await ctx.db.query("products").collect();
//   },
// });


// ✅ Simple Pagination for Products
export const getAllProducts = query({
  args: {
    limit: v.number(),               // how many items per page
    cursor: v.optional(v.string()),  // continuation cursor
  },
  handler: async (ctx, args) => {
    const { limit, cursor } = args;

    const result = await ctx.db.query("products").paginate({
      numItems: limit,
      cursor: cursor ?? null,
    });

    return {
      page: result.page,                   // products for this page
      isDone: result.isDone,               // true if no more products
      continueCursor: result.continueCursor, // send this for next page
    };
  },
});

// ✅ Get product by ID
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
