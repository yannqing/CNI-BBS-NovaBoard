"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { User } from "@nextui-org/user";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

import { getChatList } from "@/app/(main)/chat/action";
import { GetChatListRequest, GetChatListResponse } from "@/types/chat/chatList";
import { BasePage, BaseResponse } from "@/types";
import { getCookie } from "@/utils/cookies";
import { userInfoCookie } from "@/common/auth/constant";
import { useGetUserContext } from "@/app/UserContext";
import { siteConfig } from "@/config/site";

export default function SidBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [chatList, setChatList] = useState<GetChatListResponse[]>();

  const getChatListRequest: GetChatListRequest = {
    pageNo: 1,
    pageSize: 10,
    fromId: getCookie(userInfoCookie)?.id,
  };

  const { isCookiePresent } = useGetUserContext();

  // 获取聊天列表，接口调用
  const fetchChatList = async () => {
    const res: BaseResponse<BasePage<GetChatListResponse>> =
      await getChatList(getChatListRequest);

    if (res.success && res.data) {
      setChatList(res.data.records);
    } else {
      // TODO 返回登录，服务器异常
    }
  };

  /**
   * 页面初始化
   */
  useEffect(() => {
    const isLogin = localStorage.getItem("token");

    // 判断登录态
    if (isCookiePresent || isLogin) {
      // 获取数据
      fetchChatList().then(() => {});

      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  function clickTo(id: string | undefined) {
    router.push(siteConfig.innerLinks.chat + "/" + id);
  }

  return (
    <div className="md:max-w-[350px] border-r-1 px-1 py-2 border-default-200 dark:border-default-100 h-full flex-grow">
      <Listbox aria-label="Listbox menu with sections" variant="flat">
        <ListboxSection showDivider title="Actions">
          {chatList && chatList.length > 0 ? (
            chatList.map((list, index) => (
              <ListboxItem
                key={index}
                className={"w-[280px]"}
                description={
                  <div className="ellipsis max-w-[210px] text-slate-500">
                    {list.lastMsgContent?.content}
                  </div>
                }
                startContent={
                  // TODO 用户头像，这里写死了
                  <User
                    avatarProps={{
                      src: "https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg",
                    }}
                    name={""}
                  />
                }
                onClick={() => {
                  clickTo(list.toId);
                }}
              >
                <div className={"flex flex-row"}>
                  <div className={"w-[140px] ellipsis"}>{list.toName}</div>
                  <div className={"text-xs text-teal-400"}>2022-12-01</div>
                </div>
              </ListboxItem>
            ))
          ) : (
            <ListboxItem key="new">加载中... ...</ListboxItem>
          )}
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
