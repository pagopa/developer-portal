export type NavLink = {
  name: string;
  path: string;
  children: ReadonlyArray<NavLink>;
};

export type NavLinks = ReadonlyArray<NavLink>;
