// import { component$, $ } from "@builder.io/qwik";
// import {
//   type DocumentHead,
//   useLocation,
//   z,
//   routeLoader$,
// } from "@builder.io/qwik-city";
// import { appTitle, signInScreenDescription } from "~/utils";
// import { useAuthSignin } from "../../plugin@auth";
// import { URLS } from "~/utils/constants";
// import {
//   useForm,
//   type InitialValues,
//   zodForm$,
//   type SubmitHandler,
// } from "@modular-forms/qwik";

// const loginSchema = z.object({
//   email: z
//     .string()
//     .min(1, "Please enter your email.")
//     .email("The email address is badly formatted."),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
//   email: "",
// }));

// export default component$(() => {
//   const [, { Form, Field }] = useForm<LoginForm>({
//     loader: useFormLoader(),
//     validate: zodForm$(loginSchema),
//   });
//   const signIn = useAuthSignin();
//   const location = useLocation();
//   const callbackUrl = location.url.searchParams.get("callbackUrl") ?? URLS.HOME;

//   const handleSubmit = $<SubmitHandler<LoginForm>>(async (values) => {
//     await signIn.submit({
//       providerId: "email",
//       options: {
//         callbackUrl: callbackUrl,
//         email: values.email,
//       },
//     });
//   });

//   return (
//     <div class="flex flex-col justify-center p-4 h-full">
//       <Form class="flex flex-col gap-2" onSubmit$={handleSubmit}>
//         <Field name="email">
//           {(field, props) => (
//             <div class="flex flex-col items-stretch">
//               <label for="email">Email</label>
//               <input
//                 class="border border-green-600 p-2 rounded-lg"
//                 {...props}
//                 type="email"
//                 value={field.value}
//               />
//               {field.error && <p class="text-red-700">{field.error}</p>}
//             </div>
//           )}
//         </Field>
//         <button class="rounded-lg bg-green-600 text-white p-2">
//           Sign in with email
//         </button>
//       </Form>
//     </div>
//   );
// });

// export const head: DocumentHead = {
//   title: `${appTitle} | Sign in`,
//   meta: [
//     {
//       name: "description",
//       content: signInScreenDescription,
//     },
//   ],
// };
