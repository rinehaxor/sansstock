import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
	exchange?: string;
	colorTheme?: 'light' | 'dark';
	dateRange?: string;
	showChart?: boolean;
	locale?: string;
	width?: string;
	height?: string;
}

export default function TradingViewWidget({
	exchange = 'IDX',
	colorTheme = 'light',
	dateRange = '12M',
	showChart = true,
	locale = 'en',
	width = '400',
	height = '550',
}: TradingViewWidgetProps) {
	const container = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!container.current) return;

		// Clear previous content
		container.current.innerHTML = '';

		const script = document.createElement('script');
		script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
		script.type = 'text/javascript';
		script.async = true;
		script.innerHTML = JSON.stringify({
			exchange,
			colorTheme,
			dateRange,
			showChart,
			locale,
			largeChartUrl: '',
			isTransparent: false,
			showSymbolLogo: false,
			showFloatingTooltip: false,
			plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
			plotLineColorFalling: 'rgba(41, 98, 255, 1)',
			gridLineColor: colorTheme === 'dark' ? 'rgba(240, 243, 250, 0)' : 'rgba(240, 243, 250, 0)',
			scaleFontColor: colorTheme === 'dark' ? '#DBDBDB' : '#83858A',
			belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
			belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
			belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
			belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
			symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
			width,
			height,
		});

		container.current.appendChild(script);

		return () => {
			if (container.current) {
				container.current.innerHTML = '';
			}
		};
	}, [exchange, colorTheme, dateRange, showChart, locale, width, height]);

	return (
		<div className="tradingview-widget-container" ref={container}>
			<div className="tradingview-widget-container__widget"></div>
			<div className="tradingview-widget-copyright">
				<a
					href="https://www.tradingview.com/"
					rel="noopener nofollow"
					target="_blank"
					className="text-xs text-gray-500 hover:text-gray-700"
				>
					<span className="text-blue-600">IHSG Market</span>
				</a>
				<span className="text-xs text-gray-500"> by TradingView</span>
			</div>
		</div>
	);
}

