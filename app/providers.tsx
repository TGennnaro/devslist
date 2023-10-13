'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient();

export function Providers({ children, themeProps }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<NextUIProvider>
					<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
				</NextUIProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
