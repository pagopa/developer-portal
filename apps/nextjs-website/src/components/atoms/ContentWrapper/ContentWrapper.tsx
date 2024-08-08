import { ReactNode } from 'react';

// CHATBOT_CONTENT_ID is used to identify the content of guide pages for the chatbot
const CHATBOT_CONTENT_ID = 'page-content';

const ContentWrapper = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => <div id={CHATBOT_CONTENT_ID}>{children}</div>;

export default ContentWrapper;
