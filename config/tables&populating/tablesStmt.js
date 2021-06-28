const de_la_casaTableStmt = `
  CREATE TABLE IF NOT EXISTS de_la_casa (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(200) NOT NULL UNIQUE
  );
`;

const de_la_casa_sizeTableStmt = `
  CREATE TABLE IF NOT EXISTS de_la_casa_size (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    de_la_casa_id TINYINT NOT NULL REFERENCES de_la_casa(id),
    size_casa VARCHAR(10) NOT NULL,
    price NUMERIC(4,2) NOT NULL CHECK (price > 0)
  );
`;

const tradicionalesTableStmt = `
  CREATE TABLE IF NOT EXISTS tradicionales (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(200) NOT NULL UNIQUE
  );
`;

const tradicionales_sizeTableStmt = `
  CREATE TABLE IF NOT EXISTS tradicionales_size (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    tradicional_id TINYINT NOT NULL REFERENCES tradicionales(id),
    size_tradicional VARCHAR(10) NOT NULL,
    price NUMERIC(4,2) NOT NULL CHECK (price > 0)
  );
`;

const complementosTableStmt = `
  CREATE TABLE IF NOT EXISTS complementos (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    price NUMERIC(4,2) NOT NULL CHECK (price > 0)
  );
`;

const bebidasTableStmt = `
  CREATE TABLE IF NOT EXISTS bebidas (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(10) NOT NULL,
    price NUMERIC(4,2) NOT NULL CHECK (price > 0)
  );
`;

const promocionesTableStmt = `
  CREATE TABLE IF NOT EXISTS promociones (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    price NUMERIC(4,2) NOT NULL CHECK (price > 0)
  );
`;

const usuarios_srTableStmt = `
  CREATE TABLE IF NOT EXISTS usuarios_sr (
    id            MEDIUMINT     AUTO_INCREMENT   PRIMARY KEY,
    nombres       VARCHAR(40)   NOT NULL,
    apellidos     VARCHAR(40)   NOT NULL,
    email         VARCHAR(50)   NOT NULL,
    direccion_ip  VARCHAR(20)   DEFAULT NULL,
    entrega       VARCHAR(8)    NOT NULL,
    distrito      VARCHAR(20)   DEFAULT NULL,
    urbanizacion  VARCHAR(30)   DEFAULT NULL,
    calle         VARCHAR(100)  DEFAULT NULL,
    numero        VARCHAR(20)   DEFAULT NULL,
    apartamento   VARCHAR(20)   DEFAULT NULL,
    bloque        VARCHAR(20)   DEFAULT NULL,
    telefono      VARCHAR(9)    DEFAULT NULL,
    detalles      VARCHAR(100)  DEFAULT NULL
  );
`;

const ordenes_srTableStmt = `
  CREATE TABLE IF NOT EXISTS ordenes_sr (
    id                    MEDIUMINT     AUTO_INCREMENT   PRIMARY KEY,
    hora                  TIMESTAMP     NOT NULL        DEFAULT NOW(),
    tipo                  VARCHAR(1)    NOT NULL,
    canal_compra          VARCHAR(20)   NOT NULL,
    canal_pago            VARCHAR(20)   NOT NULL,
    boleta                VARCHAR(1)    DEFAULT NULL,
    status                VARCHAR(30)   NOT NULL,
    proceso               VARCHAR(15)   NOT NULL,
    transaccion_id        VARCHAR(15)   DEFAULT NULL,
    motivo                VARCHAR(200)  DEFAULT NULL,
    usuario_id            MEDIUMINT     REFERENCES usuarios_sr(id)   ON DELETE RESTRICT   ON UPDATE RESTRICT
  );
`;

const costos_srTableStmt = `
  CREATE TABLE IF NOT EXISTS costos_sr (
    id                          MEDIUMINT     AUTO_INCREMENT   PRIMARY KEY,
    orden_id                    MEDIUMINT     NOT NULL      REFERENCES ordenes_sr(id)  ON DELETE RESTRICT   ON UPDATE RESTRICT,
    delivery                    NUMERIC(4,2)  DEFAULT NULL,
    total_bruto                 NUMERIC(6,2)  NOT NULL,
    porcentaje_comision         NUMERIC(4,2)  DEFAULT NULL,
    comision                    NUMERIC(4,2)  DEFAULT NULL,
    igv_comision                NUMERIC(4,2)  DEFAULT NULL,
    transaccion                 NUMERIC(4,2)  DEFAULT 0.5,
    igv_transaccion             NUMERIC(4,2)  DEFAULT 0.09,
    suma_comision_transaccion   NUMERIC(4,2)  DEFAULT NULL,
    motorizado                  NUMERIC(4,2)  DEFAULT NULL,
    total_neto                  NUMERIC(6,2)  DEFAULT NULL
  );
`;

const orden_producto_srTableStmt = `
  CREATE TABLE IF NOT EXISTS orden_producto_sr (
    id        MEDIUMINT     AUTO_INCREMENT   PRIMARY KEY,
    orden_id  MEDIUMINT     NOT NULL         REFERENCES ordenes_sr(id)  ON DELETE RESTRICT   ON UPDATE RESTRICT,
    grupo     VARCHAR(30)   NOT NULL,
    producto  VARCHAR(30)   NOT NULL,
    medida    VARCHAR(10)   DEFAULT NULL,
    precio    NUMERIC(4,2)  NOT NULL,
    cantidad  SMALLINT      NOT NULL
  );
`;

const delivery_distritoTableStmt = `
  CREATE TABLE IF NOT EXISTS delivery_distrito (
    id        TINYINT       AUTO_INCREMENT   PRIMARY KEY,
    name      VARCHAR(15)   NOT NULL UNIQUE,
    price     NUMERIC(4,2)  NOT NULL
  );
`;

const order_statusFunction = `
  CREATE OR REPLACE FUNCTION order_status()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS $function$
  BEGIN
  IF NEW.status = 'PAID' AND NEW.proceso = 'En espera' THEN
    PERFORM pg_notify('paid_pizzas', row_to_json(NEW)::text);
  END IF;
  RETURN NULL;
  END;
  $function$;
`;

const after_update_statusTrigger = `
  CREATE TRIGGER after_update_status
  AFTER UPDATE
  ON ordenes_sr
  FOR EACH ROW
  EXECUTE PROCEDURE order_status();
`;

const sessionTableStmt = `
  CREATE TABLE IF NOT EXISTS sessions (
    session_id varchar(128) COLLATE utf8mb4_bin NOT NULL,
    expires int(11) unsigned NOT NULL,
    data mediumtext COLLATE utf8mb4_bin,
    PRIMARY KEY ('session_id')
  ) ENGINE=InnoDB;
`;

module.exports = {
  de_la_casaTableStmt,
  de_la_casa_sizeTableStmt,
  tradicionalesTableStmt,
  tradicionales_sizeTableStmt,
  complementosTableStmt,
  bebidasTableStmt,
  promocionesTableStmt,
  usuarios_srTableStmt,
  ordenes_srTableStmt,
  costos_srTableStmt,
  orden_producto_srTableStmt,  
  delivery_distritoTableStmt,
  order_statusFunction,
  after_update_statusTrigger,
  sessionTableStmt,
};