import { useCallback, useEffect, useRef } from "react";
import { Centrifuge } from "centrifuge";
import { BASE_URL_SOCKET } from "../utils/constant";
import Cookies from "js-cookie";
import { refreshTokenForWebsocket } from "./apiService";

export const useCentrifuge = ({ userId, onDataReceive }) => {
  const centrifugeRef = useRef(null);

  const connectCentrifuge =  useCallback(() => {
    const token = Cookies.get("token");
    if (!token || !userId) return;

    const centrifuge = new Centrifuge(`${BASE_URL_SOCKET}/websocket`, {
      name: "js",
      token: token,
    });

    const subscribeToChannel = () => {
      const channel = `${userId}`;
      const sub = centrifuge.newSubscription(channel);

      sub.on("publication", ctx => {
        console.log("📩 Received:", ctx.data);
        onDataReceive?.(ctx.data);
      });

      sub.subscribe();
    };

    centrifuge.on("connect", ctx => {
      console.log("✅ Connected to Centrifuge:", ctx);
      subscribeToChannel();

      centrifuge.rpc("your_rpc_method", { key: "value" })
        .then(result => {
          console.log("📡 RPC Success:", result.data);
        })
        .catch(error => {
          console.error("⚠️ RPC Error:", error);
        });
    });

    centrifuge.on("disconnect", ctx => {
      console.log("❌ Disconnected:", ctx.code, ctx.reason);

      if (ctx.code === 109) {
        console.log("🔄 Token expired. Attempting reconnect...");
        setTimeout( async () => {
          await refreshTokenForWebsocket();
          connectCentrifuge();
        }, 1000);
      }
      
      if (ctx.code === 3500) {
        console.log("🔄 Token invalid. Attempting reconnect...");
        setTimeout(() => {
          connectCentrifuge();
        }, 1000);
      }

      if (ctx.code === 3000) {
        console.log("🚪 Manual disconnect (e.g., logout). No reconnect needed.");
        return;
      }
    });
    
    centrifuge.connect();
    subscribeToChannel();

    try {
      centrifugeRef.current?.disconnect?.();
    } catch (err) {
      console.warn("❗Error during previous disconnect:", err);
    }
    centrifugeRef.current = centrifuge;
  }, [userId, onDataReceive]);

  useEffect(() => {
    console.log("🚀 Initializing Centrifuge...");
    connectCentrifuge();

    return () => {
      console.log("🧹 Cleaning up Centrifuge...");
      try {
        centrifugeRef.current?.disconnect?.();
      } catch (err) {
        console.warn("❗Error during cleanup disconnect:", err);
      }
    };
  }, [connectCentrifuge]);

  const callRpc = async (method, params) => {
    try {
      const response = await centrifugeRef.current?.rpc(method, params);
      return response?.data;
    } catch (error) {
      console.error("RPC Error:", error);
      throw error;
    }
  };

  return { callRpc };
};
