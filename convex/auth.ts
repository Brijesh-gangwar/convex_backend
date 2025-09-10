import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const register = mutation({
  args: { name: v.string(), email: v.string(), password: v.string() },
  handler: async (ctx, { name, email, password }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingUser) throw new ConvexError("Email already exists.");

    return await ctx.db.insert("users", {
      name,
      email,
      password,
      createdAt: Date.now(),
    });
  },
});

export const login = query({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user || user.password !== password)
      throw new ConvexError("Invalid email or password.");

    return user._id;
  },
});
