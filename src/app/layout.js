import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Bharat Xcelerate - Proof of Work > Credentials',
  description: 'The unified platform where Students execute real-world projects, Companies hire verified talent, and Investors discover innovation. Build your scorecard, not your resume.',
  keywords: 'Bharat Xcelerate, student projects, hire talent, investor ideas, scorecard, proof of work',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
