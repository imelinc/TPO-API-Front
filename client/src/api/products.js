const API_URL = "http://localhost:8080";

// Datos mockeados de juegos
const MOCK_GAMES = [
    {
        id: 1,
        titulo: "Cyberpunk 2077",
        precio: 5999,
        tieneDescuento: true,
        precioConDescuento: 2999,
        stock: 50,
        categoriaId: 1,
        categoriaNombre: "RPG",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpf.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpf.jpg" }
        ],
        descripcion: "Un RPG de mundo abierto ambientado en el futuro distópico de Night City."
    },
    {
        id: 2,
        titulo: "The Witcher 3: Wild Hunt",
        precio: 3999,
        tieneDescuento: false,
        precioConDescuento: null,
        stock: 30,
        categoriaId: 1,
        categoriaNombre: "RPG",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg" }
        ],
        descripcion: "Una épica aventura de fantasía con Geralt de Rivia."
    },
    {
        id: 3,
        titulo: "Grand Theft Auto V",
        precio: 4999,
        tieneDescuento: true,
        precioConDescuento: 2499,
        stock: 25,
        categoriaId: 2,
        categoriaNombre: "Acción",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.jpg" }
        ],
        descripcion: "La experiencia definitiva de crimen en Los Santos."
    },
    {
        id: 4,
        titulo: "Red Dead Redemption 2",
        precio: 6999,
        tieneDescuento: false,
        precioConDescuento: null,
        stock: 20,
        categoriaId: 2,
        categoriaNombre: "Acción",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r6h.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r6h.jpg" }
        ],
        descripcion: "Una épica historia del Salvaje Oeste americano."
    },
    {
        id: 5,
        titulo: "FIFA 24",
        precio: 7999,
        tieneDescuento: true,
        precioConDescuento: 5999,
        stock: 100,
        categoriaId: 3,
        categoriaNombre: "Deportes",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2a.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2a.jpg" }
        ],
        descripcion: "El simulador de fútbol más realista del mundo."
    },
    {
        id: 6,
        titulo: "NBA 2K24",
        precio: 6999,
        tieneDescuento: false,
        precioConDescuento: null,
        stock: 40,
        categoriaId: 3,
        categoriaNombre: "Deportes",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2b.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2b.jpg" }
        ],
        descripcion: "La experiencia de baloncesto más auténtica."
    },
    {
        id: 7,
        titulo: "Call of Duty: Modern Warfare III",
        precio: 8999,
        tieneDescuento: true,
        precioConDescuento: 6999,
        stock: 60,
        categoriaId: 4,
        categoriaNombre: "Shooter",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2c.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2c.jpg" }
        ],
        descripcion: "La guerra moderna regresa con intensidad máxima."
    },
    {
        id: 8,
        titulo: "Counter-Strike 2",
        precio: 0,
        tieneDescuento: false,
        precioConDescuento: null,
        stock: 999,
        categoriaId: 4,
        categoriaNombre: "Shooter",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2d.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6w2d.jpg" }
        ],
        descripcion: "El shooter táctico más competitivo del mundo."
    },
    {
        id: 9,
        titulo: "Minecraft",
        precio: 2999,
        tieneDescuento: false,
        precioConDescuento: null,
        stock: 200,
        categoriaId: 5,
        categoriaNombre: "Sandbox",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg" }
        ],
        descripcion: "Construye, explora y sobrevive en mundos infinitos."
    },
    {
        id: 10,
        titulo: "The Legend of Zelda: Breath of the Wild",
        precio: 5999,
        tieneDescuento: true,
        precioConDescuento: 3999,
        stock: 35,
        categoriaId: 6,
        categoriaNombre: "Aventura",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r6i.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r6i.jpg" }
        ],
        descripcion: "Una aventura épica en el reino de Hyrule."
    },
    {
        id: 11,
        titulo: "Elden Ring",
        precio: 7999,
        tieneDescuento: false,
        precioConDescuento: null,
        stock: 45,
        categoriaId: 1,
        categoriaNombre: "RPG",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpg.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpg.jpg" }
        ],
        descripcion: "Un RPG de mundo abierto con combate desafiante."
    },
    {
        id: 12,
        titulo: "Spider-Man: Miles Morales",
        precio: 4999,
        tieneDescuento: true,
        precioConDescuento: 2999,
        stock: 30,
        categoriaId: 2,
        categoriaNombre: "Acción",
        imagenUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rph.jpg",
        imagenes: [
            { url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rph.jpg" }
        ],
        descripcion: "Swing por Nueva York como el nuevo Spider-Man."
    }
];

// Función para simular delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Función para simular paginación
const paginateData = (data, page, size) => {
    const start = page * size;
    const end = start + size;
    const content = data.slice(start, end);
    
    return {
        content,
        totalElements: data.length,
        totalPages: Math.ceil(data.length / size),
        size,
        number: page,
        first: page === 0,
        last: end >= data.length,
        numberOfElements: content.length
    };
};

// Variable para controlar si usar mock o API real
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

// Funciones mock
const mockGetDisponibles = async ({ page = 0, size = 12 } = {}) => {
    await simulateNetworkDelay();
    return paginateData(MOCK_GAMES, page, size);
};

const mockBuscarPorTitulo = async ({ titulo, page = 0, size = 12 }) => {
    await simulateNetworkDelay();
    const filtered = MOCK_GAMES.filter(game => 
        game.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
    return paginateData(filtered, page, size);
};

const mockGetProducto = async (id) => {
    await simulateNetworkDelay();
    const game = MOCK_GAMES.find(g => g.id === parseInt(id));
    if (!game) {
        throw new Error("Producto no encontrado");
    }
    return game;
};

// Funciones exportadas
export async function getDisponibles({ page = 0, size = 12 } = {}) {
    if (USE_MOCK) {
        return await mockGetDisponibles({ page, size });
    }
    
    const url = `${API_URL}/productos-publicos?page=${page}&size=${size}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudieron cargar los productos");
    return res.json(); // Page<ProductoDTO>
}

export async function buscarPorTitulo({ titulo, page = 0, size = 12 }) {
    if (USE_MOCK) {
        return await mockBuscarPorTitulo({ titulo, page, size });
    }
    
    const qs = new URLSearchParams({ titulo, page, size });
    const url = `${API_URL}/productos-publicos/buscar?${qs.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo buscar productos");
    return res.json(); // Page<ProductoDTO>
}

export async function getProducto(id) {
    if (USE_MOCK) {
        return await mockGetProducto(id);
    }
    
    const url = `${API_URL}/productos-publicos/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Producto no encontrado");
    return res.json();
}

export const getPublicos = ({ page = 0, size = 12 }) =>
    fetch(`/productos-publicos?page=${page}&size=${size}`).then(r => r.json());

export const getPorCategoria = ({ categoriaId, page = 0, size = 100 }) =>
    fetch(`/productos-publicos/categoria/${categoriaId}?page=${page}&size=${size}`).then(r => r.json());

export const buscarPorPrecio = ({ min, max, page = 0, size = 100 }) =>
    fetch(`/productos-publicos/precio?precioMin=${min}&precioMax=${max}&page=${page}&size=${size}`).then(r => r.json());
