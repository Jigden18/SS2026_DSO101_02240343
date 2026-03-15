import './globals.css';

export const metadata = {
  title: 'Todo App',
  description: 'Full-stack Todo List Application — DSO101 Assignment 1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}