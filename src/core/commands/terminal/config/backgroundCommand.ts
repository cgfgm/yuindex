import { CommandType } from "../../../command";
import { useTerminalConfigStore } from "./terminalConfigStore";
import myAxios from "../../../../plugins/myAxios";

const downloadTimeout = 30000;

async function preloadImage(url: string) {
  const image = new Image();
  image.src = url;
  let timer: number | undefined;
  try {
    await Promise.race([
      image.decode(),
      new Promise<never>((_, reject) => {
        timer = window.setTimeout(() => {
          reject(new Error("图片下载超时，已保留原背景"));
          image.removeAttribute("src");
        }, downloadTimeout);
      }),
    ]);
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * 切换终端背景
 * @author HAKU
 */
const backgroundCommand: CommandType = {
  func: "background",
  name: "切换终端背景(随机功能已失效，请添加图片链接参数)",
  alias: ["bg"],
  params: [
    {
      key: "url",
      desc: "图片地址（不填则随机）",
      required: false,
    },
  ],
  options: [],
  async action(options, terminal) {
    let url = options._[0];
    const { setBackground } = useTerminalConfigStore();
    if (url && CSS.supports("color", url)) {
      setBackground(url);
      return;
    }
    terminal.writeTextOutput("正在下载图片…");
    if (!url) {
      try {
        const res = await myAxios.post("/background/get/random", {}, { timeout: downloadTimeout });
        url = res.data;
      } catch {
        url = "";
      }
      if (!url) {
        terminal.writeTextErrorResult("获取随机壁纸失败，已保留原背景");
        return;
      }
    }
    try {
      const address = new URL(url);
      if (!["http:", "https:"].includes(address.protocol)) throw new Error();
      url = address.href;
    } catch {
      terminal.writeTextErrorResult("图片地址无效，请使用 HTTP 或 HTTPS 图片链接");
      return;
    }
    try {
      await preloadImage(url);
    } catch (error) {
      terminal.writeTextErrorResult(
        error instanceof Error && error.message === "图片下载超时，已保留原背景"
          ? error.message
          : "图片加载失败，已保留原背景。请检查链接、网络或图片站的防盗链限制。"
      );
      return;
    }
    setBackground(url);
    terminal.writeTextSuccessResult("图片已加载，背景已更新");
  },
};

export default backgroundCommand;
