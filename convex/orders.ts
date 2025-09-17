// convex/orders.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create order from cart
export const createOrderFromCart = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .collect();

    if (cartItems.length === 0) throw new Error("Cart is empty");

    const items: any[] = [];
    for (const item of cartItems) {
      const product = await ctx.db.get(item.productId);
      if (!product) continue;
      items.push({
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

    const orderId = await ctx.db.insert("orders", {
      userId,
      items,
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: Date.now(),
      total: 0,
      address: {
        label: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
      }
    });

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return orderId;
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: { orderId: v.id("orders"), status: v.string() },
  handler: async (ctx, { orderId, status }) => {
    await ctx.db.patch(orderId, { paymentStatus: status, updatedAt: Date.now() });
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: { orderId: v.id("orders"), status: v.string() },
  handler: async (ctx, { orderId, status }) => {
    await ctx.db.patch(orderId, { orderStatus: status, updatedAt: Date.now() });
  },
});

// Get orders for a user
// export const getOrders = query({
//   args: { userId: v.string() },
//   handler: async (ctx, args) => {
//     const customers = await ctx.db.query("orders").collect();
//     return customers.find(c => c.userId === args.userId) || null;
//   },
// });


export const getOrdersByUserId = query(async (ctx, { userId }: { userId: string }) => {
  return await ctx.db.query("orders")
    .withIndex("by_userId", (q) => q.eq("userId", userId)) // assumes you created an index on userId
    .collect();
});