import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get session details
export const get = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new ConvexError("Session not found");
    }
    return session;
  },
});

// Create a new session
export const createSession = mutation({
  args: {
    code: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to create a session");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Create the session
    const sessionId = await ctx.db.insert("sessions", {
      code: args.code,
      language: args.language,
      ownerId: user.userId,
      ownerName: user.name,
      activeUsers: [], // Start with no active users
    });

    return sessionId;
  },
});

// Join a session
export const joinSession = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to join a session");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new ConvexError("Session not found");
    }

    // Check if user is already in the activeUsers array
    const userAlreadyInSession = session.activeUsers.some(
      (u) => u.userId === identity.subject
    );

    if (userAlreadyInSession) {
      return; // Already joined
    }

    // Add the new user to the activeUsers array
    await ctx.db.patch(args.sessionId, {
      activeUsers: [
        ...session.activeUsers,
        {
          userId: identity.subject,
          userName: identity.name || "Anonymous",
          userImageUrl: identity.pictureUrl || "",
        },
      ],
    });
  },
});

// Leave a session
export const leaveSession = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Not logged in, can't leave
      return;
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      return; // Session doesn't exist
    }

    // Remove the user from the activeUsers array
    const updatedUsers = session.activeUsers.filter(
      (u) => u.userId !== identity.subject
    );

    await ctx.db.patch(args.sessionId, {
      activeUsers: updatedUsers,
    });
  },
});

export const updateCode = mutation({
  args: {
    sessionId: v.id("sessions"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new ConvexError("Session not found");
    }

    // Optional: You could add a check here to ensure
    // only active users can edit, but for simplicity, we'll allow it.

    await ctx.db.patch(args.sessionId, {
      code: args.code,
    });
  },
});

export const updateUserActivity = mutation({
  args: {
    sessionId: v.id("sessions"),
    cursor: v.optional(v.any()),
    selection: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new ConvexError("Session not found");
    }

    // Find the current user in the activeUsers array
    const userIndex = session.activeUsers.findIndex(
      (u) => u.userId === identity.subject
    );

    if (userIndex === -1) {
      // User not in session, maybe they just left. Do nothing.
      return;
    }

    // Update only the cursor and selection for this user
    const user = session.activeUsers[userIndex];
    session.activeUsers[userIndex] = {
      ...user,
      cursor: args.cursor,
      selection: args.selection,
    };

    // Patch the session with the updated activeUsers array
    await ctx.db.patch(args.sessionId, {
      activeUsers: session.activeUsers,
    });
  },
});