// See https://blog.logrocket.com/dealing-with-links-in-next-js/ for motivation.
// Also see `Hyperlink` Component

// STATIC PATHS:

export const STATIC_PATHS = {
  about: "/triangles",
  home: "/",
} as const;

// DYNAMIC PATHS:
// paths can be functions
// this also makes it easier to change from "id" to "slug" in the future

type SlugPath = {
  href: string;
  as: string;
} & { _isSlugPathFunc: true };

type SlugPathFunc = ({ id }: { id: string }) => SlugPath;

function toSlugPath(path: string): SlugPathFunc {
  return (({ id }: { id: string }) => {
    return {
      href: `/${path}/[id]`,
      as: `/${path}/${id}`,
    };
  }) as SlugPathFunc; // coerce the `_isSlugPathFunc` property, so we can do type analysis on it.
}

export const DYNAMIC_PATHS = {
  blog: toSlugPath("blog"),
};

type StaticPathKeys = keyof typeof STATIC_PATHS;
type StaticPathValues = typeof STATIC_PATHS[StaticPathKeys];

export type Path = StaticPathValues | SlugPath;
