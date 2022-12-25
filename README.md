# bug reproduction of flex-gap-polyfill

I was using [windicss](https://github.com/windicss/windicss) before. Since I've switched to [unocss](https://github.com/unocss/unocss), I've found that the `flex-gap-polyfill` plugin doesn't work as expected, in a flex container with gaps, elements will have a wrong size.

Then I started to make a minimal reproduction of the bug, and found another necessary condition to reproduce the bug: the [attributify preset](https://github.com/unocss/unocss/tree/main/packages/preset-attributify) of unocss. To reproduce the bug, we need a element with a `flex` attribute (with any or none prefix). When the related css is packed, the bug will happen.

Windicss also has attributify mode, but it won't trigger this bug.

## Steps to reproduce

```bash
pnpm i
pnpm dev
```

Open `index.html`, see the follow lines and try it:

```html
<!--Delete (instead of commenting as unocss will not regard the syntax) the next line, restart the dev server and refresh the page to see the expected behavior-->
<div anyPrefix-flex="~ col"></div>
```

Or run `pnpm build` to see the output in `dist/assets/index-[hash].css`

## Reason

Unocss's output is `unocss_output.css`, and windicss's output is `windicss_output.css`. The difference is:

```css
/* Unocss */
.flex,
[anyPrefix-flex~="~"] > * > * {
  --parent-has-fgp: initial;
}
.flex,
[anyPrefix-flex~="~"] > * {
  --parent-has-fgp: !important;
  --element-has-fgp: initial;
  pointer-events: var(--parent-has-fgp) auto;
}
```

```css
/* Windicss */
.flex > * > * {
  --parent-has-fgp: initial;
}
.flex > * {
  --parent-has-fgp: !important;
  --element-has-fgp: initial;
  pointer-events: var(--parent-has-fgp) auto;
}
[anyPrefix-flex~="~"] > * > * {
  --parent-has-fgp: initial;
}
[anyPrefix-flex~="~"] > * {
  --parent-has-fgp: !important;
  --element-has-fgp: initial;
  pointer-events: var(--parent-has-fgp) auto;
}
```

It seems like that the `flex-gap-polyfill` plugin doesn't work as expected when there're multiple selectors in the same rule, which causes the bug.
