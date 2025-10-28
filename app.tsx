
import { Switch, Route } from "wouter";
import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import { CalendarCheck, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      {/* <Route path="/" component={Home}/> */}
      {/* Fallback to 404 */}
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
-1
+25
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
              <Link href="/">
                <a className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md -ml-3">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl text-foreground">MediAgenda</span>
                </a>
              </Link>
              
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <a>
                    <Button variant="ghost" data-testid="link-admin">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Painel Admin
                    </Button>
                  </a>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <Router />
        </div>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );