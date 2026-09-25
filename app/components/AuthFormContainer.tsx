import React from "react";

type AuthFormContainerProps = {
  title: string | React.ReactNode;
  subtitle?: string;
  children: React.ReactNode | React.ReactNode[];
};

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <section className="w-full relative min-h-[100vh] flex items-center justify-center px-4 md:px-10 py-20 overflow-hidden bg-[#0f172a]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full md:max-w-[480px] relative z-10">
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-normal italic">
            {title}
          </h1>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 py-10 md:p-12 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/20">
          <div className="flex flex-col gap-8">
            {subtitle ? (
              <h2 className="text-2xl font-black text-white text-center">
                {subtitle}
              </h2>
            ) : null}

            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
