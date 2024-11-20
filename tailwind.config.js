import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["var(--font-sans)"],
  			mono: ["var(--font-mono)"]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))',
					item: 'var(--sidebar-item)'
  			},
				//================================ User DashBoard ================================
				// 总览卡片颜色
				"overview-card": 'var(--overview-card)',

				// 贡献图 颜色
				"contribution-graph": {
					0: 'var(--contribution-graph-0)',
					1: 'var(--contribution-graph-1)',
					2: 'var(--contribution-graph-2)',
					3: 'var(--contribution-graph-3)',
					4: 'var(--contribution-graph-4)',
					5: 'var(--contribution-graph-5)',
					6: 'var(--contribution-graph-6)',
					7: 'var(--contribution-graph-7)',
					8: 'var(--contribution-graph-8)',
					9: 'var(--contribution-graph-9)',
					10: 'var(--contribution-graph-10)',
				}
  		},
  	}
  },
  darkMode: ["class",],
	plugins: [
		nextui({
			themes: {
				light: {
					colors: {
						background: "#FFFFFF", // or DEFAULT
						foreground: "#11181C", // or 50 to 900 DEFAULT
						primary: {
							//... 50 to 900
							foreground: "#FFFFFF",
							DEFAULT: "#006FEE",
						},
						// ... rest of the colors
					},
				},
				dark: {
					colors: {
						background: "#000000", // or DEFAULT
						foreground: "#ECEDEE", // or 50 to 900 DEFAULT
						primary: {
							//... 50 to 900
							foreground: "#FFFFFF",
							DEFAULT: "#006FEE",
						},
					},
					// ... rest of the colors
				},
				mytheme: {
					// custom theme
					extend: "dark",
					colors: {
						primary: {
							DEFAULT: "#BEF264",
							foreground: "#000000",
						},
						focus: "#BEF264",
					},
				},
			},
		}),
		require("tailwindcss-animate"),
		require('@tailwindcss/typography'),
	],
	// 设置颜色 safelist：始终被 JIT（即时编译）模式解析
	safelist: [
		{
			pattern: /bg-contribution-graph-\d+/,
		},
	],
}
