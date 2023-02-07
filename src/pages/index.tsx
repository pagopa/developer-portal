import { InferGetStaticPropsType } from "next";
import CollectionList from "@/domain/collection";
import { getCollections } from "@/adapters/gitbook/collections";

export const getStaticProps = async () => {
  return {
    props: {
      collections: await getCollections(),
    },
  };
};

const Home = ({
  collections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <CollectionList collections={collections} />;
};

export default Home;
