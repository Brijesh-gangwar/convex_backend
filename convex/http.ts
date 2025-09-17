import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
// ✅ call query, not mutation
import { Id } from "./_generated/dataModel"; // adjust path if needed

// ...


const http = httpRouter();


// -------------------- GET CART BY USER ID (Query Param) --------------------
http.route({
  path: "/cart/getByUserId",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "Missing userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

  const cart = await ctx.runQuery(api.cart.getCartByUserId, { userId });

    if (!cart) {
      return new Response(
        JSON.stringify({ message: "No cart found for this user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(cart), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/order/getByUserId",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "Missing userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

  const orders = await ctx.runQuery(api.orders.getOrdersByUserId, { userId });

    if (!orders) {
      return new Response(
        JSON.stringify({ message: "No orders found for this user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(orders), {
      headers: { "Content-Type": "application/json" },
    });
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


// add address
http.route({
  path: "/user/address",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
  const result = await ctx.runMutation(api.mutations.addAddress, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});




// ✅ Update Address
http.route({
  path: "/user/address",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const result = await ctx.runMutation(api.mutations.updateAddress, body);
    return new Response(JSON.stringify(result), { status: 200 });
  }),
});

// ✅ Remove Address
http.route({
  path: "/user/address",
  method: "DELETE",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const result = await ctx.runMutation(api.mutations.removeAddress, body);
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

http.route({
  path: "/wishlist/getByUserId",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "Missing userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

  const wishlist = await ctx.runQuery(api.wishlist.getWishlistByUserId, { userId });

    if (!wishlist) {
      return new Response(
        JSON.stringify({ message: "No wishlist found for this user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(wishlist), {
      headers: { "Content-Type": "application/json" },
    });
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
  const result = await ctx.runMutation(api.mutations.createOrderFromCart, body);
    return new Response(JSON.stringify(result), { status: 200 });
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

// update user details

http.route({
  path: "/user/update",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();

      // Validate required fields
      const { userId, updatedFields } = body;
      if (!userId || !updatedFields) {
        return new Response(
          JSON.stringify({ message: "Missing userId or updatedFields" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runMutation(api.mutations.updateUserDetail, {
        userId,
        updatedFields,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});



http.route({
  path: "/user/getByUserId",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "Missing userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Assuming you already have a query like api.queries.getCartById
    const user = await ctx.runQuery(api.userDetails.getUserDetails, { userId });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Cart not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});



// -------------------- GET ALL PRODUCTS --------------------
// http.route({
//   path: "/products/getAll",
//   method: "GET",
//   handler: httpAction(async (ctx, req) => {
//     try {
//       const products = await ctx.runQuery(api.mutations.getAllProducts, {});
//       return new Response(JSON.stringify(products), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (err: any) {
//       return new Response(
//         JSON.stringify({ message: err.message }),
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }
//   }),
// });


// -------------------- GET ALL PRODUCTS WITH PAGINATION --------------------
http.route({
  path: "/products/getAll",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);

    const limit = Number(url.searchParams.get("limit")) || 10; // default = 10
    const cursor = url.searchParams.get("cursor") || undefined;

    try {
      const products = await ctx.runQuery(api.products.getAllProducts, {
        limit,
        cursor,
      });

      return new Response(JSON.stringify(products), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ message: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// -------------------- GET PRODUCT BY ID --------------------
http.route({
  path: "/products/getById",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const productId = url.searchParams.get("id"); // /products/getById?id=<productId>

    if (!productId) {
      return new Response(
        JSON.stringify({ message: "Missing productId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const product = await ctx.runQuery(api.products.getProductById, {
        id: productId as any, // cast because Convex Id<> is stricter
      });

      if (!product) {
        return new Response(
          JSON.stringify({ message: "Product not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(product), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ message: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});






export default http;
