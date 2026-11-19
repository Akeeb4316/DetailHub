import Link from "next/link";
import { SERVICES } from "../lib";
import ServiceReel from "./service-reel";

export default function Home() {
  return (
    <main id="main-content">
      <section className="wrap landing-hero">
        <div>
          <h1>Book local help.<br /><span>We’ll come to you.</span></h1>
          <p className="landing-intro">Find businesses that come to your home or workplace. Pick a service, see the price, and request a time online.</p>
          <Link className="action" href="#services">Browse services <span aria-hidden="true">↗</span></Link>
        </div>
        <ServiceReel />
      </section>
      <section className="wrap services" id="services" aria-labelledby="service-heading">
        <h2 id="service-heading">Browse services</h2>
        <h3 className="category-status">Mobile car detailing</h3>
        {SERVICES.map((service) => (
          <article className="service-row" key={service.id}>
            <div><h3>{service.name}</h3><p>{service.blurb}</p></div>
            <div className="service-price">From <strong>${service.base}</strong></div>
            <Link className="service-link" href={`/book?service=${service.id}`}>
              Book <span className="sr-only">{service.name.toLowerCase()}</span><span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
        <div className="planned-services">
          <h3>Planned services</h3>
          <p>Mobile tire service and standalone car washes are planned for future booking.</p>
        </div>
      </section>
    </main>
  );
}
