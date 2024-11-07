// @ts-ignore
import CryptoJS from "crypto-js";

import { keyOne } from "@/common/auth/constant";

/**
 * 随机生成 16 位的 iv 向量
 * 使用base64加密
 * @returns {*}
 */
export function generateRandomIV() {
  // 创建一个16字节的数组用于存放随机值
  const iv = CryptoJS.lib.WordArray.random(16);
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);

  return exformatBase64(ivBase64);
}

/**
 * 加密请求数据
 * @param {string/object} word - 要加密的数据
 * @param {string} ivBase64 - Base64 编码的 IV
 * @returns {string} - Base64 编码的加密数据
 */
export function encrypt(word: string, ivBase64: string) {
  if (word === undefined) {
    return "";
  }
  // 创建密钥
  let key = CryptoJS.enc.Base64.parse(keyOne);
  // 将 Base64 编码的 IV 转换为 WordArray
  let iv = CryptoJS.enc.Base64.parse(deformatBase64(ivBase64));
  let enc;

  // 加密数据
  let wordArray = CryptoJS.enc.Utf8.parse(word);

  enc = CryptoJS.AES.encrypt(wordArray, key, {
    iv: iv,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
  });
  // 将加密后的数据转换为 Base64 字符串，并进行 URL 安全处理
  let encryptedData = enc.ciphertext.toString(CryptoJS.enc.Base64);

  return exformatBase64(encryptedData);
}

/**
 * 解密响应数据
 * @param {string} encryptWord 要解密的数据
 * @param {string} ivBase64 对应的 iv
 * @returns {string} - 解密后的 json 字符串
 */
export function decrypt(encryptWord: string, ivBase64: string) {
  try {
    // 将 IV Base64转换为 WordArray
    let iv1 = CryptoJS.enc.Base64.parse(deformatBase64(ivBase64));
    // 创建密钥
    let key = CryptoJS.enc.Base64.parse(keyOne);
    // 还原 Base64 字符串并解码为 WordArray
    let encryptedData = CryptoJS.enc.Base64.parse(deformatBase64(encryptWord));
    // 创建 CipherParams 对象
    let cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedData,
    });
    // 解密数据
    let dec = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv1,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    });
    // 尝试将解密后的数据转换为字符串
    let decryptedStr = dec.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) {
      throw new Error("解密后的数据不能转换为有效的 UTF-8 字符串");
    }

    return decryptedStr;
  } catch (error) {
    return '{"error": "' + error + '"}';
  }
}

//格式化base64字符串
// 替换
export function exformatBase64(base64Str: string) {
  return base64Str.replace(/\//g, "_").replace(/\+/g, "-");
}
//还原
export function deformatBase64(base64Str: string) {
  return base64Str.replace(/_/g, "/").replace(/-/g, "+");
}

/**
 * 匹配路径的方法
 * @param patterns 匹配规则
 * @param path 匹配路径
 */
export function matchPath(patterns: string[], path: string) {
  return patterns.some((pattern) => {
    // 如果模式以 /** 结尾，需要特别处理
    if (pattern.endsWith("/**")) {
      // 移除结尾的 /** 并转义特殊字符
      const basePath = pattern
        .slice(0, -3)
        .replace(/([.+?^${}()|[\]\\])/g, "\\$1");
      const regex = new RegExp(`^${basePath}(?:|/.*)$`);

      // console.log("Original pattern:", pattern);
      // console.log("Converted regex:", regex);
      // console.log("Testing path:", path);
      // console.log("Match result:", regex.test(path));

      return regex.test(path);
    }

    // 处理其他情况
    let regexPattern = pattern
      .replace(/\*\*/g, ".*")
      .replace(/\*/g, "[^/]*")
      .replace(/([.+?^${}()|[\]\\])/g, "\\$1");

    const regex = new RegExp(`^${regexPattern}$`);

    return regex.test(path);
  });
}

/**
 * 针对密码的有效判断（大小写+数字+特殊字符 +8位以上）
 * @param input
 */
export function validatePassword(input: string): boolean {
  const hasUpperCase = /[A-Z]/.test(input);
  const hasLowerCase = /[a-z]/.test(input);
  const hasNumber = /[0-9]/.test(input);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);
  const isLongEnough = input.length >= 8;

  return (
    hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough
  );
}

/**
 * 判断邮箱是否有效
 * @param email
 */
export function validEmail(email: string) {
  return email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
}

/**
 * 判断手机号是否有效
 * @param phoneNumber
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // 正则表达式：匹配中国大陆地区的手机号
  const phoneRegex = /^(?:\+86)?1[3-9]\d{9}$/;

  // 测试手机号是否符合正则表达式
  return phoneRegex.test(phoneNumber);
}
