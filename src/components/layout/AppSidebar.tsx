import { SidebarBrand } from "@/components/layout/SidebarBrand";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CollectionsNav } from "@/features/collections";
import { ItemTypesNav } from "@/features/items";
import { SidebarUser } from "@/features/user";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <ItemTypesNav />
        <SidebarSeparator />
        <CollectionsNav />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
