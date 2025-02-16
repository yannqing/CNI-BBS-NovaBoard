import { useRef } from "react";

import { getCookie } from "@/utils/cookies";

interface WebSocketHookOptions {
  onMessage?: (message: any) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

export const useWebSocket = (options: WebSocketHookOptions = {}) => {
  const ws = useRef<WebSocket | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const userInfo = getCookie();

  // 发送心跳包
  const sendHeartbeat = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          "x-token": userInfo?.token,
        }),
      );
      console.log("❤️ 发送心跳包");
    }
  };

  const startHeartbeat = () => {
    heartbeatInterval.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        sendHeartbeat();
      }
    }, 60000);
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };

  const setupWebSocket = () => {
    if (!userInfo?.token) {
      console.error("WebSocket 连接缺少 token");

      return;
    }

    try {
      // 在 URL 中添加 token 参数
      const wsUrl = `ws://localhost:9101/ws?x-token=${userInfo?.token}`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket 已连接");
        startHeartbeat();
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket 已断开", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        stopHeartbeat();
        // 只有在非正常关闭时才重连
        if (!event.wasClean) {
          setTimeout(() => {
            console.log("正在尝试重连...");
            setupWebSocket();
          }, 5000);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket 错误:", error);
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          console.log("收到服务器消息:", message);
        } catch (error) {
          console.error("解析服务器消息失败:", error);
        }
      };
    } catch (error) {
      console.error("建立 WebSocket 连接失败:", error);
    }
  };

  // 返回所需的方法和状态
  return {
    setupWebSocket,
    stopHeartbeat,
    isConnected: ws.current?.readyState === WebSocket.OPEN,
  };
};
