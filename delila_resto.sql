-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-07-2020 a las 22:43:30
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delila_resto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id_orden` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `precio_total` int(255) NOT NULL,
  `metodo_pago` enum('Tarjeta','Efectivo') NOT NULL,
  `estado` enum('Nuevo','Confirmado','Preparando','Enviando','Entregado') NOT NULL,
  `fecha_creado` date NOT NULL,
  `ultima_actualizacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`id_orden`, `id_usuario`, `precio_total`, `metodo_pago`, `estado`, `fecha_creado`, `ultima_actualizacion`) VALUES
(68, 39, 1180, 'Tarjeta', 'Entregado', '2020-07-04', '2020-07-04'),
(69, 39, 608, 'Tarjeta', 'Preparando', '2020-07-04', '2020-07-04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(250) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `precio` int(255) NOT NULL,
  `activo` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `titulo`, `precio`, `activo`) VALUES
(2, 'Cangreburger', 1000, 1),
(4, 'Champiñones', 180, 0),
(5, 'Pizzanesa especial', 530, 1),
(6, 'Papas Fritas', 170, 1),
(7, 'Aros de cebolla', 170, 1),
(8, 'Rabas', 350, 1),
(9, 'Coca Cola', 95, 1),
(10, 'Andes Mendocina', 95, 1),
(11, 'Empanada de carne', 35, 1),
(12, 'Empanada de jamon y queso', 35, 1),
(13, 'Empanada de verdura', 35, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productosordenes`
--

CREATE TABLE `productosordenes` (
  `id_prodOrdenes` int(255) NOT NULL,
  `id_orden` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `producto_cantidad` int(11) NOT NULL,
  `total_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productosordenes`
--

INSERT INTO `productosordenes` (`id_prodOrdenes`, `id_orden`, `id_producto`, `producto_cantidad`, `total_producto`) VALUES
(13, 64, 2, 2, 2000),
(14, 64, 4, 3, 540),
(15, 65, 2, 2, 2000),
(16, 65, 4, 3, 540),
(17, 66, 2, 2, 2000),
(18, 66, 4, 3, 540),
(19, 67, 2, 2, 2000),
(20, 67, 4, 3, 540),
(21, 68, 2, 2, 2000),
(22, 68, 4, 3, 540),
(23, 69, 2, 2, 876),
(24, 69, 4, 3, 510);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(250) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `celular` varchar(30) NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `contrasenia` varchar(100) NOT NULL,
  `administrador` tinyint(1) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `celular`, `direccion`, `contrasenia`, `administrador`, `activo`) VALUES
(43, 'admin', 'admin', 'admin@gmail.com', '3413496691', 'presidente roca 1554', 'admin', 1, 1),
(44, 'Nancy', 'garcia', 'nancy@gmail.com', '3413496124', 'Pellegrini 151', 'nancy', 0, 1),
(45, 'Leandro', 'Moyano', 'leandro@gmail.com', '3415896124', 'Tucuman 1000', 'leandro', 0, 1),
(46, 'Matias', 'Moyano', 'matias@gmail.com', '3415899124', 'maipu 740', 'matias', 0, 1),
(47, 'Ramon', 'Etchegaray', 'ramon@gmail.com', '3415899123', '3 de febrero 1334', 'ramon', 0, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id_orden`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `productosordenes`
--
ALTER TABLE `productosordenes`
  ADD PRIMARY KEY (`id_prodOrdenes`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(250) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `productosordenes`
--
ALTER TABLE `productosordenes`
  MODIFY `id_prodOrdenes` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(250) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
