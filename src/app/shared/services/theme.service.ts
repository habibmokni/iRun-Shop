import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'irun-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	readonly mode = signal<ThemeMode>(this.getInitialMode());

	constructor() {
		// Apply the class on every change and persist to localStorage
		effect(() => {
			const mode = this.mode();
			document.documentElement.classList.toggle('dark-theme', mode === 'dark');
			document.documentElement.classList.toggle('light-theme', mode === 'light');
			localStorage.setItem(STORAGE_KEY, mode);
		});
	}

	toggle(): void {
		this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
	}

	private getInitialMode(): ThemeMode {
		const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
		if (stored === 'light' || stored === 'dark') return stored;
		// Respect OS preference
		if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
		return 'light';
	}
}
