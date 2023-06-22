// TODO: To remove
interface AtomProps {
  value?: string | number | null;
}

const Atom = ({ value }: AtomProps) => <div>{value}</div>;

export default Atom;
