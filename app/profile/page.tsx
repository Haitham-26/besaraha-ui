import { User } from "@/model/user/types/User";
import { AuthClient } from "@/tools/AuthClient";
import { formattedDate } from "@/tools/Date";
import getToken from "@/tools/getToken";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons/faCalendarAlt";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons/faShareNodes";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons/faFingerprint";
import { faAt } from "@fortawesome/free-solid-svg-icons/faAt";
import { Icon } from "../components/Icon";
import { CopyButton } from "../components/CopyButton";
import Image from "next/image";
import { ProfileUpdateModalAndButton } from "./_components/ProfileUpdateModalAndButton";
import { cookies } from "next/headers";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export default async function Page() {
  const [token, _cookies] = await Promise.all([getToken(), cookies()]);

  const { data: user } = await AuthClient<User>(
    `/user`,
    { method: "POST" },
    token,
  );

  const cookieLang = _cookies.get("locale")?.value;

  const langPrefix = cookieLang !== AppLangs.EN ? `/${cookieLang}` : "";

  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${langPrefix}/${user.username || user._id}/message`;

  const infoRows = [
    {
      label: "الاسم الكامل",
      icon: faUserCircle,
      value: user.name,
    },
    {
      label: "اسم المستخدم",
      icon: faAt,
      value: `@${user.username}`,
    },
    {
      label: "البريد الإلكتروني",
      icon: faEnvelope,
      value: user.email,
    },
    {
      label: "تاريخ الانضمام",
      icon: faCalendarAlt,
      value: formattedDate(user.createdAt),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background p-4 pt-6 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="relative p-8 md:p-12 bg-primary rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-right">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-surface rounded-[2.5rem] flex items-center justify-center border-8 border-white/10 shadow-inner overflow-hidden">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={128}
                    height={128}
                    quality={100}
                    className="w-full h-full"
                  />
                ) : (
                  <Icon
                    icon={faUserCircle}
                    className="text-accent text-8xl md:text-9xl"
                  />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-accent w-10 h-10 rounded-full border-4 border-primary flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            </div>

            <div className="text-center md:text-right space-y-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <p className="text-accent font-mono text-xl [dir:ltr] mt-2">
                  @{user.username}
                </p>
              </div>
              <p className="text-white/60 text-base font-medium">
                عضو منذ {formattedDate(user.createdAt)}
              </p>

              <ProfileUpdateModalAndButton user={user} />
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-accent rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-64 h-64 bg-accent rounded-full blur-[100px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-surface rounded-[2.5rem] border-2 border-border p-8 md:p-10 shadow-sm relative group overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <Icon icon={faShareNodes} className="text-xl" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary">
                    رابط المراسلة الخاص بك
                  </h3>
                </div>

                <p className="mb-4 text-text-muted">
                  شارك هذا الرابط مع أصدقاءك ليرسلوا لك رسائل سرية.
                </p>

                <div className="flex flex-col md:flex-row gap-4 p-2 bg-surface-muted rounded-2xl border-2 border-border/50">
                  <div className="grow px-6 py-4 font-mono text-text-primary [direction:ltr] max-w-full text-start truncate ps-0">
                    {profileUrl}
                  </div>

                  <CopyButton text={profileUrl} />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-[2.5rem] border-2 border-border p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                  <Icon icon={faFingerprint} className="text-xl" />
                </div>
                <h2 className="text-2xl font-black text-text-primary">
                  بيانات الحساب
                </h2>
              </div>

              <div className="grid gap-6">
                {infoRows.map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-muted/50 rounded-2xl border border-transparent hover:border-border transition-all"
                  >
                    <div className="flex items-center gap-4 mb-2 md:mb-0">
                      <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-text-muted border border-border">
                        <Icon icon={icon} />
                      </div>
                      <span className="text-text-muted font-bold">{label}</span>
                    </div>
                    <span
                      className={`font-black text-lg ${
                        label === "اسم المستخدم"
                          ? "text-accent dir-ltr"
                          : "text-text-primary"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
