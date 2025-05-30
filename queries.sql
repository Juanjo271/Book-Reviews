CREATE DATA BASE POSTGREST 

CREATE TABLE books (
   id SERIAL PRIMARY KEY,
   book_name VARCHAR(200) NOT NULL,
   rating SMALLINT NOT NULL,
   ISBN_Code BIGINT NOT NULL,
   review VARCHAR(250) NOT NULL
);

INSERT INTO public.books (
id, book_name, rating, isbn_code, review) VALUES (
'1'::integer, 'Harry Potter and the Philosopher''s Stone'::character varying, '8'::smallint, '9780747532743'::bigint, 'Buen libro'::character varying)
 returning id;