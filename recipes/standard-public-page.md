# Standard Public Page Recipe

Use for in-scope B2BEA.org public pages that are not the home page, approved blog exceptions, approved resource exceptions, or custom HTML imports.

## Register

```html
<body data-register="public_standard">
```

## Required Structure

1. Blue page hero.
2. Clear H1 using the standard page title scale.
3. Optional subtitle.
4. Optional toolbar for search/filter.
5. Cards, table, or content layout using B2BEA primitives.
6. Empty, loading, error, and success states when dynamic.

## Minimal HTML

```html
<main class="b2bea-page">
  <header class="b2bea-page-hero">
    <div class="b2bea-page-hero__inner">
      <h1>Page title</h1>
      <p>Short useful subtitle.</p>
    </div>
  </header>
</main>
```

## Avoid

- Do not use marketing-scale hero type.
- Do not invent one-off form fields.
- Do not use unofficial logos.
- Do not publish without SEO, GEO, social, and analytics metadata.

