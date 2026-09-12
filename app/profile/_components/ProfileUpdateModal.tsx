"use client";

import { Button } from "@/app/components/Button";
import { ImageUpload } from "@/app/components/ImageUpload";
import { Info } from "@/app/components/Info";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
import { UpdateProfileDto } from "@/model/user/dto/UpdateProfileDto";
import { User } from "@/model/user/types/User";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type ProfileUpdateModalProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  open = false,
  onClose,
}) => {
  const { data, update } = useSession();
  const queryClient = useQueryClient();

  const { name, username, avatar } = data?.user || {};

  const { control, reset, handleSubmit, getValues } = useForm<UpdateProfileDto>(
    {
      defaultValues: { name, username, avatar },
    },
  );

  const localReset = useCallback(() => {
    reset({ name, username, avatar });
  }, [name, username, avatar, reset]);

  const onCloseModal = () => {
    onClose();
    localReset();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const dto = getValues();

      const formData = new FormData();

      Object.entries(dto).forEach(([key, value]) => {
        if (key === "avatar") {
          if (value instanceof File || typeof value === "string") {
            formData.append("avatar", value);
          }
        } else {
          formData.append(key, String(value));
        }
      });

      await NextClient("/user/update", {
        method: "PATCH",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      const freshUser = queryClient.getQueryData<User>(["user"]);

      if (freshUser) {
        await update({
          user: {
            ...data?.user,
            name: freshUser.name,
            username: freshUser.username,
            avatar: freshUser.avatar,
          },
        });
      }

      onCloseModal();

      Toast.success("تم تحديث الملف الشخصي بنجاح");
    },
    onError: (e) => {
      console.log(e);
      Toast.apiError(e);
    },
  });

  useEffect(() => {
    if (open) {
      localReset();
    }
  }, [open, localReset]);

  return (
    <Modal title="تعديل الملف الشخصي" open={open} onClose={onCloseModal}>
      <Controller
        control={control}
        name="avatar"
        render={({ field: { value, onChange } }) => (
          <ImageUpload
            value={value || null}
            onChange={onChange}
            label="صورة الملف الشخصي"
            className="items-center [&>.image-wrapper]:!rounded-full"
          />
        )}
      />

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
          عند تغيير اسم المستخدم، سيتم تحديث رابط المراسلة الخاص بك، لذا لا تنسى
          أن تقوم بتغيير رابط المراسلة الخاص بك في أي مكان كنت قد وضعته فيه من
          قبل.
        </Info>
      </div>

      <Button
        loading={mutation.isPending}
        onClick={handleSubmit(() => mutation.mutate())}
        className="w-full mt-6"
      >
        تحديث
      </Button>
    </Modal>
  );
};
