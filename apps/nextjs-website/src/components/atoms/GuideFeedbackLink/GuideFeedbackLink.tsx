interface GuideFeedbackLinkProps {
  readonly label: string;
  readonly href: string;
}

const GuideFeedbackLink = ({ label, href }: GuideFeedbackLinkProps) => {
  // return link
  return (
    <a href={href} target='_blank' rel='noopener noreferrer'>
      {label}
    </a>
  );
};

export default GuideFeedbackLink;
