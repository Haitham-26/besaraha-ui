import { GetMessageRecipientProfileResponseDto } from "@/model/message/GetMessageRecipientProfileResponseDto";
import { AuthClient } from "@/tools/AuthClient";
import { SendMessageForm } from "../_components/SendMessageForm";
import { Icon } from "@/app/components/Icon";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import Image from "next/image";
import { Link, redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLocale, getTranslations } from "next-intl/server";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: Props) {
  const [{ username }, locale, session, t] = await Promise.all([
    params,
    getLocale(),
    getServerSession(authOptions),
    getTranslations("sendMessage"),
  ]);

  const goHome = () =>
    redirect({
      href: "/",
      locale,
    });

  if (!username) {
    goHome();
  }

  let profile: GetMessageRecipientProfileResponseDto | undefined = undefined;

  if (session?.user?.username === username) {
    goHome();
  }

  try {
    const { data, status } =
      await AuthClient<GetMessageRecipientProfileResponseDto>(
        `/messages/${username}/profile`,
        { method: "GET" },
      );

    profile = data;

    if (status !== 200) {
      goHome();
    }
  } catch (e) {
    console.log(e);
  }

  if (!profile) {
    goHome();
  }

  return (
    <main className="w-full bg-background min-h-screen py-24 px-6">
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-start border-b border-border/50 pb-8">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-muted border border-border shrink-0 flex items-center justify-center">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Icon
                  icon={faUserCircle}
                  className="text-text-muted text-5xl"
                />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-primary">
                {t.rich("title", {
                  name: profile!.name,
                  span: (chunk) => <span className="text-accent">{chunk}</span>,
                })}
              </h1>
              <p className="text-text-muted text-sm md:text-base font-medium flex items-center justify-center md:justify-start gap-2">
                <Icon icon={faShieldHalved} className="text-accent text-sm" />
                {t("privacyNote")}
              </p>
            </div>
          </div>

          <SendMessageForm username={profile!.username} />
        </div>

        <div className="bg-surface-muted/50 border border-border rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-start">
            <h3 className="text-lg font-black text-primary">
              {t("cta.title")}
            </h3>
            <p className="text-text-muted text-sm font-medium leading-relaxed">
              {t("cta.subtitle")}
            </p>
          </div>

          <Link
            href="/signup"
            className="h-12 px-8 bg-primary text-secondary rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-accent transition-colors shrink-0"
          >
            {t("cta.button")}
            <Icon icon={faArrowRight} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </main>
  );
}
