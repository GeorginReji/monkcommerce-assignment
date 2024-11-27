import { extendTheme } from '@mui/joy';

export const globalTheme = extendTheme({
	components: {
		JoySheet: {
			styleOverrides: {
				root: { maxWidth: '80vw', width: '100%' },
			},
		},
	},
});
