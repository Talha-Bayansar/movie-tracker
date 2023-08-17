import { component$ } from "@builder.io/qwik";
import { Home } from "./Home";
import { SignIn } from "./SignIn";
import { Search } from "./Search";

export enum IconNames {
  HOME = "home",
  SIGN_IN = "sign-in",
  SEARCH = "search",
}

type Props = {
  name: IconNames;
  color?: string;
  size?: number;
};

export const Icon = component$(({ name, color, size = 16 }: Props) => {
  switch (name) {
    case "home":
      return <Home color={color} size={size} />;
    case "sign-in":
      return <SignIn color={color} size={size} />;
    case "search":
      return <Search color={color} size={size} />;

    default:
      return null;
  }
});
