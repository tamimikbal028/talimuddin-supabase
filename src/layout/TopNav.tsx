import { NavLink, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSchool,
  FaUserShield,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import { authHooks } from "@/hooks/useAuth";
import { branchHooks } from "@/hooks/useBranch";

const TopNav = () => {
  const location = useLocation();
  const { user, isAppAdmin } = authHooks.useUser();
  const { data: myBranchData } = branchHooks.useMyBranch();

  // Dynamic profile path - uses username
  const profilePath = user?.userName ? `/profile/${user.userName}` : "/profile";

  const navigationItems = [
    {
      icon: FaHome,
      label: "Home",
      path: "/branch/all",
      display: true,
      active: location.pathname === "/branch/all",
    },
    {
      icon: FaSchool,
      label: "My Branch",
      path: "/branch",
      display: !isAppAdmin && (myBranchData?.data?.meta?.branchCount ?? 0) > 0,
      active: location.pathname === "/branch",
    },
    {
      icon: FaSearch,
      label: "Search",
      path: "/branch/search",
      display: true,
      active: location.pathname === "/branch/search",
    },
    {
      icon: FaUserShield,
      label: "Make Branch Admin",
      path: "/branch/make-admin",
      display: isAppAdmin,
      active: location.pathname === "/branch/make-admin",
    },
    {
      icon: FaUser,
      label: "Profile",
      path: profilePath,
      display: true,
      active: location.pathname === profilePath,
    },
  ];

  return (
    <>
      {navigationItems.map((item, index) => {
        if (!item.display) {
          return null;
        }
        return (
          <NavLink
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-200 ${
              item.active
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title={item.label}
          >
            <item.icon className="h-7 w-7" />
          </NavLink>
        );
      })}
    </>
  );
};

export default TopNav;
