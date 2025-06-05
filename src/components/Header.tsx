
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, LogOut, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VIBE CODERS
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Leaderboard
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary">
                    Overview
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px]">
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/overview/text"
                        >
                          <div className="text-sm font-medium leading-none">Text</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Text generation models
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/overview/webdev"
                        >
                          <div className="text-sm font-medium leading-none">WebDev</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Web development models
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/overview/vision"
                        >
                          <div className="text-sm font-medium leading-none">Vision</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Vision and image models
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/overview/text-to-image"
                        >
                          <div className="text-sm font-medium leading-none">Text-to-Image</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Image generation models
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/overview/search"
                        >
                          <div className="text-sm font-medium leading-none">Search</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Search and retrieval models
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/overview/copilot"
                        >
                          <div className="text-sm font-medium leading-none">Copilot</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Code assistance models
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/top-performers" className="text-foreground hover:text-primary transition-colors">
              Top Performers
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            
            {!loading && (
              user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-2" onClick={signOut}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="text-foreground hover:text-primary transition-colors">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="flex flex-col space-y-4 p-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <div className="text-foreground">
                <div className="font-medium mb-2">Overview</div>
                <div className="ml-4 space-y-2">
                  <Link to="/overview/text" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Text</Link>
                  <Link to="/overview/webdev" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>WebDev</Link>
                  <Link to="/overview/vision" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Vision</Link>
                  <Link to="/overview/text-to-image" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Text-to-Image</Link>
                  <Link to="/overview/search" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Search</Link>
                  <Link to="/overview/copilot" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Copilot</Link>
                </div>
              </div>
              <Link 
                to="/top-performers" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Top Performers
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {!loading && (
                user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/settings" 
                      className="text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => { setIsMenuOpen(false); signOut(); }}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
