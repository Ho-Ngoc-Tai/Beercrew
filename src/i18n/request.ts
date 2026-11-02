import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Can be extracted from cookies, headers, or query params
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "vi";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
