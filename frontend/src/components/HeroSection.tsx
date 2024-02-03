import '../styles/heroSection.scss'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Electronics Home</h1>
        <p>Discover the latest electronics for your smart home.</p>
        <button className="hero-btn">Shop Now</button>
      </div>
      <img className="hero-image" src="src\assets\hero.png" alt="Hero Image" />
    </section>
  )
}

export default HeroSection
