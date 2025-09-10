// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ✅ Products
  products: defineTable({
    name: v.string(),
    description: v.string(),
    details: v.string(),
    category: v.string(),
    subCategory: v.string(),
    price: v.number(),
    size: v.string(),
    color: v.string(),
    fabric: v.string(),
    fit: v.string(),
    materialCare: v.string(),
    sustainable: v.string(),
    tags: v.array(v.string()),
  }),

  // ✅ User Details
  userDetails: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    fcmToken: v.optional(v.string()), // only one, optional
    addresses: v.array(
      v.object({
        label: v.string(),
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        country: v.string(),
      })
    ),
  }).index("by_userId", ["userId"]),

  // ✅ Wishlist
  wishlist: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // ✅ Cart
  cart: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
    addedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // ✅ Orders
  orders: defineTable({
    userId: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.string(),
        color: v.string(),
        category: v.string(),
        subCategory: v.string(),
      })
    ),
    paymentStatus: v.string(), // "pending" | "paid" | "failed"
    orderStatus: v.string(),   // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),
});
