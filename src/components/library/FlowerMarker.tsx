interface Props {
  type: 'tulip' | 'daisy';
  size?: number;
}

/** Tiny tulip / daisy marker used to indicate annotations on a page. */
const FlowerMarker = ({ type, size = 20 }: Props) => {
  if (type === 'tulip') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 21 V12" stroke="#5b8a72" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 17 q-3 -1 -4 -4" stroke="#5b8a72" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path
          d="M12 4 C9 6 7 9 7 11.5 C7 13.5 9 14.5 12 14.5 C15 14.5 17 13.5 17 11.5 C17 9 15 6 12 4 Z"
          fill="#e26d8a" stroke="#a64965" strokeWidth="0.8"
        />
        <path d="M12 4 C11 7 11 11 12 14.5" stroke="#a64965" strokeWidth="0.6" fill="none" opacity="0.6" />
      </svg>
    );
  }
  // daisy
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path d="M12 22 V14" stroke="#5b8a72" strokeWidth="1.4" strokeLinecap="round" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg} cx="12" cy="6" rx="2.2" ry="4"
          fill="#fdf6e3" stroke="#d8c89a" strokeWidth="0.5"
          transform={`rotate(${deg} 12 11)`}
        />
      ))}
      <circle cx="12" cy="11" r="2.2" fill="#f0c14b" stroke="#a88430" strokeWidth="0.5" />
    </svg>
  );
};

export default FlowerMarker;
