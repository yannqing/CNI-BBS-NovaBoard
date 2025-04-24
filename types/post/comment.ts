
import { UserVo } from "@/types/auth/user";



export interface PostCommentVO {
    id: string;
    user: UserVo;
    content: string;
    childrens?: PostCommentVO[];
    commentTime: string; 
    level?: number;
    toUser?: UserVo | null;
  }

export type PostCommentParam = {
    postId: string;
    userId?: string;     
    postCommentId?: string;
    pageNo?: string;
    pageSize?: string;
  }

export type  PostCommentsDTO ={
    postId: string;
    parentId: string;
    userId: string;
    toUserId: string;
    replyCommentId: string;
    content: string;
  }


