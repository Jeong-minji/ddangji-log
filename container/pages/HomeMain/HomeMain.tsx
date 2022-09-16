import PostList from "../../../components/Post/PostList/PostList";

import { HomeMainProps } from "../../containerType";
import { HOME } from "../../../lib/config/blogConfig";

const HomeMain = ({ posts }: HomeMainProps) => {
  return <PostList posts={posts} title={HOME.ALL_POST} />;
};

export default HomeMain;
