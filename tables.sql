CREATE TABLE towns(
 id serial not null primary key,
 townName text not null,
 regStart text not null
);

CREATE TABLE registrations(
 id serial not null primary key,
 regNumber text not null,
 town_id int,
 foreign key (town_id) references towns(id) ON DELETE CASCADE
);

INSERT INTO towns (townName,regStart) VALUES ('Bellville', 'CY');
INSERT INTO towns (townName,regStart) VALUES ('Cape Town', 'CA');
INSERT INTO towns (townName,regStart) VALUES ('Kuilsriver', 'CF');
INSERT INTO towns (townName,regStart) VALUES ('Paarl', 'CJ');

