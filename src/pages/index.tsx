import { InferGetStaticPropsType } from "next";
import { getCollections } from "@/adapters/gitbook/collections";
import CollectionList from "@/domain/components/CollectionList";

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
