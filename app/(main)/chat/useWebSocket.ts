import { useEffect, useRef, useState } from "react";

import { getCookie } from "@/utils/cookies";

interface WebSocketHookOptions {
  onMessage?: (message: any) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

export const useWebSocket = (options: WebSocketHookOptions = {}) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false); // 连接状态
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null; // 用来保存定时器 ID

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

  const setupWebSocket = () => {
    // 单例模式：防止单个用户建立多个 websocket 连接
    if (ws.current) {
      console.log("WebSocket 已连接，无需重复创建");

      return;
    }

    // 必须登录才能建立 websocket 连接
    if (!userInfo?.token) {
      console.error("WebSocket 连接缺少 token");

      return;
    }

    try {
      // 在 URL 中添加 token 参数
      const wsUrl = `ws://localhost:9100/ws?x-token=${userInfo?.token}`;

      ws.current = new WebSocket(wsUrl);

      // 建立 websocket 连接事件监听
      ws.current.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket 连接成功");

        // 每隔 30 秒发送一次心跳消息，并记录定时器 ID
        heartbeatTimer = setInterval(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            sendHeartbeat();
          }
        }, 30000);
      };

      // 收到消息事件监听
      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          console.log("收到服务器消息:", message);
        } catch (error) {
          console.error("解析服务器消息失败:", error);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket 已断开", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        // 只有在非正常关闭时才重连
        if (!event.wasClean) {
          setTimeout(() => {
            console.log("正在尝试重连...");
            setupWebSocket();
          }, 5000);
        }
        // 关闭定时器
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket 错误:", error);
      };
    } catch (error) {
      console.error("建立 WebSocket 连接失败:", error);
    }
  };

  /**
   * 关闭 WebSocket 连接
   * 暴露函数（用户手动关闭）
   */
  function disconnect() {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setIsConnected(false);

      // 关闭定时器
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    }
  }

  /**
   * 自动建立 WebSocket 连接
   * function：如果用户已登录，自动重连
   */
  function autoConnect() {
    // 如果用户有 Token，尝试重新连接 WebSocket
    if (userInfo && userInfo.token && userInfo.id) {
      // 重连
      setupWebSocket();
    }
  }

  useEffect(() => {
    // 初始化 WebSocket 连接（如果需要的话）
    if (userInfo && userInfo.token) {
      autoConnect();
    }
  }, []);

  // 返回所需的方法和状态
  return {
    ws,
    isConnected,
    setupWebSocket,
    disconnect,
  };
};
