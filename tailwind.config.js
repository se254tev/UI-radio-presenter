export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090b12",
        surface: "#111827",
        accent: "#7c3aed",
        muted: "#9ca3af",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};
