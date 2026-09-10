import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faAt } from "@fortawesome/free-solid-svg-icons/faAt";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons/faQuoteRight";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";

export default function Page() {
  return (
    <main className="w-full bg-background text-text-primary selection:bg-accent/20">
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 text-right">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-primary">
              رسائل <span className="text-accent">سرية</span> وأسئلة تفاعلية.
            </h1>
            <p className="text-xl text-text-muted max-w-xl font-medium leading-relaxed">
              منصتك المتكاملة لاستقبال المصارحات الخاصة في صندوق الوارد، أو طرح
              تساؤلات عامة للنقاش مع متابعيك عبر رابطك الشخصي الفريد.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/auth/signup"
                className="h-16 px-10 bg-primary text-secondary rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:bg-accent transition-all shadow-xl shadow-primary/20"
              >
                ابدأ الآن
                <Icon icon={faArrowLeft} />
              </Link>
              <Link
                href="/how-it-works"
                className="h-16 px-10 bg-surface border border-border text-primary rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:bg-surface-muted transition-all"
              >
                <Icon icon={faCircleQuestion} className="text-accent" />
                كيف أستخدمه؟
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="space-y-4 transform lg:rotate-3">
              <div className="bg-surface border border-border p-6 rounded-[2rem] shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon icon={faQuoteRight} />
                  </div>
                  <span className="text-xs font-black">رسالة مجهولة جديدة</span>
                </div>
                <p className="font-bold text-primary italic">
                  &quot;أحب طريقتك في التفكير، كيف تطور مهاراتك دائماً؟&quot;
                </p>
              </div>
              <div className="bg-primary p-6 rounded-[2rem] text-secondary shadow-xl translate-x-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                    <Icon icon={faReply} />
                  </div>
                  <span className="text-xs font-black">رد جديد على سؤالك</span>
                </div>
                <p className="font-bold">
                  &quot;أعتقد أن الاستمرارية هي السر الحقيقي...&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-muted/50 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface border border-border p-10 rounded-[3rem] space-y-6">
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                <Icon icon={faMessage} className="text-2xl" />
              </div>
              <h3 className="text-3xl font-black text-primary">
                صندوق المصارحة
              </h3>
              <p className="text-text-muted font-medium leading-relaxed">
                استقبل رسائل خاصة لا يراها أحد غيرك. يتم تشفير هويتك وهوية
                المرسل تماماً لضمان صراحة لا تتوفر في أي مكان آخر.
              </p>
            </div>
            <div className="bg-surface border border-border p-10 rounded-[3rem] space-y-6">
              <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center">
                <Icon icon={faAt} className="text-2xl" />
              </div>
              <h3 className="text-3xl font-black text-primary">ساحة النقاش</h3>
              <p className="text-text-muted font-medium leading-relaxed">
                اطرح أسئلة عامة وشاركها عبر رابطك. يمكن للجميع الرد (بأسمائهم أو
                مجهولين) لبناء سلسلة نقاش تفاعلية تظهر للعلن.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
