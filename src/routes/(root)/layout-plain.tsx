import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Icon, IconNames } from "~/shared/icons";
import { NavButton } from "~/shared";
import { URLS } from "~/utils";

type NavItem = {
  iconName: IconNames;
  href: string;
  pathName: string;
  title: string;
};

const navItems: NavItem[] = [
  {
    href: URLS.HOME,
    iconName: IconNames.HOME,
    pathName: "/",
    title: "Movies",
  },
  {
    href: URLS.SEARCH,
    iconName: IconNames.SEARCH,
    pathName: "/search/",
    title: "Search",
  },
];

export default component$(() => {
  const location = useLocation();

  return (
    <>
      <div class="flex flex-col flex-grow">
        <main class="flex flex-col flex-grow">
          <Slot />
        </main>
        <footer class="px-4 pb-6 pt-10 sticky bottom-0 bg-gradient-to-t from-c-background to-transparent from-75%">
          <nav class="flex justify-evenly items-center">
            {navItems.map((item) => {
              const isActive = location.url.pathname === item.pathName;
              return (
                <Link key={`navItem_${item.href}`} href={item.href}>
                  <NavButton isActive={isActive}>
                    <Icon
                      size={24}
                      name={item.iconName}
                      color={isActive ? "#F09531" : "#DADADA"}
                    />
                  </NavButton>
                </Link>
              );
            })}
          </nav>
        </footer>
      </div>
    </>
  );
});
