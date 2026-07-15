/** Let the shared homepage atmosphere show through — no second layer that creates a frame. */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* Soft left wash only for copy legibility — same palette as body */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ebe4f6]/55 via-transparent to-transparent" />
    </div>
  );
}
