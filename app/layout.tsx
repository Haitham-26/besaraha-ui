import type { Metadata } from "next";
import "./globals.css";
import { cairoFont } from "./fonts";
import { Header } from "./components/Header";
import getToken from "@/tools/getToken";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Providers";
import Footer from "./components/Footer";
import { MobilePrivateBottomBar } from "./components/MobilePrivateBottomBar";
import { getLocale, getMessages } from "next-intl/server";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { NextIntlClientProvider } from "next-intl";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "بصراحة",
  description:
    "شارك أسئلتك ودع أصدقاءك يجيبون عليها بشكل سري، أو استقبل رسائل سرية منهم.",
  themeColor: "#0f172a",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const [token, locale, messages] = await Promise.all([
    getToken(),
    getLocale(),
    getMessages(),
  ]);

  return (
    <html lang={locale} dir={locale === AppLangs.AR ? "rtl" : "ltr"}>
      <body
        className={`${cairoFont.className} min-h-screen flex flex-col overflow-y-auto bg-secondary`}
      >
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header token={token} />
            <main className="pt-16 flex-grow flex">{children}</main>
            {token ? <MobilePrivateBottomBar /> : <Footer />}
          </NextIntlClientProvider>
        </Providers>

        <Toaster position="top-left" />
      </body>
    </html>
  );
}
