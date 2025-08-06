-- Erlaube root-Verbindung von allen Hosts
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'example';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;