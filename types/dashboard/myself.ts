/**
 * 用户发帖频率数据请求参数
 */
export interface FrequencyRequest {
    userId: string;
 };
  
// 用户发帖频率数据响应
export type FrequencyVo = {
    postDate: string;
    postCount: number;
  };