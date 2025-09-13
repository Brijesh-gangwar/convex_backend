
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
const http = httpRouter();

// -------------------- GET USER BY ID (Express-style /get/:userId) --------------------
http.route({
  path: "/get/{userId}",   // ✅ Convex syntax
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    try {
      const { pathname } = new URL(req.url);
      const userId = pathname.split("/").pop(); // or parse regex if needed

      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const customer = await ctx.runQuery(api.userDetails.getUserDetails, {
        userId,
      });

      if (!customer) {
        return new Response(
          JSON.stringify({ message: "Customer not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(customer), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message ?? "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

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


// -------------------- CASHFREE PAYMENT --------------------
http.route({
  path: "/cashfree/create-order",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();


    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "x-client-id": "TEST106725695c949e5b51106a0f061796527601",
        "x-client-secret": "cfsk_ma_test_de7445b385ba6c73b2a8e3f384aa8abc_a757ce74",
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: "order_" + Date.now(),
        order_amount: body.amount,
        order_currency: "INR",
        customer_details: {
          customer_id: body.userId,
          customer_email: body.email,
          customer_phone: body.phone,
        },
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});


// verify order status
http.route({
  path: "/cashfree/verify-order",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { orderId } = await req.json();

    const response = await fetch(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id":"TEST106725695c949e5b51106a0f061796527601",
        "x-client-secret":"cfsk_ma_test_de7445b385ba6c73b2a8e3f384aa8abc_a757ce74",
        "x-api-version": "2022-09-01",
      },
    });

    const data = await response.json();

    // Optionally, update order/payment status in Convex DB
    if (data.order_status === "PAID") {
      await ctx.runMutation(api.mutations.updatePaymentStatus, {
        orderId,
        paymentStatus: "PAID",
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});



export default http;
