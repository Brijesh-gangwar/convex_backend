// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ✅ Products
  products: defineTable({
    category: v.string(),
    color: v.string(),
    company: v.optional(v.string()),
    description: v.string(),
    details: v.string(),
    fabric: v.string(),
    fit: v.string(),
    images: v.optional(
      v.array(v.object({ public_id: v.string(), url: v.string() }))
    ),
    materialCare: v.string(),
    name: v.string(),
    price: v.float64(),
    size: v.string(),
    subCategory: v.string(),
    sustainable: v.string(),
    tags: v.array(v.string()),
  }),

  // ✅ User Details (with addressId inside addresses array)
  userDetails: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    fcmToken: v.optional(v.string()), // only one, optional
    addresses: v.array(
      v.object({
        addressId: v.string(), // ✅ unique id for each address
        label: v.string(),
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        country: v.string(),
        latitude: v.optional(v.string()),
        longitude: v.optional(v.string()),
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


orders: defineTable({
  orderId: v.string(), // client-provided
  userId: v.string(),
  items: v.array(
    v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      size: v.optional(v.string()),
      color: v.optional(v.string()),
      category: v.optional(v.string()),
      subCategory: v.optional(v.string()),
      image: v.optional(v.string()),
    })
  ),
  address: v.object({
    label: v.string(),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    country: v.string(),
    latitude: v.optional(v.string()),
    longitude: v.optional(v.string()),
  }),
    total: v.number(),
  paymentId: v.optional(v.string()),     // ✅ new optional field
  paymentStatus:v.string(), // optional
  paymentMethod: v.optional(v.string()), // optional
  orderStatus: v.string(),               // required
  createdAt: v.number(),
}).index("by_userId", ["userId"]),
});
