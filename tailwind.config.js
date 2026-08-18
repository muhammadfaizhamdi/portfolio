/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./js/**/*.js"],
  darkMode: "class",
  theme: {
      extend: {
          colors: {
              "zinc-bg": "#F4F4F5",
              "charcoal": "#1C1917",
              "vermilion": "#FF4500"
          },
          spacing: {
              "gutter": "24px",
              "baseline": "8px",
              "margin-edge": "48px",
              "bento-gap": "16px"
          },
          fontFamily: {
              "display-2xl": ["Plus Jakarta Sans", "sans-serif"],
              "body-md": ["Inter", "sans-serif"],
              "label-caps": ["JetBrains Mono", "monospace"],
              "code-sm": ["JetBrains Mono", "monospace"],
              "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
              "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"]
          },
          fontSize: {
              "display-2xl": ["120px", { lineHeight: "110px", letterSpacing: "-0.04em", fontWeight: "800" }],
              "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
              "label-caps": ["12px", { lineHeight: "16px", fontWeight: "700" }],
              "code-sm": ["13px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }],
              "headline-lg": ["64px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "700" }],
              "headline-lg-mobile": ["40px", { lineHeight: "44px", fontWeight: "700" }]
          }
      }
  },
  plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/container-queries')
  ],
}