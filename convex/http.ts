import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/register",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { name, email, password } = await req.json();
    const result = await ctx.runMutation(api.auth.register, { name, email, password });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/login",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { email, password } = await req.json();
    const result = await ctx.runQuery(api.auth.login, { email, password });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/createTodo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { text, userId } = await req.json();
    const result = await ctx.runMutation(api.todos.createTodo, { text, userId });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/getTodos",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { userId } = await req.json();
    const result = await ctx.runQuery(api.todos.getTodos, { userId });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/updateTodo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { todoId, text, completed } = await req.json();
    await ctx.runMutation(api.todos.updateTodo, { todoId, text, completed });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/deleteTodo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { todoId } = await req.json();
    await ctx.runMutation(api.todos.deleteTodo, { todoId });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/allTodos",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    // Assuming your query supports fetching all todos
    const result = await ctx.runQuery(api.todos.getAllTodos, {});
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
