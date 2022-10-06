module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        navbar: "#000",
        home: "#f2f4f8",
        primaryBackground: "rgb(107,33,168)",
      },
      colors: {
        "input-border": "rgb(107,33,168)",
        primaryColor: "rgb(107,33,168)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
