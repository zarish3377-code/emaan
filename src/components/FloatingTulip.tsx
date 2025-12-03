import floatingTulip from "@/assets/floating_tulip.png";

interface FloatingTulipProps {
  style: React.CSSProperties;
  delay?: number;
  size?: number;
}

const FloatingTulip = ({ style, delay = 0, size = 80 }: FloatingTulipProps) => {
  const animationClass = [
    "float-animation",
    "float-animation-delay-1",
    "float-animation-delay-2",
    "float-animation-delay-3",
    "float-animation-delay-4",
    "float-animation-delay-5",
  ][delay % 6];

  return (
    <img
      src={floatingTulip}
      alt=""
      className={`pointer-events-none absolute opacity-85 ${animationClass}`}
      style={{
        width: size,
        height: "auto",
        ...style,
      }}
    />
  );
};

export default FloatingTulip;
