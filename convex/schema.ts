import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // clerkId
    email: v.string(),
    name: v.string(),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
    lemonSqueezyCustomerId: v.optional(v.string()),
    lemonSqueezyOrderId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  codeExecutions: defineTable({
    userId: v.string(),
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  snippets: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
    userName: v.string(), // store user's name for easy access
  }).index("by_user_id", ["userId"]),

  snippetComments: defineTable({
    snippetId: v.id("snippets"), // Reference to the snippet 
    userId: v.string(),
    userName: v.string(),
    content: v.string(), // This will store HTML content
  }).index("by_snippet_id", ["snippetId"]),

  stars: defineTable({
    userId: v.string(),
    snippetId: v.id("snippets"),
  })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),

  feedback: defineTable({
      userId: v.string(),
      userName: v.string(),
      userProfileUrl: v.string(),
      userRole: v.string(),
      rating: v.number(),
      content: v.string(),
  }).index("by_user_id", ["userId"])
    .index("by_rating", ["rating"]),

  sessions: defineTable({
    code: v.string(),
    language: v.string(),
    ownerId: v.string(),
    ownerName: v.string(),
    activeUsers: v.array(
      v.object({
        userId: v.string(),
        userName: v.string(),
        userImageUrl: v.string(),
        cursor: v.optional(v.any()), 
        selection: v.optional(v.any()),
      })
    ),
  }).index("by_ownerId", ["ownerId"]),
});