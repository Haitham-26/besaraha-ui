import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";

const privateLinks = [
  { title: "الرسائل الواردة", path: "/messages", icon: faMessage },
  { title: "أسئلتي", path: "/questions", icon: faComments },
  { title: "أسئلة المنتدى", path: "/public-questions", icon: faBolt },
];

const publicLinks = [
  { title: "الرئيسية", path: "/", icon: faHouse },
  { title: "كيفية الاستخدام", path: "/how-it-works", icon: faCircleQuestion },
  { title: "أسئلة المنتدى", path: "/public-questions", icon: faBolt },
];

export { privateLinks, publicLinks };
