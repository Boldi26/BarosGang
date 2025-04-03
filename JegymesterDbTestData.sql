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


SET IDENTITY_INSERT Tickets ON;
INSERT INTO Tickets (Id, ScreeningId, UserId) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 1, 2);
SET IDENTITY_INSERT Tickets OFF;

SELECT * FROM Tickets;

SET IDENTITY_INSERT Users ON;
INSERT INTO Users (Id, Email, Password, PhoneNumber, IsRegistered) VALUES
(1, 'teszt1@gmail.com', 'password1', '062012345', 1),
(2, 'teszt2@gmail.com', 'password2', '063069420', 1);
SET IDENTITY_INSERT Users OFF;

SELECT * FROM Users;