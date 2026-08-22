/**
 * Mock data for the dashboard UI.
 * Single source of truth until the database is wired up — this file stands in
 * for the Prisma layer, so it is shared rather than owned by one feature.
 * The domain types live with their features. This is the one place allowed to
 * import from inside a feature rather than its barrel: going through the barrel
 * would pull the feature's components in here and create an import cycle.
 */

import type { Collection } from "@/features/collections/types";
import type { Item, ItemType } from "@/features/items/types";
import type { User } from "@/features/user/types";

export const currentUser: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: null,
  isPro: true,
};

export const itemTypes: ItemType[] = [
  {
    id: "snippet",
    name: "Snippets",
    icon: "Code",
    color: "#3b82f6",
    isSystem: true,
    itemCount: 24,
  },
  {
    id: "prompt",
    name: "Prompts",
    icon: "Sparkles",
    color: "#a855f7",
    isSystem: true,
    itemCount: 18,
  },
  {
    id: "command",
    name: "Commands",
    icon: "Terminal",
    color: "#f97316",
    isSystem: true,
    itemCount: 15,
  },
  {
    id: "note",
    name: "Notes",
    icon: "FileText",
    color: "#eab308",
    isSystem: true,
    itemCount: 12,
  },
  {
    id: "file",
    name: "Files",
    icon: "File",
    color: "#94a3b8",
    isSystem: true,
    itemCount: 5,
  },
  {
    id: "image",
    name: "Images",
    icon: "Image",
    color: "#ec4899",
    isSystem: true,
    itemCount: 3,
  },
  {
    id: "url",
    name: "Links",
    icon: "Link",
    color: "#22c55e",
    isSystem: true,
    itemCount: 8,
  },
];

export const collections: Collection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    color: "#3b82f6",
    isFavorite: true,
    itemCount: 12,
    createdAt: "2024-01-02T09:00:00.000Z",
    updatedAt: "2024-01-15T14:20:00.000Z",
  },
  {
    id: "col_python_snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    color: "#38bdf8",
    isFavorite: false,
    itemCount: 8,
    createdAt: "2024-01-03T11:30:00.000Z",
    updatedAt: "2024-01-11T08:45:00.000Z",
  },
  {
    id: "col_context_files",
    name: "Context Files",
    description: "AI context files for projects",
    color: "#94a3b8",
    isFavorite: true,
    itemCount: 5,
    createdAt: "2024-01-04T16:10:00.000Z",
    updatedAt: "2024-01-14T10:05:00.000Z",
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    color: "#eab308",
    isFavorite: false,
    itemCount: 24,
    createdAt: "2024-01-05T13:25:00.000Z",
    updatedAt: "2024-01-13T19:40:00.000Z",
  },
  {
    id: "col_git_commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    color: "#f97316",
    isFavorite: true,
    itemCount: 15,
    createdAt: "2024-01-06T07:55:00.000Z",
    updatedAt: "2024-01-12T15:15:00.000Z",
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    color: "#a855f7",
    isFavorite: false,
    itemCount: 18,
    createdAt: "2024-01-07T12:00:00.000Z",
    updatedAt: "2024-01-15T09:30:00.000Z",
  },
];

export const items: Item[] = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "text",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`,
    language: "typescript",
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "snippet",
    collectionId: "col_react_patterns",
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "text",
    content: `export async function fetchWithRetry(url: string, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    } catch (error) {
      if (attempt === retries - 1) throw error
      await new Promise((r) => setTimeout(r, 2 ** attempt * 200))
    }
  }
}`,
    language: "typescript",
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "snippet",
    collectionId: "col_react_patterns",
    tags: ["api", "fetch", "error-handling"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2024-01-12T14:30:00.000Z",
    updatedAt: "2024-01-12T14:30:00.000Z",
  },
  {
    id: "item_3",
    title: "Code Review Prompt",
    description: "Asks the model for a focused review instead of a rewrite",
    contentType: "text",
    content: `Review the diff below. Focus on correctness, edge cases and security.
Do not rewrite the code. List findings as: file, line, issue, suggested fix.`,
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "prompt",
    collectionId: "col_ai_prompts",
    tags: ["review", "ai", "workflow"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2024-01-11T08:15:00.000Z",
    updatedAt: "2024-01-14T09:00:00.000Z",
  },
  {
    id: "item_4",
    title: "Reset Branch to Remote",
    description: "Discard all local changes and match the remote branch",
    contentType: "text",
    content: "git fetch origin && git reset --hard origin/main",
    language: "bash",
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "command",
    collectionId: "col_git_commands",
    tags: ["git", "reset"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2024-01-10T17:45:00.000Z",
    updatedAt: "2024-01-10T17:45:00.000Z",
  },
  {
    id: "item_5",
    title: "Squash Last N Commits",
    description: "Interactive rebase to clean up a branch before a PR",
    contentType: "text",
    content: "git rebase -i HEAD~3",
    language: "bash",
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "command",
    collectionId: "col_git_commands",
    tags: ["git", "rebase"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-09T11:20:00.000Z",
    updatedAt: "2024-01-09T11:20:00.000Z",
  },
  {
    id: "item_6",
    title: "Flatten a Nested Dict",
    description: "Recursively flatten nested dictionaries with dotted keys",
    contentType: "text",
    content: `def flatten(d, parent=""):
    out = {}
    for key, value in d.items():
        path = f"{parent}.{key}" if parent else key
        if isinstance(value, dict):
            out.update(flatten(value, path))
        else:
            out[path] = value
    return out`,
    language: "python",
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "snippet",
    collectionId: "col_python_snippets",
    tags: ["python", "utils"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-08T09:05:00.000Z",
    updatedAt: "2024-01-08T09:05:00.000Z",
  },
  {
    id: "item_7",
    title: "Server vs Client Components",
    description: "When to reach for 'use client' in the App Router",
    contentType: "text",
    content: `Server components are the default. Reach for 'use client' only for:
- event handlers and interactivity
- hooks (useState, useEffect, context)
- browser-only APIs

Keep client components at the leaves of the tree.`,
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "note",
    collectionId: "col_interview_prep",
    tags: ["nextjs", "react", "notes"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-07T20:10:00.000Z",
    updatedAt: "2024-01-13T19:40:00.000Z",
  },
  {
    id: "item_8",
    title: "Big-O Cheat Sheet",
    description: "Time and space complexity for common data structures",
    contentType: "text",
    content: `Array access O(1), search O(n)
Hash map insert/lookup O(1) average, O(n) worst
Balanced BST insert/lookup O(log n)
Sorting (merge, heap) O(n log n)`,
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "note",
    collectionId: "col_interview_prep",
    tags: ["algorithms", "interview"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2024-01-06T18:00:00.000Z",
    updatedAt: "2024-01-06T18:00:00.000Z",
  },
  {
    id: "item_9",
    title: "project-overview.md",
    description: "Project context file handed to the AI at the start of a session",
    contentType: "file",
    content: null,
    language: null,
    url: null,
    fileName: "project-overview.md",
    fileSize: 18432,
    typeId: "file",
    collectionId: "col_context_files",
    tags: ["context", "docs"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-05T15:35:00.000Z",
    updatedAt: "2024-01-14T10:05:00.000Z",
  },
  {
    id: "item_10",
    title: "Dashboard Layout Reference",
    description: "Sidebar and grid layout mockup for the dashboard",
    contentType: "file",
    content: null,
    language: null,
    url: null,
    fileName: "dashboard-ui-main.png",
    fileSize: 486912,
    typeId: "image",
    collectionId: "col_context_files",
    tags: ["design", "ui"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-04T16:20:00.000Z",
    updatedAt: "2024-01-04T16:20:00.000Z",
  },
  {
    id: "item_11",
    title: "Tailwind CSS v4 Theme Docs",
    description: "CSS-first configuration with the @theme directive",
    contentType: "text",
    content: null,
    language: null,
    url: "https://tailwindcss.com/docs/theme",
    fileName: null,
    fileSize: null,
    typeId: "url",
    collectionId: null,
    tags: ["tailwind", "css", "docs"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2024-01-03T10:50:00.000Z",
    updatedAt: "2024-01-03T10:50:00.000Z",
  },
  {
    id: "item_12",
    title: "Commit Message Prompt",
    description: "Generates a conventional commit message from a staged diff",
    contentType: "text",
    content: `Write a conventional commit message for the staged diff.
One line, lowercase type prefix (feat, fix, chore, docs, refactor).
No body unless the change is breaking.`,
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    typeId: "prompt",
    collectionId: "col_ai_prompts",
    tags: ["git", "ai", "prompt"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-02T13:15:00.000Z",
    updatedAt: "2024-01-15T09:30:00.000Z",
  },
];
