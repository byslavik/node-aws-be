CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists categories (
	id uuid primary key default uuid_generate_v4(),
	category_name varchar
);

create table if not exists brands (
	id uuid primary key default uuid_generate_v4(),
	brand_name varchar
);

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title varchar NOT null,
    description text,
    brand_id uuid,
    category_id uuid,
    price integer,
    imgUrl varchar,
	foreign key ("brand_id") references "brands" ("id"),
	foreign key ("category_id") references "categories" ("id")
);


create table if not exists stocks (
	id uuid primary key default uuid_generate_v4(),
    product_id uuid,
    count integer,
	foreign key ("product_id") references "products" ("id")
);

insert into categories (category_name) values ('Cars'), ('Dolls'), ('Constructors');
insert into brands (brand_name) values ('Lego'), ('Hot Wheels');


insert into products (title, description, price, imgUrl, brand_id, category_id) values
('LEGO® Star Wars™ Advent Calendar', 'description goes here', 89.99, 'https://www.lego.com/cdn/cs/set/assets/blta61bf163054619af/75279_alt1.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2', 'ac79cadb-5f67-4f70-9a7f-565b6a4c50b9', 'c4d9e544-60d8-44a0-aa8b-51ff019998ef'),
('The Child', 'description goes here', 79.99, 'https://www.lego.com/cdn/cs/set/assets/blt4077c030eb5d127d/75318.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2', 'ac79cadb-5f67-4f70-9a7f-565b6a4c50b9', 'c4d9e544-60d8-44a0-aa8b-51ff019998ef'),
('Boba Fett™ Helmet', 'description goes here', 59.99, 'https://www.lego.com/cdn/cs/set/assets/blt5f564fef7e99b20c/75277.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2', 'ac79cadb-5f67-4f70-9a7f-565b6a4c50b9', 'c4d9e544-60d8-44a0-aa8b-51ff019998ef'),
('Stormtrooper™ Helmet', 'description goes here', 59.99, 'https://www.lego.com/cdn/cs/set/assets/blt46155aa4d036faf1/75276.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2', 'ac79cadb-5f67-4f70-9a7f-565b6a4c50b9', 'c4d9e544-60d8-44a0-aa8b-51ff019998ef'),
('2018 HONDA CIVIC TYPE R', 'description goes here', 19.99, 'https://media.mattel.com/root/HWCarsCatalog/Web/Thumbnail/GHF50_W_20_003.png', '8aeac79b-cd7d-4551-afcc-fd21f7f97c3d', '1a5f6c6d-538d-4aef-9f36-2ed38e9a19c1'),
('BONE SHAKER', 'description goes here', 19.99, 'https://media.mattel.com/root/HWCarsCatalog/Web/Thumbnail/GJP06_W_20_003.png', '8aeac79b-cd7d-4551-afcc-fd21f7f97c3d', '1a5f6c6d-538d-4aef-9f36-2ed38e9a19c1'),
('LAMBORGHINI SESTO ELEMENTO', 'description goes here', 19.99, 'https://media.mattel.com/root/HWCarsCatalog/Web/MainImage/GHC35_W_20_003.png', '8aeac79b-cd7d-4551-afcc-fd21f7f97c3d', '1a5f6c6d-538d-4aef-9f36-2ed38e9a19c1');

insert into stocks (product_id, count) values
('1b70c0cb-c0ae-4149-bbc0-72bf9af04ac1', 0),
('2ac87595-4d88-4d4b-af90-34c4df138d49', 10),
('f4e573ba-8cf5-4aba-b943-d0a415fd3bd9', 20),
('88328f7e-be71-4db3-a99b-59b74ab7c1ea', 0),
('0e994147-2642-4fe6-809a-735bef3c5100', 120),
('6a85a3cd-49af-4983-9439-e846187963b1', 200),
('19e304aa-6523-4164-b867-5f3b42cd3f1a', 0);



