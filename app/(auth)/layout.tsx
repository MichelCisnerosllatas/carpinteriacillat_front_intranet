// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div data-auth className="min-h-screen bg-bg text-fg">
            {children}
        </div>
    );
}
