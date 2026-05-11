import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/layout/Sidebar";
import MainContent from "@/layout/MainContent";
import TopNav from "@/layout/TopNav";
import { authHooks, AUTH_KEYS } from "@/hooks/useAuth";

const App = () => {
  const queryClient = useQueryClient();

  const { isCheckingAuth, isAuthenticated } = authHooks.useUser();

  // Global logout event listener
  // Axios interceptor fires this when all tokens expire
  useEffect(() => {
    const handleLogout = () => {
      console.log("Global logout event received");
      // Clear user data in cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [queryClient]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center text-2xl font-semibold text-gray-600 sm:text-5xl">
        Checking Authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <MainContent />;
  }

  return (
    <>
      {/* Page shell */}
      <div className="flex h-dvh flex-col overflow-hidden bg-gray-100">
        <div className="fixed top-0 right-0 left-0 z-30 flex items-center justify-around bg-white py-2 shadow-sm lg:hidden">
          <TopNav />
        </div>

        {/* Sidebar + Main content area */}
        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[15rem_1fr]">
          <div className="hidden h-full overflow-y-auto border-r border-gray-200 bg-gray-50 lg:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="h-full overflow-y-auto scroll-smooth pt-15 lg:pt-0">
            <div className="mx-auto w-full max-w-[850px] space-y-5 p-3 sm:px-5">
              <MainContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
