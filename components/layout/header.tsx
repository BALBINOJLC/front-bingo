// components/layout/header.tsx
"use client"; // Required if using hooks like useRouter or onClick handlers for logout

import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirection after logout
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react"; // To check auth state

export function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);


  useEffect(() => {
    // This check runs on the client side
    const token = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("currentUser");
    if (token && userString) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userString);
        setUserName(user.name || user.email); // Display name or email
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        // Potentially clear localStorage if data is corrupt
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("refreshToken");
      }
    } else {
      setIsAuthenticated(false);
      setUserName(null);
    }
  }, []); // Re-run if router path changes, or add a global state listener

  const handleLogout = () => {
    // Call AuthRepository.logout() if it involved a backend call.
    // For now, just client-side removal.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("refreshToken"); // Also remove refresh token
    setIsAuthenticated(false);
    setUserName(null);
    router.push("/auth/login"); // Redirect to login page
  };

  return (
    <header className="bg-black/50 backdrop-blur-md text-white py-4 px-6 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
          GoldenBingo
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-yellow-400 transition-colors">Inicio</Link>
          {isAuthenticated && (
            <Link href="/backoffice" className="hover:text-yellow-400 transition-colors">Mi Cuenta</Link>
          )}
          {/* Add other navigation links here */}
          {isAuthenticated ? (
            <>
              {userName && <span className="text-sm text-gray-300">Hola, {userName}</span>}
              <Button onClick={handleLogout} variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
