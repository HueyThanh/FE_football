import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import CalendarIcon from "@heroicons/react/24/solid/CalendarIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import ChartBarSquareIcon from "@heroicons/react/24/solid/ChartBarSquareIcon";
import CreditCardIcon from "@heroicons/react/24/solid/CreditCardIcon";
import GlobeEuropeAfricaIcon from "@heroicons/react/24/solid/GlobeEuropeAfricaIcon";
import { SvgIcon } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { OBJECT_ROLE } from "src/AppConst";

export const items = () => {
  const auth = useAuth();
  let { user } = auth;

  let isCoach = user?.role === OBJECT_ROLE.Coach.name;
  let isAssistant = user?.role === OBJECT_ROLE.Assistant.name;

  const roleBasedItems = [
    {
      title: "Overview",
      path: "/",
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      ),
    },
    {
      title: "Manage player information",
      path: "/manage-player",
      icon: (
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
      ),
    },
    isCoach && {
      title: "Team management",
      path: "/manage-team",
      icon: (
        <SvgIcon fontSize="small">
          <UserGroupIcon />
        </SvgIcon>
      ),
    },
    isCoach && {
      title: "Team away management",
      path: "/manage-team-away",
      icon: (
        <SvgIcon fontSize="small">
          <UserGroupIcon />
        </SvgIcon>
      ),
    },
    {
      title: "Schedule and matches",
      path: "/manage-calendar",
      icon: (
        <SvgIcon fontSize="small">
          <CalendarIcon />
        </SvgIcon>
      ),
    },
    isCoach && {
      title: "Tournaments",
      path: "/tournaments",
      icon: (
        <SvgIcon fontSize="small">
          <GlobeEuropeAfricaIcon />
        </SvgIcon>
      ),
    },
  ];

  return roleBasedItems.filter(Boolean);
};
