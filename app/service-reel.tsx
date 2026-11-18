const services = [
  { label: "Car Wash", primary: "🚙", accents: "🫧 💦", color: "wash" },
  { label: "Car Detailing", primary: "🚗", accents: "✨ ✨", color: "detail" },
  { label: "Mobile Tire Service", primary: "🛞", accents: "🔧", color: "tire" },
  { label: "Home Cleaning", primary: "🧹", accents: "🫧 ✨", color: "cleaning" },
  { label: "Lawn Care", primary: "🌿", accents: "🏡", color: "lawn" },
];

export default function ServiceReel() {
  return (
    <figure className="service-reel">
      <div className="reel-window" aria-hidden="true">
        <div className="reel-track">
          {services.map((service) => <ServicePanel key={service.color} service={service} />)}
          <div className="reel-panel reel-finale">
            <span className="reel-signal">🤝</span>
            <span className="reel-label">Give us a signal.</span>
            <span className="reel-caption">Sign in to find a local helping hand.</span>
          </div>
          <ServicePanel service={services[0]} />
        </div>
      </div>
      <figcaption className="sr-only">Car Wash, Car Detailing, Mobile Tire Service, Home Cleaning, and Lawn Care. Give us a signal. Sign in to find a local helping hand.</figcaption>
    </figure>
  );
}

function ServicePanel({ service }: { service: (typeof services)[number] }) {
  return (
    <div className={`reel-panel reel-${service.color}`}>
      <div className="reel-art">
        <span className="reel-accents">{service.accents}</span>
        <span className="reel-emoji">{service.primary}</span>
      </div>
      <span className="reel-label">{service.label}</span>
    </div>
  );
}
