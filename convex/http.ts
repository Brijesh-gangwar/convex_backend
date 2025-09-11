const http = httpRouter();

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";


// -------------------- ORDER PAYMENT STATUS --------------------
http.route({
  path: "/order/payment",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    // Expecting: { orderId: string, paymentStatus: string }
    const result = await ctx.runMutation(api.mutations.updatePaymentStatus, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});


// -------------------- USER --------------------
http.route({
  path: "/user",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const user = await ctx.runMutation(api.mutations.createUser, body);
    return new Response(JSON.stringify(user), { status: 200 });
  }),
});

http.route({
  path: "/user/{userId}",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    // Extract userId from the path (last segment)
    const userId = url.pathname.split("/").pop()!;
  const user = await ctx.runQuery(api.queries.getUserDetails, { userId });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    return new Response(JSON.stringify(user), { status: 200 });
  }),
});

http.route({
  path: "/user/address",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.addAddress, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

http.route({
  path: "/user/fcm",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.updateFcmToken, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

// -------------------- WISHLIST --------------------
http.route({
  path: "/wishlist/{userId}",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const userId = (ctx as any).userId;
    const wishlist = await ctx.runQuery(api.mutations.getWishlist, { userId });
    return new Response(JSON.stringify(wishlist), { status: 200 });
  }),
});

http.route({
  path: "/wishlist",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.addToWishlist, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

http.route({
  path: "/wishlist",
  method: "DELETE",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.removeFromWishlist, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

// -------------------- CART --------------------
http.route({
  path: "/cart/{userId}",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const userId = (ctx as any).userId;
    const cart = await ctx.runQuery(api.mutations.getCart, { userId });
    return new Response(JSON.stringify(cart), { status: 200 });
  }),
});

http.route({
  path: "/cart",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.addToCart, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

http.route({
  path: "/cart",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.updateCartItem, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

http.route({
  path: "/cart",
  method: "DELETE",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.removeFromCart, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

// -------------------- ORDER --------------------
http.route({
  path: "/order",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.createOrder, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

http.route({
  path: "/order/{userId}",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const userId = (ctx as any).userId;
    const orders = await ctx.runQuery(api.mutations.getOrders, { userId });
    return new Response(JSON.stringify(orders), { status: 200 });
  }),
});

http.route({
  path: "/order/status",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.updateOrderStatus, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

export default http;
