import dynamic from "next/dynamic";

import { getPostData } from "../../utils/post";
import { getAllPostPaths } from "../../utils/post";

import { DOMAIN, URL } from "../../lib/config/urlConfig";
import { useRouter } from "next/router";
import Helmet from "../../components/Helmet/Helmet";
import { checkGif } from "../../utils/image";

const DynamicPostMain = dynamic(
  () => import("../../container/pages/PostMain/PostMain"),
  {
    ssr: false,
  }
);

const Post = (props: any) => {
  const { query, asPath } = useRouter();

  return (
    <>
      <Helmet
        title={`Ddangji-log | ${props.postData.title}`}
        description={props.postData.description}
        image={
          checkGif(props.postData.thumbnail)
            ? `${URL.IMAGE.BASE}/main_logo.png`
            : `${URL.IMAGE.POSTS}/${query.postId}/${props.postData.thumbnail}`
        }
        url={asPath ? `${DOMAIN}${asPath}` : DOMAIN}
      />
      <DynamicPostMain {...props} />
    </>
  );
};

export default Post;

export async function getStaticPaths() {
  const allPostsList = getAllPostPaths();

  return {
    paths: allPostsList,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.postId);

  return {
    props: {
      postData,
    },
  };
}
