import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AddProducts } from './App.tsx';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { globalTheme } from './Styles/joy_themes.ts';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CssVarsProvider theme={globalTheme} modeStorageKey="user_theme_mode">
			<CssBaseline />

			<AddProducts />
		</CssVarsProvider>
	</StrictMode>
);
