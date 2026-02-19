import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Bharat Xcelerate - Proof of Work > Credentials',
  description: 'The unified platform where Students execute real-world projects, Companies hire verified talent, and Investors discover innovation. Build your scorecard, not your resume.',
  keywords: 'Bharat Xcelerate, student projects, hire talent, investor ideas, scorecard, proof of work',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <DataProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
