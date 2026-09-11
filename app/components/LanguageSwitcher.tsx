import React from "react";
import { Dropdown } from "./Dropdown";
import { Icon } from "./Icon";
import { faGlobe } from "@fortawesome/free-solid-svg-icons/faGlobe";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { usePathname, useRouter } from "@/i18n/navigation";

type LanguageSwitcherProps = {
  className?: string;
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (lang: AppLangs) => {
    router.replace(pathname, { locale: lang });
    router.refresh();
  };

  return (
    <Dropdown
      className={className}
      items={[
        {
          title: "English",
          onClick: () => changeLanguage(AppLangs.EN),
        },
        {
          title: "العربية",
          onClick: () => changeLanguage(AppLangs.AR),
        },
      ]}
    >
      <Icon icon={faGlobe} size="xl" className="text-surface" />
    </Dropdown>
  );
};
