// ════════════════════════════════════════════════════════
//  Intro Section — Hero with title, enter button, scroll hint
// ════════════════════════════════════════════════════════

export default function IntroSection({ entered, onEnter }) {
  return (
    <section className="intro-section" id="intro">
      <div className="intro-glow" />

      <div className="intro-content">
        <p className="intro-label">a digital keepsake</p>
        <h1 className="intro-title">
          some phases of pratii <span className="blossom">🌺</span>
        </h1>
        <p className="intro-subtitle">
          scroll through the small digital world made specifically for you
        </p>

        {!entered && (
          <button className="intro-enter" onClick={onEnter}>
            begin
          </button>
        )}
      </div>

      {entered && (
        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      )}
    </section>
  )
}
