// PostCard.js
type PostCardProps = {
  item: string; // 确保类型与传入的 item 匹配
};
export const PostCard: React.FC<PostCardProps> = ({ item }) => {
  return <div>{item}</div>; // 渲染 item
};
