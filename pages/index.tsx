import { useRouter } from "next/router";

import { getAllPosts } from "../utils/post";

import Helmet from "../components/Helmet/Helmet";
import HomeMain from "../container/pages/HomeMain/HomeMain";

import { DOMAIN, URL } from "../lib/config/urlConfig";

export default function Home({ allPostsData }) {
  const { asPath } = useRouter();

  return (
    <>
      <Helmet
        title="DDangji-log"
        description="Record the experience"
        image={`${URL.IMAGE.BASE}/favicon.png`}
        url={asPath ? `${DOMAIN}${asPath}` : DOMAIN}
      />
      <HomeMain posts={allPostsData} />
    </>
  );
}

export async function getStaticProps() {
  const allPostsData = getAllPosts();
  return {
    props: {
      allPostsData,
    },
  };
}
