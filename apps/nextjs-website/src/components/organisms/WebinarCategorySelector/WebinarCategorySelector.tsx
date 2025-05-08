import { WebinarCategory } from '@/lib/types/webinarCategory';
import DesktopWebinarCategorySelector from '@/components/molecules/DesktopWebinarCategorySelector/DesktopWebinarCategorySelector';
import MobileWebinarCategorySelector from '@/components/molecules/MobileWebinarCategorySelector/MobileWebinarCategorySelector';

type WebinarCategorySelectorProps = {
  selectedWebinarCategory: number;
  // eslint-disable-next-line functional/no-return-void
  setSelectedWebinarCategory: (selectedWebinarCategory: number) => void;
  webinarCategories: WebinarCategory[];
  isMobile: boolean;
};

const WebinarCategorySelector = ({
  selectedWebinarCategory,
  setSelectedWebinarCategory,
  webinarCategories,
  isMobile,
}: WebinarCategorySelectorProps) => {
  if (isMobile)
    return (
      <MobileWebinarCategorySelector
        selectedWebinarCategory={selectedWebinarCategory}
        setSelectedWebinarCategory={setSelectedWebinarCategory}
        webinarCategories={webinarCategories}
      />
    );
  else
    return (
      <DesktopWebinarCategorySelector
        selectedWebinarCategory={selectedWebinarCategory}
        setSelectedWebinarCategory={setSelectedWebinarCategory}
        webinarCategories={webinarCategories}
      />
    );
};

export default WebinarCategorySelector;
