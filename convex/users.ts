import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";


export const userHasAccess = (user: Doc<"users">): boolean =>{
  const trialEndsAt = user.trialEndsAt ?? 0;
  const isInTrial = trialEndsAt > Date.now();
  
  return user.isPro || isInTrial;
};

export const syncUser = mutation({
      args: {
            userId: v.string(),
            email: v.string(),
            name: v.string(),
      },
     handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      
      const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;

      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        isPro: false,
        trialEndsAt: Date.now() + FIVE_DAYS_IN_MS,
        hasSeenTrialModal: false,
      });
    }
  },
});

export const markTrialModalAsSeen = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) throw new ConvexError("User not found");

    await ctx.db.patch(user._id, { hasSeenTrialModal: true });
  },
});

export const getUser = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) return null;

    return user;
  },
});


export const upgradeToPro = mutation({
  args: {
    email: v.string(),
    lemonSqueezyCustomerId: v.string(),
    lemonSqueezyOrderId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      isPro: true,
      proSince: Date.now(),
      lemonSqueezyCustomerId: args.lemonSqueezyCustomerId,
      lemonSqueezyOrderId: args.lemonSqueezyOrderId,
    });

    return { success: true };
  },
});

export const searchUsers = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.query.length < 2) {
      return [];
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return []; 
    }
    
    const users = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .take(5);

    return users.filter((user) => user.userId !== identity.subject);
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});