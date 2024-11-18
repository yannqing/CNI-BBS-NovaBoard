"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { User } from "@nextui-org/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { getChatList } from "@/app/(main)/chat/action";
import { GetChatListRequest } from "@/types/chat/chatList";
import { BaseResponse } from "@/types";
import { getCookie } from "@/utils/cookies";
import { userInfoCookie } from "@/common/auth/constant";
import { useGetUserContext } from "@/app/UserContext";

export default function SidBar() {
  const [isOpen, setIsOpen] = useState<boolean>();

  const getChatListRequest: GetChatListRequest = {
    pageNo: 1,
    pageSize: 10,
    fromId: getCookie(userInfoCookie)?.id,
  };

  const { isCookiePresent } = useGetUserContext();

  /**
   * 页面初始化
   */
  useEffect(() => {
    // 获取聊天列表
    // getChatList(getChatListRequest).then((res: BaseResponse<any>) => {
    //   console.log("getChatList Result: ", res);
    //   toast.success("获取聊天列表成功！（待完善）");
    // });
    // 判断登录态
    if (isCookiePresent) {
      console.log("isCookiePresent", isCookiePresent);
      console.log("false");
      setIsOpen(false);
    } else {
      console.log("true");
      console.log("isCookiePresent", isCookiePresent);
      setIsOpen(true);
    }
  }, []);

  async function clickTo() {
    await getChatList(getChatListRequest).then((res: BaseResponse<any>) => {
      console.log("getChatList Result: ", res);
      toast.success("获取聊天列表成功！（待完善）");
    });
  }

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
            onClick={clickTo}
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

      <Modal backdrop={"blur"} hideCloseButton={true} isOpen={isOpen}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">请登录</ModalHeader>
            <ModalBody>
              <p>尊敬的游客，您还未登录，无法使用此功能</p>
              <p>请前往登录</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                返回主页
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                去登录
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
