import { GetMessageRecipientProfileResponseDto } from "@/model/message/GetMessageRecipientProfileResponseDto";
import { AuthClient } from "@/tools/AuthClient";
import getToken from "@/tools/getToken";
import { redirect } from "next/navigation";
import { SendMessageForm } from "../_components/SendMessageForm";
import { Icon } from "@/app/components/Icon";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { faShieldHeart } from "@fortawesome/free-solid-svg-icons/faShieldHeart";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { User } from "@/model/user/User";
import Image from "next/image";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: Props) {
  const [{ username }, token] = await Promise.all([params, getToken()]);

  if (!username) {
    redirect("/");
  }

  let user: User | null = null;
  let profile: GetMessageRecipientProfileResponseDto | null = null;

  try {
    const { data } = await AuthClient<User>(`/user`, { method: "POST" }, token);
    user = data;
  } catch (e) {
    console.log(e);
  }

  if (user?.username === username) {
    redirect("/");
  }

  try {
    const { data, status } =
      await AuthClient<GetMessageRecipientProfileResponseDto>(
        `/messages/${username}/profile`,
        { method: "GET" },
      );
    profile = data;

    if (status !== 200) {
      redirect("/");
    }
  } catch (e) {
    console.log(e);
  }

  if (!profile) {
    redirect("/");
  }

  return (
    <div className="w-full bg-primary text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10" />

      <main className="max-w-5xl mx-auto pt-16 pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-center md:text-start">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-16">
            <div className="relative inline-block">
              <div className="w-44 h-44 md:w-52 md:h-52 bg-white/5 p-2 rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-[#1e293b] flex items-center justify-center border-2 border-white/10">
                  {profile?.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Icon
                      icon={faUserCircle}
                      className="text-slate-700 text-9xl"
                    />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent rounded-3xl flex items-center justify-center shadow-xl shadow-accent/20 -rotate-12 border-4 border-[#0f172a]">
                <Icon icon={faBolt} className="text-xl" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent font-black text-xs uppercase tracking-widest">
                <Icon icon={faLock} className="text-[10px]" />
                مساحة آمنة
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                أرسل مصارحة لـ <br />
                <span className="text-accent underline decoration-white/10 underline-offset-8 italic">
                  {profile?.name}
                </span>
              </h1>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">
                قل ما يدور في ذهنك بصدق. التشفير يحمي هويتك تماماً.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[4rem] p-8 md:p-14 shadow-2xl relative">
                <SendMessageForm username={profile?.username} />
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white/[0.08] transition-all">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <Icon icon={faShieldHeart} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    مجهول 100%
                  </span>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white/[0.08] transition-all">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-slate-400">
                    <Icon icon={faBolt} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    وصول فوري
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
