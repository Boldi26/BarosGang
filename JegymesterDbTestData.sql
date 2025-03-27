USE [JegymesterDb]

SET IDENTITY_INSERT Movies ON;
INSERT INTO Movies(Id,Name,Length,Genre,AgeLimit) VALUES
(1,'Morbius',124,'Action',18),
(2,'Joker',103,'Drama',16);
SET IDENTITY_INSERT Movies OFF;

SELECT * FROM Movies;