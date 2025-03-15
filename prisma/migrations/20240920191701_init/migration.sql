-- CreateTable
CREATE TABLE `Rol` (
    `cveRol` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(250) NOT NULL,
    `clave` VARCHAR(45) NOT NULL,
    `activo` BOOLEAN NOT NULL,

    PRIMARY KEY (`cveRol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `cveCategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(250) NOT NULL,
    `activo` BOOLEAN NOT NULL,

    PRIMARY KEY (`cveCategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `cveUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(350) NOT NULL,
    `apellidos` VARCHAR(450) NOT NULL,
    `username` VARCHAR(150) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL,
    `cveRol` INTEGER NOT NULL,

    PRIMARY KEY (`cveUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `cveProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(350) NOT NULL,
    `precio` DOUBLE NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `cveCategoria` INTEGER NOT NULL,

    PRIMARY KEY (`cveProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venta` (
    `cveVenta` INTEGER NOT NULL AUTO_INCREMENT,
    `totalVenta` DOUBLE NOT NULL,
    `fechaVenta` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cveUsuario` INTEGER NOT NULL,

    PRIMARY KEY (`cveVenta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleVenta` (
    `cveDetalleVenta` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `precioProducto` INTEGER NOT NULL,
    `cveProducto` INTEGER NOT NULL,
    `cveVenta` INTEGER NOT NULL,

    PRIMARY KEY (`cveDetalleVenta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_cveRol_fkey` FOREIGN KEY (`cveRol`) REFERENCES `Rol`(`cveRol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_cveCategoria_fkey` FOREIGN KEY (`cveCategoria`) REFERENCES `Categoria`(`cveCategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_cveUsuario_fkey` FOREIGN KEY (`cveUsuario`) REFERENCES `Usuario`(`cveUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleVenta` ADD CONSTRAINT `DetalleVenta_cveProducto_fkey` FOREIGN KEY (`cveProducto`) REFERENCES `Producto`(`cveProducto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleVenta` ADD CONSTRAINT `DetalleVenta_cveVenta_fkey` FOREIGN KEY (`cveVenta`) REFERENCES `Venta`(`cveVenta`) ON DELETE RESTRICT ON UPDATE CASCADE;
