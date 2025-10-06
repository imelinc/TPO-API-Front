import HeroShowcase from "../components/home/HeroShowcase";

export default function Home() {
    return (
        <>
            <HeroShowcase />
            <section id="games-section" className="games-section">

                <div className="games-header">
                    <h2>Juegos destacados</h2>
                    <p>Explorá los títulos más populares y los últimos lanzamientos de PressPlay.</p>
                </div>

            </section>
        </>
    );
}
