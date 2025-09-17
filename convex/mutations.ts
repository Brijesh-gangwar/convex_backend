
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
export const getWishlistByUserId = query(async (ctx, { userId }: { userId: string }) => {
  return await ctx.db.query("wishlist")
    .withIndex("by_userId", (q) => q.eq("userId", userId)) // assumes you created an index on userId
    .collect();
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
export const getCartByUserId = query(async (ctx, { userId }: { userId: string }) => {
  return await ctx.db.query("cart")
    .withIndex("by_userId", (q) => q.eq("userId", userId)) // assumes you created an index on userId
    .collect();
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


// // Create Order: Insert order with items
// export const createOrder = mutation({
//   args: {
//     userId: v.string(),
//     items: v.array(
//       v.object({
//         productId: v.id("products"),
//         name: v.string(),
//         price: v.number(),
//         quantity: v.number(),
//         size: v.string(),
//         color: v.string(),
//         category: v.string(),
//         subCategory: v.string(),
//       })
//     ),
//     total: v.optional(v.number()),
//     address: v.optional(v.object({
//       label: v.string(),
//       street: v.string(),
//       city: v.string(),
//       state: v.string(),
//       zip: v.string(),
//       country: v.string(),
//     })),
//   },
//   handler: async (ctx, { userId, items, total, address }) => {
//     const orderData: any = {
//       userId,
//       items,
//       total,
//       paymentStatus: "pending",
//       orderStatus: "pending",
//       createdAt: Date.now(),
//     };
//     if (address) {
//       orderData.address = address;
//     }
//     const orderId = await ctx.db.insert("orders", orderData);
//     return { success: true, orderId };
//   },
// });

// // Get Orders: Query orders for user
// export const getOrdersByUserId = query(async (ctx, { userId }: { userId: string }) => {
//   return await ctx.db.query("orders")
//     .withIndex("by_userId", (q) => q.eq("userId", userId)) // assumes you created an index on userId
//     .collect();
// });


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

// update user details
// ✅ Update User Details except addresses

export const updateUserDetail = mutation({
  args: {
    userId: v.string(),
    updatedFields: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      fcmToken: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { userId, updatedFields }) => {
    // Find the user by userId
    const user = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");

    // Patch only the provided fields
    await ctx.db.patch(user._id, updatedFields);

    return { success: true, updatedFields };
  },
});


// ✅ Create  user details
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

// get orders by userId
export const getOrdersByUserId = query(async (ctx, { userId }: { userId: string }) => {
  return await ctx.db.query("orders")
    .withIndex("by_userId", (q) => q.eq("userId", userId)) // assumes you created an index on userId
    .collect();
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


// ✅ Add Address with addressId
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
      latitude: v.optional(v.string()),
      longitude: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { userId, address }) => {
    // Find the user by userId
    const user = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");

    // ✅ Add unique addressId
    const newAddress = { ...address, addressId: crypto.randomUUID() };

    await ctx.db.patch(user._id, {
      addresses: [...user.addresses, newAddress],
    });

    return { success: true, address: newAddress };
  },
});

// ✅ Get User Details
export const getUserDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const customers = await ctx.db.query("userDetails").collect();
    return customers.find(c => c.userId === args.userId) || null;
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


// ✅ Get all products
export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

// Get product by ID
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ---------------------------
// ORDER MUTATIONS
// ---------------------------

// ✅ Create Order from Cart with full address snapshot
export const createOrderFromCart = mutation({
  args: {
    userId: v.string(),
    addressId: v.string(), // which saved address to use
  },
  handler: async (ctx, { userId, addressId }) => {
    // 1️⃣ Get cart items
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (cartItems.length === 0) throw new Error("Cart is empty");

    // 2️⃣ Build snapshot of items
    const snapshotItems: any[] = [];
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

    // 3️⃣ Calculate total
    const total = snapshotItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4️⃣ Fetch user details
    const user = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");

    // 5️⃣ Find the selected address by addressId
    const selectedAddress = user.addresses.find(
      (addr: any) => addr.addressId === addressId
    );
    if (!selectedAddress) throw new Error("Address not found");

    // 6️⃣ Insert order with snapshot items + full address
    const orderId = await ctx.db.insert("orders", {
      userId,
      items: snapshotItems,
      total,
      address: {
        label: selectedAddress.label,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
        country: selectedAddress.country,
        latitude: selectedAddress.latitude ?? "",
        longitude: selectedAddress.longitude ?? "",
      },
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: Date.now(),
    });

    // 7️⃣ Clear the cart
    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return orderId;
  },
});

// // ✅ Create Order from Cart
// export const createOrderFromCart = mutation({
//   args: { userId: v.string() },
//   handler: async (ctx, { userId }) => {
//     // get cart items
//     const cartItems = await ctx.db
//       .query("cart")
//       .withIndex("by_userId", (q) => q.eq("userId", userId))
//       .collect();

//     if (cartItems.length === 0) throw new Error("Cart is empty");

//     const snapshotItems: any[] = [];
//     for (const item of cartItems) {
//       const product = await ctx.db.get(item.productId);
//       if (!product) continue;

//       snapshotItems.push({
//         productId: item.productId,
//         name: product.name,
//         price: product.price,
//         quantity: item.quantity,
//         size: product.size,
//         color: product.color,
//         category: product.category,
//         subCategory: product.subCategory,
//       });
//     }

//     // Calculate total
//     const total = snapshotItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//     // insert into orders
//     const orderId = await ctx.db.insert("orders", {
//       userId,
//       items: snapshotItems,
//       total,
//       address: {
//         label: "",
//         street: "",
//         city: "",
//         state: "",
//         zip: "",
//         country: "",
//         latitude: "",
//         longitude: "",
//       },
//       paymentStatus: "pending",
//       orderStatus: "pending",
//       createdAt: Date.now(),
//     });

//     // clear cart
//     for (const item of cartItems) {
//       await ctx.db.delete(item._id);
//     }

//     return orderId;
//   },
// });



// remove address using addressId and userid

export const removeAddress = mutation({
  args: {
    userId: v.string(),
    addressId: v.string(),
  },
  handler: async (ctx, { userId, addressId }) => {
    // Find the user by userId
    const user = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");

    // Filter out the address to remove
    const updatedAddresses = user.addresses.filter(
      (addr: any) => addr.addressId !== addressId
    );

    await ctx.db.patch(user._id, { addresses: updatedAddresses });

    return { success: true };
  },
});

// ✅ Update Address by addressId
export const updateAddress = mutation({
  args: {
    userId: v.string(),
    addressId: v.string(),
    updatedFields: v.object({
      label: v.optional(v.string()),
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      zip: v.optional(v.string()),
      country: v.optional(v.string()),
      latitude: v.optional(v.string()),
      longitude: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { userId, addressId, updatedFields }) => {
    // Find the user by userId
    const user = await ctx.db
      .query("userDetails")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) throw new Error("User not found");

    // Update the specific address
    const updatedAddresses = user.addresses.map((addr: any) => {
      if (addr.addressId === addressId) {
        return { ...addr, ...updatedFields };
      }
      return addr;
    });

    await ctx.db.patch(user._id, { addresses: updatedAddresses });

    const updatedAddress = updatedAddresses.find(
      (addr: any) => addr.addressId === addressId
    );

    return { success: true, address: updatedAddress };
  },
});

