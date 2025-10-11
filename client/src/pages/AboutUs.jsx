import "../styles/staticPage.css";

export default function AboutUs() {
    return (
        <div className="static-page">
            <div
                className="static-page__banner"
                style={{ backgroundImage: 'url(/showcase/studio.png)' }}
            >
                <div className="static-page__banner-overlay">
                    <h1>¿Quiénes somos?</h1>
                </div>
            </div>

            <div className="static-page__content">
                <section className="static-page__section">
                    <h2>Nuestra Historia</h2>
                    <p>
                        PressPlay nació de la pasión compartida por los videojuegos. Somos un equipo de gamers
                        que decidió crear algo más que una tienda: construimos una comunidad. En 2020, en medio
                        de la pandemia, nos dimos cuenta de que los jugadores necesitaban un espacio donde no solo
                        comprar juegos, sino conectar con otros que comparten la misma pasión.
                    </p>
                    <p>
                        Desde entonces, hemos crecido hasta convertirnos en una de las plataformas de referencia
                        en Latinoamérica para la compra de videojuegos digitales. Pero nunca olvidamos de dónde
                        venimos: somos gamers sirviendo a gamers.
                    </p>
                </section>

                <div className="static-page__image-placeholder">
                    <span>[ Espacio para imagen del equipo o instalaciones ]</span>
                </div>

                <section className="static-page__section">
                    <h2>Nuestra Misión</h2>
                    <p>
                        Creemos que todos merecen acceso a las mejores experiencias de gaming sin complicaciones.
                        Por eso trabajamos cada día para ofrecerte un catálogo curado, precios justos y un servicio
                        al cliente que realmente entiende tus necesidades como jugador.
                    </p>
                    <p>
                        No somos solo una tienda. Somos tus aliados en cada aventura, en cada partida épica,
                        en cada momento de diversión. Porque cuando tú ganas, nosotros ganamos.
                    </p>
                </section>

                <section className="static-page__section">
                    <h2>Nuestros Valores</h2>
                    <ul className="static-page__list">
                        <li><strong>Transparencia:</strong> Precios claros, sin sorpresas ni tarifas ocultas.</li>
                        <li><strong>Comunidad:</strong> Escuchamos a nuestros usuarios y mejoramos constantemente.</li>
                        <li><strong>Calidad:</strong> Solo ofrecemos productos que nosotros mismos compraríamos.</li>
                        <li><strong>Pasión:</strong> Amamos los videojuegos tanto como tú.</li>
                    </ul>
                </section>

                <div className="static-page__image-placeholder">
                    <span>[ Espacio para imagen de la comunidad o eventos ]</span>
                </div>
            </div>
        </div>
    );
}
