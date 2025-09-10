import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const createTodo = mutation({
  args: { text: v.string(), userId: v.id("users") },
  handler: async (ctx, { text, userId }) => {
    return await ctx.db.insert("todos", {
      userId,
      text,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const getTodos = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const updateTodo = mutation({
  args: {
    todoId: v.id("todos"),
    text: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, { todoId, ...updates }) => {
    if (!updates.text && updates.completed === undefined)
      throw new ConvexError("No updates provided.");
    await ctx.db.patch(todoId, updates);
  },
});

export const deleteTodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, { todoId }) => {
    await ctx.db.delete(todoId);
  },
});

export const getAllTodos = query(async (ctx) => {
  return await ctx.db.query("todos").collect();
});
