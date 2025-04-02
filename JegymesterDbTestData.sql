USE [JegymesterDb]

SET IDENTITY_INSERT Movies ON;
INSERT INTO Movies(Id,Name,Length,Genre,AgeLimit) VALUES
(1,'Morbius',124,'Action',18),
(2,'Joker',103,'Drama',16);
SET IDENTITY_INSERT Movies OFF;

SELECT * FROM Movies;

SET IDENTITY_INSERT Screenings ON;
INSERT INTO Screenings (Id, MovieId, StartTime, Capacity, Price, Room) VALUES
(1, 1, '2025-04-05 18:00:00', 100, 2500, 1),
(2, 1, '2025-04-06 20:30:00', 80, 3000, 2),
(3, 2, '2025-04-07 17:00:00', 120, 2800, 3);
SET IDENTITY_INSERT Screenings OFF;

SELECT * FROM Screenings;