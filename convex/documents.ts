import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel"
import { error } from "console";

export const archive = mutation({
	args: {
		id: v.id("documents")
	},
	handler: async (ctx, args) => {
		const id = await ctx.auth.getUserIdentity();

		if (!id)
			throw new Error("Not authenticated");

		const userId = id.subject;

		const existingdocument = await ctx.db.get(args.id);

		if (!existingdocument)
			throw new Error("Document not found");

		if (existingdocument.userId !== userId)
			throw new Error("Not authorized to archive this document");

		const recursiveArchive = async (id: Id<"documents">) => {
			const children = await ctx.db.query("documents")
				.withIndex("byUserId_parent", (q) => (
					q.eq("userId", userId)
						.eq("parentDocument", id)
				)).collect();
			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: true
				});
				await recursiveArchive(child._id);
			}
		}

		const document = await ctx.db.patch(args.id, {
			isArchived: true
		});

		await recursiveArchive(args.id);

		return document;
	}
})

export const getSidebar = query({
	args: {
		parentDocument: v.optional(v.id("documents"))
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const documents = await ctx.db.query("documents")
			.withIndex("byUserId_parent", (q) =>
				q.eq("userId", userId)
					.eq("parentDocument", args.parentDocument))
			.filter((q) => q.eq(q.field("isArchived"), false))
			.order("desc")
			.collect();
		return documents
	}
})


export const create = mutation({
	args: {
		title: v.string(),
		parentDocument: v.optional(v.id("documents"))
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const document = await ctx.db.insert("documents", {
			title: args.title,
			parentDocument: args.parentDocument,
			userId,
			isArchived: false,
			isPublished: false
		});

		return document
	}
})

export const getTrash = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const documents = await ctx.db.query("documents")
			.withIndex("byUserId", (q) => q.eq("userId", userId))
			.filter((q) => q.eq(q.field("isArchived"), true))
			.order("desc")
			.collect();

		return documents
	}
});

export const restore = mutation({
	args: { id: v.id("documents") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const document = await ctx.db.get(args.id);

		if (!document)
			throw new Error("Document not found");

		if (document.userId !== userId)
			throw new Error("Not authorized to restore this document");

		const recursiveRestore = async (documentId: Id<"documents">) => {
			const children = await ctx.db.query("documents")
				.withIndex("byUserId_parent", (q) => (
					q.eq("userId", userId)
						.eq("parentDocument", documentId)
				)).collect();

			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: false
				});
				await recursiveRestore(child._id);
			}

		}

		const options: Partial<Doc<"documents">> = {
			isArchived: false
		}

		if (document.parentDocument) {
			const parentDocument = await ctx.db.get(document.parentDocument);
			if (parentDocument?.isArchived) {
				options.parentDocument = undefined;
			}
		}

		const value = await ctx.db.patch(args.id, options);

		recursiveRestore(args.id);

		return value;
	}
})
export const deleteDocument = mutation({
	args: { id: v.id("documents") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const document = await ctx.db.get(args.id);

		if (!document)
			throw new Error("Document not found");

		if (document.userId !== userId)
			throw new Error("Not authorized to delete this document");

		await ctx.db.delete(args.id);
	}
});

export const remove = mutation({
	args: { id: v.id("documents") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const document = await ctx.db.get(args.id);

		if (!document)
			throw new Error("Document not found");

		if (document.userId !== userId)
			throw new Error("Not authorized to remove this document");

		const value = await ctx.db.delete(args.id);

		return value;
	}
});

export const getSearch = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const documents = await ctx.db.query("documents").withIndex("byUserId", (q) => q.eq("userId", userId)).filter((q) => q.eq(q.field("isArchived"), false)).order("desc").collect();

		return documents;
	}
});

export const getById = query({
	args: {documentId: v.id("documents")},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		const document = await ctx.db.get(args.documentId);
		if (!document)
			throw new Error("Document not found");
		if(document.isPublished && !document.isArchived)
			return document;

		if (!identity)
			throw new Error("Not authenticated");
		const userId = identity.subject;
		
		if (document.userId !== userId)
			throw new Error("Not authorized to view this document");
		return document;
	}
});

export const update = mutation({
	args: {
		id: v.id("documents"),
		title: v.optional(v.string()),
		content: v.optional(v.string()),
		icon: v.optional(v.string()),
		isPublished: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const {id, ...rest} = args;

		const existingdocument = await ctx.db.get(args.id);

		if (!existingdocument)
			throw new Error("Document not found");

		if (existingdocument.userId !== userId)
			throw new Error("Not authorized to update this document");

		const document = await ctx.db.patch(args.id, {...rest});

		return document;
	}
});

export const removeIcon = mutation({
	args: { id: v.id("documents") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity)
			throw new Error("Not authenticated");

		const userId = identity.subject;

		const document = await ctx.db.get(args.id);

		if (!document)
			throw new Error("Document not found");

		if (document.userId !== userId)
			throw new Error("Not authorized to remove this document");

		const value = await ctx.db.patch(args.id, {
			icon: undefined
		});

		return value;
	}
})