import SignInForm from "./SignInForm";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error } = await searchParams;
  return <SignInForm initialError={typeof error === "string" ? error : undefined} />;
}