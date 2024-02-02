import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [nextui({
		layout: {
			spacingUnit: 4,
			radius: {
				small: "0.25rem",
				medium: "0.5rem",
				large: "0.75rem",
			},
			borderWidth: {
				small: "1px",
				medium: "1px",
				large: "2px",
			},
		},
		themes: {

			dark: {
				colors: {
					background: {
						DEFAULT: "#111827",
						foreground: "#f3f4f6"
					},
					content1: {
						DEFAULT: "#1f2937",
						foreground: "#f3f4f6"
					},
					content2: {
						DEFAULT: "#374151",
						foreground: "#f3f4f6"
					},
					default: {
						50: "#030712",
						100: "#111827",
						200: "#1f2937",
						300: "#374151",
						400: "#4b5563",
						500: "#6b7280",
						600: "#9ca3af",
						700: "#d1d5db",
						800: "#e5e7eb",
						900: "#f3f4f6",
						950: "#f9fafb"
					},
					border: {
						DEFAULT: "#374151"
					},
					danger: {
						DEFAULT: "#ef4444",
						50: "#fef2f2",
						100: "#fee2e2",
						200: "#fecaca",
						300: "#fca5a5",
						400: "#f87171",
						500: "#ef4444",
						600: "#dc2626",
						700: "#b91c1c",
						800: "#991b1b",
						900: "#7f1d1d",
						950: "#450a0a",
					}
				}
			},
			light: {
				colors: {
					background: {
						DEFAULT: "#fff",
						foreground: "#030712"
					},
					border: {
						DEFAULT: "#e5e7eb"
					}
				}
			}
		}
	})],
}
