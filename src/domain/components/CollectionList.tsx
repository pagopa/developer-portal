import { Collection } from "@/domain/collection";

type Props = {
  collections: ReadonlyArray<Collection>;
};

const CollectionList = ({ collections }: Props) => (
  <ul>
    {collections.map((collection) => (
      <li key={collection.id}>{collection.title}</li>
    ))}
  </ul>
);

export default CollectionList;
