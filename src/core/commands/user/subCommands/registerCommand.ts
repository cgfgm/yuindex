import { CommandType } from "../../../command";
import { getSingleMusic } from "../../relax/music/musicApi";
import { userRegister } from "../userApi";

/**
 * 用户注册命令
 * @author HAKU
 */
const registerCommand: CommandType = {
  func: "register",
  name: "用户注册",
  options: [
    {
      key: "username",
      desc: "用户名（3 至 32 个英文字母）",
      alias: ["u"],
      type: "string",
      required: true,
    },
    {
      key: "password",
      desc: "密码（8 至 14 位，须包含英文字母和数字，可使用半角符号）",
      alias: ["p"],
      type: "string",
      required: true,
    },
    {
      key: "email",
      desc: "主流邮箱（如 QQ、163、Gmail、Outlook）",
      alias: ["e"],
      type: "string",
      required: true,
    },
  ],
  async action(options, terminal) {
    const { username, password, email } = options;
    if (!username) {
      terminal.writeTextErrorResult("请输入用户名");
      return;
    }
    if (!password) {
      terminal.writeTextErrorResult("请输入密码");
      return;
    }
    if (!email) {
      terminal.writeTextErrorResult("请输入邮箱");
      return;
    }
    const res: any = await userRegister(username, password, email);
    if (res?.code === 0) {
      terminal.writeTextSuccessResult("注册成功");
    } else {
      terminal.writeTextErrorResult(res?.message ?? "注册失败");
    }
  },
};

export default registerCommand;
