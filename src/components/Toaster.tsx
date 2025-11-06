import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
	return (
		<HotToaster
			position="top-right"
			toastOptions={{
				duration: 4000,
				style: {
					background: '#fff',
					color: '#374151',
					border: '1px solid #e5e7eb',
					borderRadius: '0.5rem',
					padding: '12px 16px',
					fontSize: '14px',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				},
				success: {
					iconTheme: {
						primary: '#10b981',
						secondary: '#fff',
					},
					style: {
						border: '1px solid #10b981',
					},
				},
				error: {
					iconTheme: {
						primary: '#ef4444',
						secondary: '#fff',
					},
					style: {
						border: '1px solid #ef4444',
					},
				},
			}}
		/>
	);
}

