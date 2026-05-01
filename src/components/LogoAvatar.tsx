import logo from "/logo.png";

interface LogoAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 rounded-xl",
  md: "w-10 h-10 rounded-2xl",
  lg: "w-14 h-14 rounded-2xl",
  xl: "w-20 h-20 rounded-3xl",
};

const LogoAvatar = ({ size = "md", glow = true, className = "" }: LogoAvatarProps) => (
  <div
    className={`${sizeMap[size]} overflow-hidden flex items-center justify-center bg-background ${
      glow ? "glow-primary" : ""
    } ${className}`}
  >
    <img src={logo} alt="Arisan Galaxy" className="w-full h-full object-contain" />
  </div>
);

export default LogoAvatar;