import "../../styles/heroShowcase.css";

export default function HeroShowcase() {
    return (
        <section className="showcase">
            {/* Banner principal fijo */}
            <article
                className="hero-cover"
                style={{ backgroundImage: 'url(/showcase/hero.png)' }}
            >
                <div className="hero-cover__overlay">
                    <h1>Bienvenido a PressPlay</h1>
                    <p>Tu tienda de videojuegos con ofertas y soporte de primera.</p>
                </div>
            </article>

            <div className="promo-grid">
                <article
                    className="promo-card"
                    style={{ backgroundImage: 'url(/showcase/studio.png)' }}
                >
                    <div className="promo-card__content">
                        <h3>¿Quiénes somos?</h3>
                        <p>Amamos los videojuegos. Seleccionamos títulos que valen tu tiempo.</p>
                    </div>
                </article>

                <article
                    className="promo-card"
                    style={{ backgroundImage: 'url(/showcase/service.png)' }}
                >
                    <div className="promo-card__content">
                        <h3>Servicios</h3>
                        <p>Soporte 24/7, reembolsos simples y bibliotecas en la nube.</p>
                    </div>
                </article>

                <article
                    className="promo-card"
                    style={{ backgroundImage: 'url(/showcase/calidad.jpg)' }}
                >
                    <div className="promo-card__content">
                        <h3>Calidad garantizada</h3>
                        <p>Juegos de la mejor calidad, sin vueltas.</p>
                    </div>
                </article>
            </div>
        </section>
    );
}
