export default function Logo({ light = false, className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <img
        className="logo-img"
        src="/namastratravel.png"
        alt="Namastra Travel"
        width="221"
        height="49"
      />
    </span>
  )
}