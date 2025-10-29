import {
   AudioWaveform,
   Command,
   GalleryVerticalEnd,
   House,
   UsersRound,
   MessageSquareText,
   UserRoundPlus,
   SendToBack,
   PackageSearch,
   CassetteTape,
   Server,
   TimerResetIcon,
   BookCheck,
} from "lucide-react";

export const sideBarItem = {
   user: {
      name: "The Mounting",
      email: "info@mounting.com",
      avatar: "/avatars/shadcn.jpg",
   },
   teams: [
      {
         name: "Acme Inc",
         logo: GalleryVerticalEnd,
         plan: "Enterprise",
      },
      {
         name: "Acme Corp.",
         logo: AudioWaveform,
         plan: "Startup",
      },
      {
         name: "Evil Corp.",
         logo: Command,
         plan: "Free",
      },
   ],
   navMain: [
      {
         title: "Dashboard",
         url: "/admin/dashboard",
         icon: House,
      },
      {
         title: "Blogs",
         url: "/dashboard/blogs",
         icon: MessageSquareText,
      },
      {
         title: "Categories",
         url: "/dashboard/categories",
         icon: CassetteTape,
      },
      {
         title: "Products",
         url: "/dashboard/products",
         icon: PackageSearch,
      },
      {
         title: "Services",
         url: "/dashboard/services",
         icon: Server,
      },
      {
         title: "Time Slots",
         url: "/dashboard/timeslots",
         icon: TimerResetIcon,
      },
      {
         title: "Users",
         url: "/dashboard/users",
         icon: UsersRound,
      },
      {
         title: "Orders",
         url: "/dashboard/orders",
         icon: SendToBack,
      },
      {
         title: "Bookings",
         url: "/dashboard/bookings",
         icon: BookCheck,
      },
      {
         title: "Subscriber",
         url: "/dashboard/subscribers",
         icon: UserRoundPlus,
      },
   ],
};