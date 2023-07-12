import { ComponentType } from '@/lib/enums/componentType';
import { TypographyProps } from '@mui/material/Typography/Typography';

export type Part = {
  readonly componentType: ComponentType;
  readonly props: (TypographyProps & { readonly text: string }) | unknown; // TODO: add contentType related prop types
};
