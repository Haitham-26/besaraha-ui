"use client";

import { Button } from "@/app/components/Button";
import { Info } from "@/app/components/Info";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
import { UpdateProfileDto } from "@/model/user/dto/UpdateProfileDto";
import { User } from "@/model/user/types/User";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {
  user: User;
};

export const ProfileUpdateModalAndButton: React.FC<Props> = ({
  user: { name, username },
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { control, reset, handleSubmit, getValues } = useForm<UpdateProfileDto>(
    { defaultValues: { name, username } },
  );

  const onCloseModal = () => {
    setOpen(false);
    reset({ name, username });
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      await NextClient("/user/update", {
        method: "PATCH",
        data: getValues(),
      });

      onCloseModal();

      router.refresh();

      Toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      reset({ name, username });
    }
  }, [open, reset, name, username]);

  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} icon={faEdit} className="mt-6">
        تعديل الملف الشخصي
      </Button>

      <Modal title="تعديل الملف الشخصي" open={open} onClose={onCloseModal}>
        <Controller
          control={control}
          name="name"
          rules={{
            maxLength: {
              value: 30,
              message: "الاسم لا يمكن أن يكون أكثر من 30 حرف",
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              title="الاسم"
              value={value}
              onChange={onChange}
              valid={!error}
              errorMessage={error?.message}
              maxLength={30}
            />
          )}
        />

        <div>
          <Controller
            control={control}
            name="username"
            rules={{
              maxLength: {
                value: 20,
                message: "الاسم لا يمكن أن يكون أكثر من 20 حرف",
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                title="اسم المستخدم"
                value={value}
                onChange={onChange}
                valid={!error}
                errorMessage={error?.message}
                maxLength={20}
              />
            )}
          />

          <Info className="mt-2">
            عند تغيير اسم المستخدم، سيتم تحديث رابط المراسلة الخاص بك، لذا لا
            تنسى أن تقوم بتغيير رابط المراسلة الخاص بك في أي مكان كنت قد وضعته
            فيه من قبل.
          </Info>
        </div>

        <Button
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          className="w-full mt-6"
        >
          تحديث
        </Button>
      </Modal>
    </Fragment>
  );
};
