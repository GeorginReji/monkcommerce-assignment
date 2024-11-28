import { extendTheme } from '@mui/joy';

export const globalTheme = extendTheme({
	colorSchemes: {
		light: {
		  palette: {
			primary: {
			  // Credit:
			  // https://github.com/tailwindlabs/tailwindcss/blob/master/src/public/colors.js
				50: '#ecfdf5',
				100: '#d1fae5',
				200: '#a7f3d0',
				300: '#6ee7b7',
				400: '#34d399',
				500: '#10b981',
				600: '#059669',
				700: '#047857',
				800: '#065f46',
				900: '#064e3b',

			  // Adjust the global variant tokens as you'd like.
			  // The tokens should be the same for all color schemes.
			  plainColor: "var(--joy-palette-primary-500, #10b981)",
			  plainHoverBg: "var(--joy-palette-primary-100, #d1fae5)",
			  plainActiveBg: "var(--joy-palette-primary-200, #a7f3d0)",
			  plainDisabledColor: "var(--joy-palette-neutral-400, #9FA6AD)",
			  outlinedColor: "var(--joy-palette-primary-500, #10b981)",
			  outlinedBorder: "var(--joy-palette-primary-300, #6ee7b7)",
			  outlinedHoverBg: "var(--joy-palette-primary-100, #d1fae5)",
			  outlinedActiveBg: "var(--joy-palette-primary-200, #a7f3d0)",
			  outlinedDisabledColor: "var(--joy-palette-neutral-400, #9FA6AD)",
			  outlinedDisabledBorder: "var(--joy-palette-neutral-200, #DDE7EE)",
			  softColor: "var(--joy-palette-primary-700, #047857)",
			  softBg: "var(--joy-palette-primary-100, #d1fae5)",
			  softHoverBg: "var(--joy-palette-primary-200, #a7f3d0)",
			  softActiveColor: "var(--joy-palette-primary-800, #065f46)",
			  softActiveBg: "var(--joy-palette-primary-300, #6ee7b7)",
			  softDisabledColor: "var(--joy-palette-neutral-400, #9FA6AD)",
			  softDisabledBg: "var(--joy-palette-neutral-50, #FBFCFE)",
			  solidColor: "var(--joy-palette-common-white, #FFF)",
			  solidBg: "var(--joy-palette-primary-500, #10b981)",
			  solidHoverBg: "var(--joy-palette-primary-600, #059669)",
			  solidActiveBg: "var(--joy-palette-primary-700, #047857)",
			  solidDisabledColor: "var(--joy-palette-neutral-400, #9FA6AD)",
			  solidDisabledBg: "var(--joy-palette-neutral-100, #F0F4F8)",
			  mainChannel: "16 185 129",
			  lightChannel: "209 250 229",
			  darkChannel: "4 120 87",
			},
		  },
		}},
	components: {
		JoySheet: {
			styleOverrides: {
				root: { maxWidth: '80vw', width: '100%' },
			},
		},
	},
});
