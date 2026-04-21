/// <reference types="vite/client" />

interface ArcDesktopRequestPayload {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
}

interface ArcDesktopResponsePayload {
	ok: boolean;
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
	time: number;
	size: number;
	error?: string;
}

interface Window {
	arcApi?: {
		sendRequest: (payload: ArcDesktopRequestPayload) => Promise<ArcDesktopResponsePayload>;
		openExternal: (url: string) => Promise<void>;
	};
	arcWindow?: {
		minimize: () => Promise<void>;
		maximizeToggle: () => Promise<boolean>;
		isMaximized: () => Promise<boolean>;
		close: () => Promise<void>;
	};
}
