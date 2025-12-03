interface FloatingTextProps {
  text: string;
  style: React.CSSProperties;
  delay?: number;
}

const FloatingText = ({ text, style, delay = 0 }: FloatingTextProps) => {
  const animationClass = [
    "float-animation",
    "float-animation-delay-1",
    "float-animation-delay-2",
    "float-animation-delay-3",
    "float-animation-delay-4",
    "float-animation-delay-5",
  ][delay % 6];

  return (
    <p
      className={`pointer-events-none absolute font-body text-sm italic text-primary/70 ${animationClass}`}
      style={style}
    >
      {text}
    </p>
  );
};

export default FloatingText;
