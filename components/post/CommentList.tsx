"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";

import { BaseResponse, PageResult } from "@/types";
import {
  PostCommentParam,
  PostCommentVO,
  PostCommentsDTO,
} from "@/types/post/comment";
import {
  deletePostCommentAction,
  addPostCommentAction,
  getCommentListByPostIdAction,
} from "@/app/(main)/mdx-page/[slug]/action";

interface CommentListProps {
  postId: string;
  userId?: string;
}

const PAGE_SIZE = 10;

export default function CommentList({ postId, userId }: CommentListProps) {
  const [comments, setComments] = useState<PostCommentVO[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    userId: string;
    userName: string;
  } | null>(null);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();
  const currentUser = getCookie();
  const currentId = currentUser?.id;
  const lastCommentRef = useRef<HTMLDivElement>(null);
  //折叠函数
  const toggleExpand = (parentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };
  // 拉取评论列表
  const fetchComments = async (page: number) => {
    setLoading(true);
    try {
      const param: PostCommentParam = {
        postId,
        pageNo: page.toString(),
        pageSize: PAGE_SIZE.toString(),
      };
      const res: BaseResponse<PageResult<PostCommentVO>> =
        await getCommentListByPostIdAction(param);

      if (res.success && res.data) {
        setComments(res.data.records || []);
        setTotal(res.data.total || 0);
      } else {
        throw new Error(res.message || "获取评论失败");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`加载评论失败: ${err.message}`);
      setComments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 监听 postId 和 pageNum
  useEffect(() => {
    fetchComments(pageNum);
  }, [postId, pageNum]);

  // 删除评论
  const handleDelete = async (commentId: string) => {
    if (!window.confirm("确认删除这条评论？")) return;
    if (!currentId) {
      toast.error("请先登录");
      return router.push("/login");
    }
    try {
      const param: PostCommentParam = {
        postId,
        postCommentId: commentId,
        userId: currentId,
      };
      const res: BaseResponse<null> = await deletePostCommentAction(param);
      if (res.success) {
        toast.success("删除成功");
        fetchComments(pageNum);
      } else {
        throw new Error(res.message || "删除失败");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`删除失败: ${err.message}`);
    }
  };

  // 回复评论
  const handleReply = (c: PostCommentVO) => {
    setReplyingTo({
      commentId: c.id,
      userId: c.user.userId,
      userName: c.user.userName || c.user.userId,
    });
    setTimeout(() => {
      document.getElementById("comment-textarea")?.focus();
    }, 100);
  };
  const cancelReply = () => setReplyingTo(null);

  // 发布/回复评论
  const handleSubmit = async () => {
    if (!currentId) {
      toast.error("请先登录");
      return router.push("/login");
    }
    if (!newContent.trim()) {
      return toast.error("评论内容不能为空");
    }
    setSubmitting(true);
    try {
      const isReply = replyingTo !== null;
      // 查找父评论 ID
      const findParent = (
        list: PostCommentVO[],
        targetId: string
      ): { parentId: string } => {
        for (const item of list) {
          if (item.id === targetId) {
            return { parentId: item.id };
          }
          if (item.childrens) {
            for (const ch of item.childrens) {
              if (ch.id === targetId) {
                return { parentId: item.id };
              }
            }
          }
        }
        return { parentId: "0" };
      };
      const { parentId } = isReply
        ? findParent(comments, replyingTo!.commentId)
        : { parentId: "0" };

      const postCommentsDTO: PostCommentsDTO = {
        postId,
        parentId,
        toUserId: isReply ? replyingTo!.userId : userId || currentId,
        userId: currentId,
        replyCommentId: isReply ? replyingTo!.commentId : "0",
        content: newContent.trim(),
      };
      const res: BaseResponse<Record<string, string>> =
        await addPostCommentAction(postCommentsDTO);

      if (res.success) {
        if (res.data?.badWord) {
          toast.error(`发布失败: 包含敏感词「${res.data.badWord}」`);
          return;
        }
        toast.success(isReply ? "回复成功" : "评论发布成功");
        setNewContent("");
        setReplyingTo(null);
        await fetchComments(pageNum);
        setTimeout(() => {
          lastCommentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      } else {
        throw new Error(res.message || "发布失败");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`发布失败: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 渲染单条评论
  const renderComment = (c: PostCommentVO, idx: number) => {
    const isMine = currentId === c.user.userId;
    const isLast = idx === comments.length - 1;
    return (
      <div
        key={c.id}
        ref={isLast ? lastCommentRef : null}
        className="border rounded-md p-3 mb-3 shadow-sm bg-white dark:bg-gray-800 dark:text-gray-200"
        style={{ marginLeft: (c.level ?? 0) > 1 ? 32 : 0 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <img
              src={c.user.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {c.user.userName || c.user.userId}
                </span>

                {c.level === 2 && c.toUser && (
                  <span className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 ml-2">
                    <span>回复 @{c.toUser.userName || c.toUser.userId}</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {c.commentTime ? new Date(c.commentTime).toLocaleString() : ""}
              </div>
            </div>
          </div>

          {isMine && (
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-600 hover:underline dark:text-red-400 text-sm px-2 py-0.5 rounded transition"
            >
              删除
            </button>
          )}
        </div>
        <div className="mt-2 whitespace-pre-wrap">{c.content}</div>
        <div className="mt-2 flex space-x-4 text-sm">
          <button
            onClick={() => handleReply(c)}
            className="text-blue-600 dark:text-blue-400 hover:underline px-2 py-0.5 rounded transition"
          >
            回复
          </button>
        </div>
        {c.childrens && c.childrens.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            {c.childrens.length > 2 && !expandedComments[c.id] ? (
              <>
                {c.childrens
                  .slice(0, 2)
                  .map((child, idx) => renderComment(child, idx))}
                <button
                  className="mt-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-gray-600 transition"
                  onClick={() => toggleExpand(c.id)}
                >
                  展开 {c.childrens.length - 2} 条回复
                </button>
              </>
            ) : (
              <>
                {c.childrens.map((child, idx) => renderComment(child, idx))}
                {c.childrens.length > 2 && (
                  <button
                    className="mt-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-gray-600 transition"
                    onClick={() => toggleExpand(c.id)}
                  >
                    收起
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      <h3 className="text-2xl font-bold mb-4 dark:text-white">评论区</h3>

      {loading ? (
        <div className="text-center py-6 dark:text-gray-300">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 dark:text-gray-300">
          暂无评论，快来抢沙发！
        </div>
      ) : (
        <>{comments.map(renderComment)}</>
      )}

      {/* 分页 */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => setPageNum((p) => Math.max(1, p - 1))}
          disabled={pageNum <= 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
        >
          上一页
        </button>
        <span className="dark:text-gray-300">
          {pageNum} / {pageCount || 1}
        </span>
        <button
          onClick={() => setPageNum((p) => Math.min(pageCount, p + 1))}
          disabled={pageNum >= pageCount}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
        >
          下一页
        </button>
      </div>

      {/* 评论输入框 */}
      <div className="mt-8">
        {replyingTo && (
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <span>正在回复 @{replyingTo.userName}</span>
            <button
              onClick={cancelReply}
              className="ml-2 text-red-500 dark:text-red-400 hover:underline px-2 py-0.5 rounded transition"
            >
              取消
            </button>
          </div>
        )}
        <textarea
          id="comment-textarea"
          rows={4}
          placeholder={
            replyingTo ? `回复 @${replyingTo.userName}...` : "写下你的评论..."
          }
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full p-3 border rounded resize-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-3 px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
        >
          {submitting ? "Ai语义检查中..." : replyingTo ? "回复" : "发布评论"}
        </button>
      </div>
    </div>
  );
}
