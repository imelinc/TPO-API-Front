const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

const authHeaders = (token) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
});

// Variable para controlar si usar mock o API real
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

// Almacenamiento local para carritos mock
const mockCarts = new Map();
const mockWishlists = new Map();

// Función para simular delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Funciones mock para carrito
const mockCreateCartIfMissing = async (token, usuarioId) => {
    await simulateNetworkDelay();
    if (!mockCarts.has(usuarioId)) {
        mockCarts.set(usuarioId, {
            id: `cart_${usuarioId}`,
            usuarioId: usuarioId,
            items: [],
            total: 0,
            fechaCreacion: new Date().toISOString()
        });
    }
    return mockCarts.get(usuarioId);
};

const mockGetCart = async (token, usuarioId) => {
    await simulateNetworkDelay();
    const cart = mockCarts.get(usuarioId);
    if (!cart) {
        return await mockCreateCartIfMissing(token, usuarioId);
    }
    return cart;
};

const mockAddItemToCart = async (token, usuarioId, { productoId, cantidad, precio }) => {
    await simulateNetworkDelay();
    
    // Asegurar que el carrito existe
    await mockCreateCartIfMissing(token, usuarioId);
    const cart = mockCarts.get(usuarioId);
    
    // Buscar si el producto ya está en el carrito
    const existingItem = cart.items.find(item => item.productoId === productoId);
    
    if (existingItem) {
        existingItem.cantidad += cantidad;
    } else {
        cart.items.push({
            productoId,
            cantidad,
            precioUnitario: precio,
            subtotal: precio * cantidad
        });
    }
    
    // Recalcular total
    cart.total = cart.items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    
    return cart;
};

const mockUpdateCartItemQty = async (token, usuarioId, productoId, cantidad) => {
    await simulateNetworkDelay();
    const cart = mockCarts.get(usuarioId);
    if (!cart) throw new Error("Carrito no encontrado");
    
    const item = cart.items.find(item => item.productoId === productoId);
    if (!item) throw new Error("Item no encontrado en el carrito");
    
    if (cantidad <= 0) {
        cart.items = cart.items.filter(item => item.productoId !== productoId);
    } else {
        item.cantidad = cantidad;
    }
    
    // Recalcular total
    cart.total = cart.items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    
    return cart;
};

const mockRemoveCartItem = async (token, usuarioId, productoId) => {
    await simulateNetworkDelay();
    const cart = mockCarts.get(usuarioId);
    if (!cart) throw new Error("Carrito no encontrado");
    
    cart.items = cart.items.filter(item => item.productoId !== productoId);
    
    // Recalcular total
    cart.total = cart.items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    
    return cart;
};

const mockClearCart = async (token, usuarioId) => {
    await simulateNetworkDelay();
    const cart = mockCarts.get(usuarioId);
    if (!cart) throw new Error("Carrito no encontrado");
    
    cart.items = [];
    cart.total = 0;
    
    return cart;
};

const mockValidateCheckout = async (token, usuarioId) => {
    await simulateNetworkDelay();
    const cart = mockCarts.get(usuarioId);
    if (!cart || cart.items.length === 0) {
        return { valido: false, mensaje: "El carrito está vacío" };
    }
    return { valido: true, mensaje: "Checkout válido" };
};

const mockDoCheckout = async (token, usuarioId) => {
    await simulateNetworkDelay();
    const cart = mockCarts.get(usuarioId);
    if (!cart || cart.items.length === 0) {
        throw new Error("El carrito está vacío");
    }
    
    // Crear orden mock
    const order = {
        id: `order_${usuarioId}_${Date.now()}`,
        usuarioId: usuarioId,
        items: [...cart.items],
        total: cart.total,
        fechaCreacion: new Date().toISOString(),
        estado: "PENDIENTE"
    };
    
    // Limpiar carrito
    cart.items = [];
    cart.total = 0;
    
    return order;
};

// -------- Carrito --------
export async function createCartIfMissing(token, usuarioId) {
    if (USE_MOCK) {
        return await mockCreateCartIfMissing(token, usuarioId);
    }
    
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}`, {
        method: "POST",
        headers: authHeaders(token),
        credentials: "include"
    });
    if (!res.ok) throw new Error("No se pudo crear/obtener el carrito");
    return res.json();
}

export async function getCart(token, usuarioId) {
    if (USE_MOCK) {
        return await mockGetCart(token, usuarioId);
    }
    
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}`, {
        headers: authHeaders(token),
        credentials: "include"
    });
    if (!res.ok) throw new Error("No se pudo obtener el carrito");
    const data = await res.json();
    return data;
}

export async function clearCart(token, usuarioId) {
    if (USE_MOCK) {
        return await mockClearCart(token, usuarioId);
    }
    
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}/vaciar`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("No se pudo vaciar el carrito");
    return res.json(); // CarritoDTO
}

// -------- Ítems --------
export async function addItemToCart(token, usuarioId, { productoId, cantidad, precio }) {
    if (USE_MOCK) {
        return await mockAddItemToCart(token, usuarioId, { productoId, cantidad, precio });
    }
    
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}/items`, {
        method: "POST",
        headers: authHeaders(token),
        credentials: "include",
        body: JSON.stringify({ productoId, cantidad, precio }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo agregar el producto al carrito");
    }
    return res.json(); // CarritoDTO
}

export async function updateCartItemQty(token, usuarioId, productoId, cantidad) {
    if (USE_MOCK) {
        return await mockUpdateCartItemQty(token, usuarioId, productoId, cantidad);
    }
    
    const res = await fetch(
        `${API}/carritos/usuario/${usuarioId}/items/${productoId}`,
        {
            method: "PATCH",
            headers: authHeaders(token),
            credentials: "include",
            body: JSON.stringify({ cantidad }),
        }
    );
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo actualizar la cantidad");
    }
    return res.json(); // CarritoDTO
}

export async function removeCartItem(token, usuarioId, productoId) {
    if (USE_MOCK) {
        return await mockRemoveCartItem(token, usuarioId, productoId);
    }
    
    const res = await fetch(
        `${API}/carritos/usuario/${usuarioId}/items/${productoId}`,
        {
            method: "DELETE",
            headers: authHeaders(token),
            credentials: "include"
        }
    );
    if (!res.ok) throw new Error("No se pudo eliminar el ítem");
    return res.json(); // CarritoDTO
}

// -------- Checkout --------
export async function validateCheckout(token, usuarioId) {
    if (USE_MOCK) {
        return await mockValidateCheckout(token, usuarioId);
    }
    
    const res = await fetch(`${API}/checkout/usuario/${usuarioId}/validar`, {
        headers: authHeaders(token),
        credentials: "include"
    });
    if (!res.ok) throw new Error("No se pudo validar el checkout");
    return res.json(); // { valido, mensaje }
}

export async function doCheckout(token, usuarioId) {
    if (USE_MOCK) {
        return await mockDoCheckout(token, usuarioId);
    }
    
    const res = await fetch(`${API}/checkout/usuario/${usuarioId}`, {
        method: "POST",
        headers: authHeaders(token),
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo realizar el checkout");
    }
    return res.json(); // OrdenDTO
}
