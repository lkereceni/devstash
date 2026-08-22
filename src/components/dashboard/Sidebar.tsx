import { SidebarBrand } from "@/components/dashboard/SidebarBrand";
import { SidebarCollections } from "@/components/dashboard/SidebarCollections";
import { SidebarTypes } from "@/components/dashboard/SidebarTypes";
import { SidebarUser } from "@/components/dashboard/SidebarUser";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function Sidebar() {
  return (
    <SidebarRoot collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <SidebarTypes />
        <SidebarSeparator />
        <SidebarCollections />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  );
}
