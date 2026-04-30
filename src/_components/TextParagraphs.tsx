type Props = {
  text: string;
  className?: string;
};

export function TextParagraphs({ text, className }: Props) {
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <>
      {paragraphs.map((block, i) => (
        <p key={i} className={className}>
          {block.trim()}
        </p>
      ))}
    </>
  );
}
