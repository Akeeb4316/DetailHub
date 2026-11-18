import Link from "next/link";
import { SERVICES } from "../lib";

export default function Home() {
  return (
    <main id="main-content">
      <section className="landing-hero">
        <div className="wrap landing-hero-inner">
          <p className="eyebrow">Mobile car detailing</p>
          <h1>A clean car.<br />Right where it’s parked.</h1>
          <p className="landing-intro">Book a mobile detail at your home or workplace. Pick your package, see your total, and request an arrival window online.</p>
          <Link className="action" href="/book">Book a detail <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="wrap services" id="services" aria-labelledby="service-heading">
        <h2 id="service-heading">Choose your detail</h2>
        <p>Starting prices are for cars and coupes. See your total as you select your vehicle and add-ons.</p>
        <div className="service-grid">
          {SERVICES.map((service) => (
            <article className="service-card" key={service.id}>
              <h3>{service.name}</h3>
              <p>{service.blurb}</p>
              <div className="service-price">From <strong>${service.base}</strong></div>
              <Link className="service-link" href={`/book?service=${service.id}`}>
                Book {service.name.toLowerCase()} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
