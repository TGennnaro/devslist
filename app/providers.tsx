'use client';

import { SetStateAction, createContext, useState } from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-wrap-balancer';

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
	unread: number;
}

const queryClient = new QueryClient();

export const UnreadMessagesContext = createContext<any>({});

export function Providers({ children, themeProps, unread }: ProvidersProps) {
	const [unreadMessages, setUnreadMessages] = useState(unread);

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<NextUIProvider>
					<NextThemesProvider {...themeProps}>
						<UnreadMessagesContext.Provider
							value={{ unreadMessages, setUnreadMessages }}
						>
							<Provider>{children}</Provider>
						</UnreadMessagesContext.Provider>
					</NextThemesProvider>
				</NextUIProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
