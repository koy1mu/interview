import { AppProps } from "next/app";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: { main: "#1976d2" },
		secondary: { main: "#9c27b0" },
	},
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}
