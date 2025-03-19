import { Switch, Route, Link } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Home from "@/pages/home";
import MoviePage from "@/pages/movie";
import FavoritesPage from "@/pages/favorites";
import DiscoverPage from "@/pages/discover";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { FavoritesContext, useFavoritesProvider } from "@/hooks/useFavorites";
import { ReactNode } from "react";

function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-800 shadow-inner py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              <span className="text-xl font-bold">MovieExplorer</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Your gateway to the world of cinema</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary">Home</Link></li>
                <li><Link href="/discover" className="text-gray-600 dark:text-gray-400 hover:text-primary">Discover</Link></li>
                <li><Link href="/favorites" className="text-gray-600 dark:text-gray-400 hover:text-primary">My Favorites</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/discover?category=popular" className="text-gray-600 dark:text-gray-400 hover:text-primary">Popular</Link></li>
                <li><Link href="/discover?category=top_rated" className="text-gray-600 dark:text-gray-400 hover:text-primary">Top Rated</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">© 2024 MovieExplorer. All rights reserved.</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
            Movie data provided by <a href="https://www.themoviedb.org" className="text-primary hover:underline" target="_blank">TMDb</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movie/:id" component={MoviePage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/discover" component={DiscoverPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  const authProviderValue = useAuthProvider();
  const favoritesProviderValue = useFavoritesProvider();

  return (
    <AuthContext.Provider value={authProviderValue}>
      <FavoritesContext.Provider value={favoritesProviderValue}>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </FavoritesContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
