import { component$ } from "@builder.io/qwik";

type Props = {
  size?: number;
  color?: string;
};

export const Search = component$(({ size = 16, color = "#DADADA" }: Props) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="6" stroke={color} />
      <path d="M16 16L13 13" stroke={color} stroke-linecap="round" />
    </svg>
  );
});
