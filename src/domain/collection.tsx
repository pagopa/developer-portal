export type Collection = {
  id: string;
  title: string;
};

type Props = {
  collections: ReadonlyArray<Collection>;
};

function CollectionList({ collections }: Props) {
  return (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>{collection.title}</li>
      ))}
    </ul>
  );
}

export default CollectionList;
