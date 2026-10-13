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
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const MAX_USERNAME_LENGTH = 20;
const MAX_NAME_LENGTH = 30;

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
  const t = useTranslations();

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

      Toast.success(t("profile.edit.success"));
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
    <Modal title={t("profile.edit.title")} open={open} onClose={onCloseModal}>
      <Controller
        control={control}
        name="avatar"
        render={({ field: { value, onChange } }) => (
          <ImageUpload
            value={value || null}
            onChange={onChange}
            label={t("profile.edit.fields.avatar")}
            className="items-center"
          />
        )}
      />

      <Controller
        control={control}
        name="name"
        rules={{
          maxLength: {
            value: MAX_NAME_LENGTH,
            message: t("errors.maxLength", { length: MAX_NAME_LENGTH }),
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            title={t("profile.edit.fields.name")}
            value={value}
            onChange={onChange}
            valid={!error}
            errorMessage={error?.message}
            maxLength={MAX_NAME_LENGTH}
          />
        )}
      />

      <div>
        <Controller
          control={control}
          name="username"
          rules={{
            maxLength: {
              value: MAX_USERNAME_LENGTH,
              message: t("errors.maxLength", { length: MAX_USERNAME_LENGTH }),
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              title={t("profile.edit.fields.username")}
              value={value}
              onChange={onChange}
              valid={!error}
              errorMessage={error?.message}
              maxLength={MAX_USERNAME_LENGTH}
            />
          )}
        />

        <Info className="mt-2">{t("profile.edit.warning")}</Info>
      </div>

      <Button
        loading={mutation.isPending}
        onClick={handleSubmit(() => mutation.mutate())}
        className="w-full mt-6"
      >
        {t("common.update")}
      </Button>
    </Modal>
  );
};
