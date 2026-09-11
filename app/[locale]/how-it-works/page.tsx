import { Icon } from "@/app/components/Icon";
import { faLink } from "@fortawesome/free-solid-svg-icons/faLink";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import Link from "next/link";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb";

export default function Page() {
  const userSteps = [
    {
      icon: faUserCircle,
      title: "جهز ملفك الشخصي",
      desc: "بعد التسجيل، توجه إلى صفحة البروفايل. تأكد من اختيار اسم مستخدم (Username) يعبر عنك، فهذا الاسم هو ما سيظهر في رابط المراسلة الخاص بك.",
    },
    {
      icon: faLink,
      title: "شارك الرابط الذكي",
      desc: "استخدم زر النسخ الموجود في صفحتك الشخصية. ضع الرابط في 'البايو' على إنستجرام أو تيك توك. هذا الرابط هو البوابة التي تسمح للآخرين بمراسلتك دون الحاجة لامتلاكهم حساباً.",
    },
    {
      icon: faUserSecret,
      title: "استقبل المصارحات السرية",
      desc: "ستصلك رسائل خاصة في 'الرسائل الواردة'. هذه الرسائل سرية تماماً ولا يراها أحد غيرك. يمكنك قراءتها والاستمتاع بصدق أصدقائك بعيداً عن ضجيج المنشورات العامة.",
    },
    {
      icon: faComments,
      title: "ابدأ نقاشاً عاماً",
      desc: "هل تريد معرفة رأي الناس في موضوع معين؟ اطرح سؤالاً في قسم 'أسئلتي' وشارك رابطه. يمكن لأي شخص ترك رد علني يراه الجميع.",
    },
    {
      icon: faPaperPlane,
      title: "تفاعل مع الردود",
      desc: "داخل كل سؤال، ستجد مصفوفة من الردود. يمكنك متابعة النقاش، ورؤية من اختار الرد باسمه ومن فضّل الرد كمجهول، مما يخلق بيئة تفاعلية غنية وصريحة.",
    },
  ];

  return (
    <div className="w-full bg-surface-muted">
      <header className="pt-24 pb-16 px-6 text-center bg-white border-b border-border/50">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-accent font-black tracking-widest uppercase text-xs">
            دليل المستخدم
          </h2>
          <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight">
            كيف تستخدم <span className="text-accent">بصراحة</span>
          </h1>
          <p className="text-lg text-text-muted font-medium leading-relaxed">
            تعرف على الخطوات البسيطة للبدء في استقبال الرسائل السرية وبناء
            نقاشات حقيقية مع متابعيك.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            {userSteps.map((step, i) => (
              <div
                key={i}
                className="relative group bg-surface border border-border p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-start hover:border-accent/30 transition-all shadow-sm"
              >
                <div className="w-14 h-14 shrink-0 bg-primary text-secondary rounded-2xl flex items-center justify-center text-xl shadow-lg">
                  <Icon icon={step.icon} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-primary flex items-center gap-3">
                    <span className="text-white bg-accent rounded-full w-8 h-8 aspect-square flex items-center justify-center text-sm absolute top-0 start-0">
                      0{i + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24">
            <div className="bg-primary rounded-[3rem] p-10 text-secondary relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Icon icon={faLightbulb} className="text-accent text-4xl" />
                  <h4 className="text-2xl font-black">نصيحة</h4>
                </div>
                <p className="text-secondary/70 leading-relaxed font-medium">
                  للحصول على أكبر عدد من الرسائل، قم بالرد على بعض الأسئلة علناً
                  وشارك لقطة شاشة (Screenshot) لها في &apos;ستوري&apos;
                  الإنستجرام. هذا يشجع الآخرين على المشاركة والمصارحة!
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent rounded-full blur-[60px] opacity-20" />
            </div>

            <div className="bg-white border border-border rounded-[2.5rem] p-8 space-y-4">
              <h4 className="font-black text-primary flex items-center gap-2">
                <span className="w-1 h-4 bg-accent rounded-full" />
                الفرق بين الرسالة والسؤال
              </h4>
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-surface-muted rounded-2xl border border-border/50">
                  <div className="text-xs font-black text-primary mb-1 italic">
                    الرسالة:
                  </div>
                  <p className="text-sm text-text-muted">
                    تصلك وحدك في صندوق الوارد. لا يراها أحد غيرك، وهي مثالية
                    للمصارحات الشخصية.
                  </p>
                </div>
                <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
                  <div className="text-xs font-black text-accent mb-1 italic">
                    السؤال:
                  </div>
                  <p className="text-sm text-text-muted">
                    يظهر لكل من لديه رابطه. يمكن للجميع الرد عليه، وهو مصمم
                    لبناء نقاشات جماعية علنية.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-20 text-center bg-surface border border-border rounded-[3.5rem] p-12 md:p-20 shadow-xl">
          <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">
            هل أنت مستعد لتسمع الحقيقة؟
          </h2>
          <p className="text-text-muted text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            الآلاف يستخدمون بصراحة يومياً لاكتشاف ما يفكر فيه أصدقاؤهم حقاً. لا
            تتردد، انضم إلينا الآن.
          </p>
          <div className="flex justify-center">
            <Link
              href="/auth/signup"
              target="_blank"
              className="px-16 py-4 bg-primary text-secondary rounded-2xl font-black text-base hover:bg-accent hover:scale-105 transition-all shadow-2xl shadow-primary/20"
            >
              أنشئ حسابك الآن
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
