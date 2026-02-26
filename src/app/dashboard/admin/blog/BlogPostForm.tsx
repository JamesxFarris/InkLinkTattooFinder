"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BlogPostFormProps = {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    status: string;
  };
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function BlogPostForm({ action, initial }: BlogPostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [content, setContent] = useState(initial?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        try {
          await action(formData);
        } catch {
          setSubmitting(false);
        }
      }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500"
          placeholder="How Much Does a Sleeve Tattoo Cost?"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="mt-1 block w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-mono text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500"
          placeholder="how-much-does-a-sleeve-tattoo-cost"
        />
        <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
          URL: /blog/{slug || "..."}
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={initial?.excerpt ?? ""}
          className="mt-1 block w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500"
          placeholder="A short summary shown on the blog index and in search results..."
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Cover Image URL <span className="text-stone-400">(optional)</span>
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="url"
          defaultValue={initial?.coverImage ?? ""}
          className="mt-1 block w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500"
          placeholder="https://res.cloudinary.com/..."
        />
      </div>

      {/* Content with Write/Preview tabs */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
            Content <span className="text-stone-400">(Markdown)</span>
          </label>
          <div className="flex gap-1 rounded-lg bg-stone-100 p-0.5 dark:bg-stone-800">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                tab === "write"
                  ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-stone-100"
                  : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                tab === "preview"
                  ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-stone-100"
                  : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {tab === "write" ? (
          <textarea
            id="content"
            name="content"
            required
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 font-mono text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500"
            placeholder="Write your post content in Markdown..."
          />
        ) : (
          <>
            {/* Hidden input so content is submitted even on preview tab */}
            <input type="hidden" name="content" value={content} />
            <div className="prose prose-stone mt-1 max-w-none rounded-lg border border-stone-200 bg-white p-6 prose-headings:font-display prose-a:text-teal-600 dark:prose-invert dark:border-stone-700 dark:bg-stone-900 dark:prose-a:text-teal-400">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-stone-400 dark:text-stone-500">
                  Nothing to preview yet...
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={initial?.status ?? "draft"}
          className="mt-1 block w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : initial ? "Update Post" : "Create Post"}
        </button>
        <a
          href="/dashboard/admin/blog"
          className="rounded-lg bg-stone-100 px-6 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
