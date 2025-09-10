import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  todos: defineTable({
    userId: v.id("users"),
    text: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
