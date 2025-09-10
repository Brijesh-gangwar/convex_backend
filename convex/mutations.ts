// Update Payment Status: Patch payment status for an order
export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    paymentStatus: v.string(),
  },
  handler: async (ctx, { orderId, paymentStatus }) => {
    await ctx.db.patch(orderId, { paymentStatus });
    return { success: true };
  },
});
// ---------------------------
// PLACEHOLDER MUTATIONS/QUERIES FOR HTTP ROUTES
// ---------------------------

// Create User: Actually upsert user in DB
export const createUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        phone: args.phone,
      });
      return { success: true, userId: args.userId, id: existing._id };
    }
    const id = await ctx.db.insert("userDetails", {
      ...args,
      fcmToken: undefined,
      addresses: [],
    });
    return { success: true, userId: args.userId, id };
  },
});

// Add to Wishlist: Insert wishlist item
export const addToWishlist = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, { userId, productId }) => {
    // Prevent duplicates
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .unique();
    if (existing) return { success: true, id: existing._id };
    const id = await ctx.db.insert("wishlist", { userId, productId, createdAt: Date.now() });
    return { success: true, id };
  },
});

// Get Wishlist: Query wishlist items for user
export const getWishlist = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Remove from Wishlist: Delete wishlist item
export const removeFromWishlist = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, { userId, productId }) => {
    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .unique();
    if (!item) return { success: false, error: "Not found" };
    await ctx.db.delete(item._id);
    return { success: true };
  },
});

// Get Cart: Query cart items for user
export const getCart = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Update Cart Item: Patch quantity for cart item
export const updateCartItem = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, { userId, productId, quantity }) => {
    const item = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .unique();
    if (!item) return { success: false, error: "Not found" };
    await ctx.db.patch(item._id, { quantity });
    return { success: true };
  },
});

// Create Order: Insert order with items
export const createOrder = mutation({
  args: {
    userId: v.string(),
    items: v.array(v.any()),
  },
  handler: async (ctx, { userId, items }) => {
    const orderId = await ctx.db.insert("orders", {
      userId,
      items,
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: Date.now(),
    });
    return { success: true, orderId };
  },
});

// Get Orders: Query orders for user
export const getOrders = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Update Order Status: Patch order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, { orderId, status }) => {
    await ctx.db.patch(orderId, { orderStatus: status });
    return { success: true };
  },
});
// convex/mutations.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------
// USER MUTATIONS
// ---------------------------

// ✅ Create or update user details
export const upsertUserDetails = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        phone: args.phone,
      });
      return existing._id;
    }

    return await ctx.db.insert("userDetails", {
      ...args,
      fcmToken: undefined,
      addresses: [],
    });
  },
});

// ✅ Update FCM Token
export const updateFcmToken = mutation({
  args: { userId: v.string(), fcmToken: v.string() },
  handler: async (ctx, { userId, fcmToken }) => {
    const user = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { fcmToken });
    return { success: true };
  },
});

// ✅ Add Address
export const addAddress = mutation({
  args: {
    userId: v.string(),
    address: v.object({
      label: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
  },
  handler: async (ctx, { userId, address }) => {
    const user = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { addresses: [...user.addresses, address] });
    return { success: true };
  },
});

// ✅ Get User Details
export const getUserDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

// ---------------------------
// CART MUTATIONS
// ---------------------------

// ✅ Add to Cart
export const addToCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, { userId, productId, quantity }) => {
    const existing = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + quantity,
      });
      return existing._id;
    }

    return await ctx.db.insert("cart", {
      userId,
      productId,
      quantity,
      addedAt: Date.now(),
    });
  },
});

// ✅ Remove from Cart
export const removeFromCart = mutation({
  args: { userId: v.string(), productId: v.id("products") },
  handler: async (ctx, { userId, productId }) => {
    const item = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .unique();

    if (!item) throw new Error("Item not found in cart");
    await ctx.db.delete(item._id);
    return { success: true };
  },
});

// ---------------------------
// ORDER MUTATIONS
// ---------------------------

// ✅ Create Order from Cart
export const createOrderFromCart = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // get cart items
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (cartItems.length === 0) throw new Error("Cart is empty");

    const snapshotItems = [];
    for (const item of cartItems) {
      const product = await ctx.db.get(item.productId);
      if (!product) continue;

      snapshotItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: product.size,
        color: product.color,
        category: product.category,
        subCategory: product.subCategory,
      });
    }

    // insert into orders
    const orderId = await ctx.db.insert("orders", {
      userId,
      items: snapshotItems,
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: Date.now(),
    });

    // clear cart
    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return orderId;
  },
});
