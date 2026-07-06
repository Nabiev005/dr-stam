import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --primary: #0d9488;
    --primary-hover: #0f766e;
    --primary-light: #ccfbf1;
    --primary-faint: #f0fdfa;

    --bg: #f0fdfa;
    --card: #ffffff;
    --border: #e2e8f0;

    --text: #0f172a;
    --text-2: #334155;
    --text-muted: #64748b;
    --text-subtle: #94a3b8;

    --red: #ef4444;
    --red-bg: #fee2e2;
    --green: #10b981;
    --green-bg: #dcfce7;
    --blue: #3b82f6;
    --orange: #f97316;

    --sidebar: #0f172a;

    --shadow-sm: 0 1px 3px rgba(15,23,42,0.07), 0 1px 2px rgba(15,23,42,0.04);
    --shadow: 0 4px 12px rgba(15,23,42,0.08);
    --shadow-lg: 0 8px 24px rgba(15,23,42,0.10);
    --shadow-xl: 0 20px 40px rgba(15,23,42,0.12);

    --radius-sm: 8px;
    --radius: 12px;
    --radius-lg: 20px;
    --radius-xl: 24px;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI',
      system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    background-color: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior: none;
  }

  #root { display: contents; }

  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  input, select, textarea { font-family: inherit; outline: none; }
  a { text-decoration: none; color: inherit; }
  h1, h2, h3, h4 { line-height: 1.25; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
`;
