import { component$ } from "@builder.io/qwik";

type Props = {
  size?: number;
  color?: string;
};

export const Home = component$(({ size = 16, color = "#DADADA" }: Props) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 8.75961C1 7.40185 1 6.72297 1.27446 6.12623C1.54892 5.52949 2.06437 5.08769 3.09525 4.20407L4.09525 3.34693C5.95857 1.7498 6.89023 0.951233 8 0.951233C9.10977 0.951233 10.0414 1.7498 11.9047 3.34693L12.9047 4.20407C13.9356 5.08769 14.4511 5.52949 14.7255 6.12623C15 6.72297 15 7.40185 15 8.75961V13C15 14.8856 15 15.8284 14.4142 16.4142C13.8284 17 12.8856 17 11 17H5C3.11438 17 2.17157 17 1.58579 16.4142C1 15.8284 1 14.8856 1 13V8.75961Z"
        stroke={color}
      />
      <path
        d="M10.5 17V12C10.5 11.4477 10.0523 11 9.5 11H6.5C5.94772 11 5.5 11.4477 5.5 12V17"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
});
