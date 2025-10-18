# Sistema de Datos Mockeados

Este sistema permite que la aplicación funcione completamente sin necesidad de tener el backend conectado.

## 🎮 Juegos Mockeados

### Juegos Disponibles:
- **Cyberpunk 2077** - RPG - $59.99 (50% descuento)
- **The Witcher 3: Wild Hunt** - RPG - $39.99
- **Grand Theft Auto V** - Acción - $49.99 (50% descuento)
- **Red Dead Redemption 2** - Acción - $69.99
- **FIFA 24** - Deportes - $79.99 (25% descuento)
- **NBA 2K24** - Deportes - $69.99
- **Call of Duty: Modern Warfare III** - Shooter - $89.99 (22% descuento)
- **Counter-Strike 2** - Shooter - Gratis
- **Minecraft** - Sandbox - $29.99
- **The Legend of Zelda: Breath of the Wild** - Aventura - $59.99 (33% descuento)
- **Elden Ring** - RPG - $79.99
- **Spider-Man: Miles Morales** - Acción - $49.99 (40% descuento)

### Categorías:
1. RPG
2. Acción
3. Deportes
4. Shooter
5. Sandbox
6. Aventura

## 👥 Usuarios Mockeados

### Para Login:
- **Admin:** `admin@pressplay.com` / `123456`
- **Vendedor:** `vendedor@pressplay.com` / `123456`
- **Comprador:** `comprador@pressplay.com` / `123456`

## 🛒 Funcionalidades Mockeadas

### ✅ Carrito de Compras
- Agregar productos al carrito
- Actualizar cantidades
- Eliminar productos
- Calcular totales
- Checkout (crea orden mock)

### ✅ Wishlist
- Agregar productos a wishlist
- Eliminar productos
- Ver lista de deseos
- Prevenir duplicados

### ✅ Sistema de Autenticación
- Login con usuarios mock
- Redirección según rol
- Tokens mock únicos

## 🔧 Cómo Desactivar el Mock

Para usar el backend real, cambia estas variables a `false`:

```javascript
// En client/src/api/auth.js
const USE_MOCK = false;

// En client/src/api/products.js
const USE_MOCK = false;

// En client/src/api/cart.js
const USE_MOCK = false;

// En client/src/api/wishlist.js
const USE_MOCK = false;
```

## 🎯 Características del Mock

- **Delay de red simulado** para experiencia realista
- **Validación de permisos** (solo COMPRADOR puede usar carrito/wishlist)
- **Manejo de errores** apropiado
- **Persistencia en memoria** durante la sesión
- **Contadores actualizados** en tiempo real
- **Filtros y búsqueda** funcionando
- **Paginación** implementada

## 🚀 Cómo Probar

1. Inicia sesión con `comprador@pressplay.com` / `123456`
2. Ve a la página principal
3. Haz clic en los botones 🛒 y ♥ de cualquier juego
4. Verifica que los contadores se actualicen
5. Ve a `/cart` y `/wishlist` para ver los productos agregados

¡El sistema está listo para usar sin backend! 🎉
