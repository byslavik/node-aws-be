CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title varchar NOT null,
    description text,
    price integer,
    imgUrl varchar,
);


create table if not exists stocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  count int,
  unique (product_id)
)


insert into products (title, description, price, imgUrl, brand_id, category_id) values
('LEGO® Star Wars™ Advent Calendar', 'description goes here', 89.99, 'https://www.lego.com/cdn/cs/set/assets/blta61bf163054619af/75279_alt1.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2'),
('The Child', 'description goes here', 79.99, 'https://www.lego.com/cdn/cs/set/assets/blt4077c030eb5d127d/75318.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2'),
('Boba Fett™ Helmet', 'description goes here', 59.99, 'https://www.lego.com/cdn/cs/set/assets/blt5f564fef7e99b20c/75277.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2'),
('Stormtrooper™ Helmet', 'description goes here', 59.99, 'https://www.lego.com/cdn/cs/set/assets/blt46155aa4d036faf1/75276.jpg?fit=bounds&format=webply&quality=80&width=800&height=800&dpr=2'),
('2018 HONDA CIVIC TYPE R', 'description goes here', 19.99, 'https://media.mattel.com/root/HWCarsCatalog/Web/Thumbnail/GHF50_W_20_003.png'),
('BONE SHAKER', 'description goes here', 19.99, 'https://media.mattel.com/root/HWCarsCatalog/Web/Thumbnail/GJP06_W_20_003.png'),
('LAMBORGHINI SESTO ELEMENTO', 'description goes here', 19.99, 'https://media.mattel.com/root/HWCarsCatalog/Web/MainImage/GHC35_W_20_003.png');

insert into stocks (product_id, count) values
('1b70c0cb-c0ae-4149-bbc0-72bf9af04ac1', 0),
('2ac87595-4d88-4d4b-af90-34c4df138d49', 10),
('f4e573ba-8cf5-4aba-b943-d0a415fd3bd9', 20),
('88328f7e-be71-4db3-a99b-59b74ab7c1ea', 0),
('0e994147-2642-4fe6-809a-735bef3c5100', 120),
('6a85a3cd-49af-4983-9439-e846187963b1', 200),
('19e304aa-6523-4164-b867-5f3b42cd3f1a', 0);



