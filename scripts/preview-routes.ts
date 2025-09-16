// scripts/preview-routes.ts
// Pomocnicze trasy dla podglądu komponentów bez pełnej aplikacji

export const previewRoutes = [
  {
    path: "/preview/components/app-button",
    component: "AppButton",
    variants: [
      {
        name: "primary",
        props: { variant: "primary", children: "Primary Button" },
      },
      {
        name: "secondary",
        props: { variant: "secondary", children: "Secondary Button" },
      },
      {
        name: "outline",
        props: { variant: "outline", children: "Outline Button" },
      },
      { name: "ghost", props: { variant: "ghost", children: "Ghost Button" } },
      {
        name: "loading",
        props: { variant: "primary", loading: true, children: "Loading..." },
      },
      {
        name: "disabled",
        props: { variant: "primary", disabled: true, children: "Disabled" },
      },
    ],
  },
  {
    path: "/preview/components/status-badge",
    component: "StatusBadge",
    variants: [
      { name: "active", props: { status: "active", size: "md" } },
      { name: "pending", props: { status: "pending", size: "md" } },
      { name: "completed", props: { status: "completed", size: "md" } },
      { name: "small", props: { status: "active", size: "sm" } },
      { name: "large", props: { status: "active", size: "lg" } },
    ],
  },
];

// Generator URL-i dla manifestu
export function generateManifestFromRoutes() {
  const items = [];

  for (const route of previewRoutes) {
    for (const variant of route.variants) {
      items.push({
        name: `${route.component}_${variant.name}`,
        kind: "ui/atoms",
        url: `http://localhost:5173${route.path}?variant=${variant.name}`,
        root: "#root",
      });
    }
  }

  return { items };
}
