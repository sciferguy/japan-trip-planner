/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)"
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)"
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)"
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)"
        },
        sakura: {
          50: "#fef7f7",
          100: "#feecec",
          200: "#fcd6d7",
          300: "#f8b5b7",
          400: "#f18a8d",
          500: "#e75a5f",
          600: "#d63c42",
          700: "#b32c32",
          800: "#95282d",
          900: "#7d262b",
          950: "#441013"
        },
        bamboo: {
          50: "#f5f8f0",
          100: "#e8f0db",
          200: "#d3e2ba",
          300: "#b4cd8e",
          400: "#96b868",
          500: "#7ba047",
          600: "#608036",
          700: "#4b632c",
          800: "#3d5026",
          900: "#344323",
          950: "#1a240f"
        },
        stone: {
          50: "#f8f8f6",
          100: "#efede7",
          200: "#ddd8cf",
          300: "#c4beaf",
          400: "#a89f8b",
          500: "#958973",
          600: "#837765",
          700: "#6e6356",
          800: "#5a5249",
          900: "#49443d",
          950: "#26231f"
        },
        tea: {
          50: "#f9f7f4",
          100: "#f1ebe3",
          200: "#e1d5c6",
          300: "#cdb8a1",
          400: "#b6977a",
          500: "#a67f5f",
          600: "#996f54",
          700: "#7f5a47",
          800: "#674a3d",
          900: "#543d33",
          950: "#2d1f19"
        }
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'mobile-header': '4rem',
        'mobile-bottom-nav': '5rem',
        'mobile-content': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 4rem - 5rem)',
      },
      minHeight: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'touch-target': '44px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out"
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "sans-serif"],
        heading: ["Inter", "Noto Sans JP", "sans-serif"]
      },
      boxShadow: {
        zen: "0 4px 20px -2px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
        "zen-lg": "0 10px 40px -4px rgba(0,0,0,0.1), 0 4px 16px -4px rgba(0,0,0,0.06)",
        "mobile": "0 -2px 16px -2px rgba(0,0,0,0.1)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};