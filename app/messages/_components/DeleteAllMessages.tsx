"use client";

import { Fragment, useState } from "react";
import { Button } from "@/app/components/Button";
import { WarningModal } from "@/app/components/WarningModal";
import { useGlobalContext } from "@/app/questions/context/global-context";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

export default function DeleteAllMessages() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useGlobalContext();

  const handleDeleteAll = async () => {
    try {
      setLoading(true);

      await NextClient("/message/delete-all", {
        method: "DELETE",
      });

      setMessages({
        data: [],
        meta: { total: 0, page: 1, hasNext: false, limit: 10 },
      });

      setOpen(false);
      Toast.success("تم حذف جميع الرسائل بنجاح");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Button
        onClick={() => setOpen(true)}
        className="!py-2 !px-4 !text-[10px] md:!text-xs !bg-danger/10 !text-danger hover:!bg-danger hover:!text-white shadow-none"
        icon={faTrash}
        loading={loading}
        disabled={!messages?.data?.length}
      >
        حذف الكل
      </Button>

      {messages?.data?.length ? (
        <WarningModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleDeleteAll}
          loading={loading}
          title="حذف جميع الرسائل"
          description="هل أنت متأكد؟ سيتم حذف جميع الرسائل الواردة نهائياً ولا يمكن التراجع عن هذا الإجراء."
        />
      ) : null}
    </Fragment>
  );
}
