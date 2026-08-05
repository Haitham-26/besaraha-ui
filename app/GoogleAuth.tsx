"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { NextClient } from "@/tools/NextClient";
import { useRouter } from "next/navigation";
import { Spinner } from "./components/Spinner";
import Image from "next/image";

export const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user || status !== "authenticated") {
      return;
    }

    const login = async () => {
      try {
        setLoading(true);

        await NextClient("/auth/google-login", {
          method: "POST",
          data: {
            idToken: session.idToken,
          },
          withCredentials: true,
        });

        const redirect = localStorage.getItem("redirect");

        if (redirect) {
          localStorage.removeItem("redirect");
          router.push(redirect);
        }

        router.refresh();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    login();
  }, [status, session?.idToken, session?.user, router]);

  if (loading) {
    return (
      <div className="bg-primary fixed inset-0 flex flex-col gap-4 justify-center items-center h-screen w-full z-100">
        <Image
          src={"/images/logo.png"}
          width={200}
          height={80}
          alt="بصراحة"
          quality={100}
          className="animate animate-pulse"
        />
        <Spinner className="static text-accent" />
      </div>
    );
  }

  return null;
};
