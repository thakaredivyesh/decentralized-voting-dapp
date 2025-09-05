// components/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeIcon,
  UserIcon,
  UsersIcon,
  ClipboardListIcon,
  ChartBarIcon,
  CogIcon,
} from "@heroicons/react/outline";

const navItems = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Register Voter", path: "/register-voter", icon: UserIcon },
  { name: "Register Candidate", path: "/register-candidate", icon: UsersIcon },
  { name: "Voters", path: "/voters", icon: ClipboardListIcon },
  { name: "Candidates", path: "/candidates", icon: UsersIcon },
  { name: "Vote", path: "/vote", icon: ClipboardListIcon },
  { name: "Results", path: "/results", icon: ChartBarIcon },
  { name: "Admin", path: "/admin", icon: CogIcon },
];

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6 text-2xl font-bold text-indigo-600">
        Voting DApp
      </div>
      <nav>
        {navItems.map((item) => (
          <Link href={item.path} key={item.name}>
            <div
              className={`flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-100 ${
                router.pathname === item.path ? "bg-indigo-200 font-semibold" : ""
              }`}
            >
              <item.icon className="h-5 w-5 mr-3 text-indigo-600" />
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
