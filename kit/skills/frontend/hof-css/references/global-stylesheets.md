# Global Stylesheet Layering

Global CSS load order is fixed in `nuxt.config.js` `css: [...]`. The numeric prefixes encode the cascade order — respect them when adding files:

```
fonts.css
@openreachtech/furo-nuxt … 0000.furo.css
                         … 0010.variables-palette-color-scale.css
                         … 0020.variables-z-index.css
                         … 0100.reset.css
assets/css/0110.reset.css                    ← app reset overrides
@openreachtech/furo-nuxt … 0200.base.css
                         … 0300.gimmick.css
assets/css/variables-component-default.css
assets/css/variables.css                     ← app design tokens
assets/css/main.css                          ← app global styles
```

Rules:
- Furo layers load first; app overrides come after the corresponding Furo file.
- Global, cross-page styles → `assets/css/main.css`. Component-scoped styles stay in the component's `<style scoped>`.
- New global CSS files must be registered in `nuxt.config.js` with a numeric prefix that places them correctly in the cascade.
