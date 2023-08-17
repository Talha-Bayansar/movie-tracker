import { component$, type JSXNode, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Home } from "~/icons";
import { URLS } from "~/utils";

type NavItem = {
  icon: JSXNode;
  link: string;
};

const navItems: NavItem[] = [
  {
    link: URLS.HOME,
    icon: <Home color="#F09531" />,
  },
];

export default component$(() => {
  return (
    <>
      <div class="flex-grow flex flex-col overflow-y-scroll p-4">
        <header class=""></header>
        <main class="flex flex-col">
          <Slot />
        </main>
      </div>
      <footer class="p-4">
        <nav class="flex justify-evenly items-center">
          {navItems.map((item) => (
            <Link key={`navItem_${item.link}`} href={item.link}>
              {item.icon}
            </Link>
          ))}
        </nav>
      </footer>
    </>
  );
});
