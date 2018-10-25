create table if not exists items (
  id uuid not null primary key,
  inserted_at timestamp without time zone not null,
  deleted_at timestamp without time zone,
  url text not null,
  title text,
  price integer,
  expired boolean default false
);
