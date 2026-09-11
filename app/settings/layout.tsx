import SettingsSidebar from "./_components/SettingsSidebar";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="bg-background flex-1 w-full">
      <div className=" max-w-6xl mx-auto px-6 py-8 h-full">
        <div className="flex h-full flex-col lg:flex-row gap-4">
          <SettingsSidebar />
          <div className="w-full bg-white shadow rounded-2xl p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
