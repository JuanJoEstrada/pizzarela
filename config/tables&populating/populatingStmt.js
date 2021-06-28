const de_la_casaPopulateStmt = `
  INSERT INTO de_la_casa (name, description)
  VALUES 
  ('Zarela', 'Salsa de tomate, queso mozzarella, tomate cherry, albahaca, pimiento, prosciutto y champiñón.'),
  ('All Meats', 'Salsa de tomate, queso mozzarella, carne de res, pollo, jamón, pepperoni y tocino ahumado.'),
  ('Lomazo', 'Salsa de tomate, queso mozzarella, lomo saltado tradicional.'),
  ('Veggie', 'Salsa de tomate, queso mozzarella, aceituna, champiñón, pimiento, cebolla blanca y albahaca.'),
  ('La Divina', 'Salsa de tomate, queso mozzarella, tomate cherry, queso parmesano, albahaca y pollo.'),
  ('BBQ', 'Salsa de tomate, queso mozzarella, tocino ahumado, queso cheddar, pollo y salsa BBQ.'),
  ('Hawaiana Especial', 'Salsa de tomate, queso mozzarella, champiñón, tocino ahumado y piña.');
`;

const de_la_casa_sizePopulateStmt = `
  INSERT INTO de_la_casa_size (de_la_casa_id, size_casa, price)
  VALUES 
  (1, 'Mediana', 23.90),
  (1, 'Grande', 32.90),
  (1, 'Familiar', 42.90),
  (2, 'Mediana', 23.90),
  (2, 'Grande', 32.90),
  (2, 'Familiar', 42.90),
  (3, 'Mediana', 23.90),
  (3, 'Grande', 32.90),
  (3, 'Familiar', 42.90),
  (4, 'Mediana', 19.90),
  (4, 'Grande', 28.90),
  (4, 'Familiar', 37.90),
  (5, 'Mediana', 19.90),
  (5, 'Grande', 28.90),
  (5, 'Familiar', 37.90),
  (6, 'Mediana', 19.90),
  (6, 'Grande', 28.90),
  (6, 'Familiar', 37.90),
  (7, 'Mediana', 19.90),
  (7, 'Grande', 28.90),
  (7, 'Familiar', 37.90);
`;

const tradicionalesPopulateStmt = `
  INSERT INTO tradicionales (name, description)
  VALUES 
  ('Margarita', 'Salsa de tomate, queso mozzarella, aceite de oliva y albahaca.'),
  ('Marinara', 'Salsa de tomate, láminas de ajo, aceite de oliva y orégano.'),
  ('Napolitana', 'Salsa de tomate, queso mozzarella, tomate cherry, láminas de ajo, aceite de oliva y orégano.'),
  ('Pepperoni', 'Salsa de tomate, queso mozzarella y pepperoni.'),
  ('4 Estaciones', 'Salsa de tomate, queso mozzarella, aceituna, pimiento, champiñones y jamón.'),
  ('Americana', 'Salsa de tomate, queso mozzarella y jamón.'),
  ('Hawaiana', 'Salsa de tomate, queso mozzarella, jamón y piña.');
`;

const tradicionales_sizePopulateStmt = `
  INSERT INTO tradicionales_size (tradicional_id, size_tradicional, price)
  VALUES 
  (1, 'Mediana', 14.90),
  (1, 'Grande', 19.90),
  (1, 'Familiar', 26.90),
  (2, 'Mediana', 14.90),
  (2, 'Grande', 19.90),
  (2, 'Familiar', 26.90),
  (3, 'Mediana', 14.90),
  (3, 'Grande', 19.90),
  (3, 'Familiar', 26.90),
  (4, 'Mediana', 16.90),
  (4, 'Grande', 23.90),
  (4, 'Familiar', 30.90),
  (5, 'Mediana', 16.90),
  (5, 'Grande', 23.90),
  (5, 'Familiar', 30.90),
  (6, 'Mediana', 16.90),
  (6, 'Grande', 23.90),
  (6, 'Familiar', 30.90),
  (7, 'Mediana', 16.90),
  (7, 'Grande', 23.90),
  (7, 'Familiar', 30.90);
`;

const complementosPopulateStmt = `
  INSERT INTO complementos (name, price)
  VALUES 
  ('Pan al ajo', 6.00),
  ('Pan al ajo especial', 9.00),
  ('Calzone', 12.90),
  ('Lasagna', 19.90);
`;

const bebidasPopulateStmt = `
  INSERT INTO bebidas (name, description, price)
  VALUES 
  ('Agua Mineral', '600 ml', 3.00),
  ('Inca Kola Original', '500 ml', 4.00),
  ('Inca Kola Zero', '500 ml', 4.00),
  ('Inca Kola Original', '1.5L', 10.00),
  ('Inca Kola Zero', '1.5L', 10.00),
  ('Coca Cola Original', '500 ml', 4.00),
  ('Coca Cola Zero', '500 ml', 4.00),
  ('Coca Cola Original', '1.5L', 10.00),
  ('Coca Cola Zero', '1.5L', 10.00),
  ('Cerveza Cusqueña', '330 ml', 8.00);
`;

const promocionesPopulateStmt = `
  INSERT INTO promociones (name, price)
  VALUES 
  ('Pack Familiar 1', 36.00),
  ('Pack Familiar 2', 48.00),
  ('Promo para Compartir', 42.00),
  ('Dúos Grandes', 40.00),
  ('Promo Entre Patas', 30.00);
`;

const delivery_distritoPopulateStmt = `
  INSERT INTO delivery_distrito (name, price)
  VALUES 
  ('Breña', 5.00),
  ('Jesús María', 5.00),
  ('Lima Cercado', 5.00),
  ('Lince', 7.00),
  ('Magdalena', 5.00),
  ('Pueblo Libre', 5.00),
  ('San Isidro', 7.00),
  ('San Miguel', 7.00);
`;

module.exports = {
  de_la_casaPopulateStmt,
  de_la_casa_sizePopulateStmt,
  tradicionalesPopulateStmt,
  tradicionales_sizePopulateStmt,
  complementosPopulateStmt,
  bebidasPopulateStmt,
  promocionesPopulateStmt,
  delivery_distritoPopulateStmt,
}