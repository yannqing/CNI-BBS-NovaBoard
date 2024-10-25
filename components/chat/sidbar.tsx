"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { User } from "@nextui-org/user";
import { useEffect } from "react";

import { getChatList } from "@/app/(main)/chat/action";
import { GetChatListRequest } from "@/types/chat/chatList";
import { BaseResponse } from "@/types";

export default function SidBar() {
  const getChatListRequest: GetChatListRequest = {
    pageNo: 1,
    pageSize: 10,
    fromId: "",
  };

  useEffect(() => {
    getChatList(getChatListRequest, "c9c361d2-53fb-44b0-87fb-ec956682e59e").then((res: BaseResponse<any>) => {
      console.log("getChatList Result: ", res);
    });
  }, []);

  return (
    <div className="md:max-w-[260px] border-r-1 px-1 py-2 border-default-200 dark:border-default-100 h-full flex-grow">
      <Listbox aria-label="Listbox menu with sections" variant="flat">
        <ListboxSection showDivider title="Actions">
          <ListboxItem
            key="new"
            description="Create a new file"
            startContent={
              <User
                avatarProps={{
                  src: "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
                }}
                name={""}
              />
            }
          >
            New file
          </ListboxItem>
          <ListboxItem
            key="copy"
            description="Copy the file link"
            startContent={
              <User
                avatarProps={{
                  src: "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
                }}
                name={""}
              />
            }
          >
            Copy link
          </ListboxItem>
          <ListboxItem
            key="edit"
            description="Allows you to edit the file"
            startContent={
              <User
                avatarProps={{
                  src: "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
                }}
                name={""}
              />
            }
          >
            Edit file
          </ListboxItem>
        </ListboxSection>
        <ListboxSection title="Danger zone">
          <ListboxItem
            key="delete"
            className="text-danger"
            color="danger"
            description="Permanently delete the file "
            startContent={
              <User
                avatarProps={{
                  src: "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
                }}
                name={""}
              />
            }
          >
            Delete file
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </div>
  );
}
