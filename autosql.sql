use [JegymesterDb]
-- Clear existing data (optional - use with caution in non-development environments)
DELETE FROM UserRoles;
DELETE FROM Tickets;
DELETE FROM Screenings;
DELETE FROM Movies;
DELETE FROM Roles;
DELETE FROM Users;

-- Reset identity columns
DBCC CHECKIDENT ('Movies', RESEED, 0);
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Roles', RESEED, 0);
DBCC CHECKIDENT ('Screenings', RESEED, 0);
DBCC CHECKIDENT ('Tickets', RESEED, 0);

-- Insert Roles
INSERT INTO Roles (Name) VALUES 
('Admin'),
('User'),
('Cashier');

-- Insert Users (PasswordHash example using bcrypt format)
INSERT INTO Users (Email, PasswordHash, PhoneNumber, IsRegistered) VALUES 
--admin jelszo: admin1
('admin@jegymester.com', '$2a$11$NyBlQttMbsKFsMg97OE9k.auO3Mcy6LNZ7MQ8m.VA9STnkqzVFo36', '+36301234567', 1),

--többi felhasználó jelszava: ohioooo
('user1@example.com', '$2a$11$P3PDc.WTK19AfqCcLwfpF.NlVeQaiCXT3lqRcL4uKcOdOBVs5md2K', '+36302345678', 1),
('cashier@jegymester.com', '$2a$11$P3PDc.WTK19AfqCcLwfpF.NlVeQaiCXT3lqRcL4uKcOdOBVs5md2K', '+36303456789', 1);

INSERT INTO UserRoles (RolesId, UsersId) VALUES(1, 1)

-- Insert Movies
INSERT INTO Movies (Name, Length, Genre, AgeLimit) VALUES
('The Shawshank Redemption', 142, 'Drama', 16),
('The Godfather', 175, 'Crime', 18),
('Pulp Fiction', 154, 'Crime', 18),
('The Dark Knight', 152, 'Action', 12),
('Fight Club', 139, 'Drama', 18),
('Jurassic Park', 127, 'Adventure', 12),
('Toy Story', 81, 'Animation', 0),
('The Matrix', 136, 'Sci-Fi', 16),
('Avengers: Endgame', 181, 'Action', 12),
('Interstellar', 169, 'Sci-Fi', 12);

INSERT INTO Screenings (MovieId, StartTime, Capacity, Price, Room) VALUES
-- The Shawshank Redemption
(1, '2026-01-10 18:00:00', 100, 2000, 1),
(1, '2026-01-12 20:00:00', 100, 2300, 2),
(1, '2026-01-15 16:00:00', 100, 1800, 3),

-- The Godfather
(2, '2026-02-05 17:30:00', 100, 2200, 1),
(2, '2026-02-08 19:00:00', 100, 2500, 2),
(2, '2026-02-11 21:00:00', 100, 2100, 3),

-- Pulp Fiction
(3, '2026-03-03 15:00:00', 100, 1600, 2),
(3, '2026-03-05 18:00:00', 100, 1900, 3),
(3, '2026-03-07 20:30:00', 100, 2000, 1),

-- The Dark Knight
(4, '2026-04-10 14:00:00', 100, 2400, 1),
(4, '2026-04-12 17:00:00', 100, 2200, 2),
(4, '2026-04-15 20:00:00', 100, 1800, 3),

-- Fight Club
(5, '2026-05-01 16:30:00', 100, 1700, 3),
(5, '2026-05-03 19:30:00', 100, 2300, 2),
(5, '2026-05-05 21:00:00', 100, 2500, 1),

-- Jurassic Park
(6, '2026-06-10 13:00:00', 100, 1500, 1),
(6, '2026-06-13 17:00:00', 100, 1900, 2),
(6, '2026-06-16 20:00:00', 100, 2200, 3),

-- Toy Story
(7, '2026-07-02 10:00:00', 100, 1600, 1),
(7, '2026-07-04 12:30:00', 100, 2000, 2),
(7, '2026-07-06 14:00:00', 100, 1800, 3),

-- The Matrix
(8, '2026-08-18 16:00:00', 100, 2500, 2),
(8, '2026-08-20 19:00:00', 100, 2300, 3),
(8, '2026-08-22 21:30:00', 100, 2000, 1),

-- Avengers: Endgame
(9, '2026-09-05 18:00:00', 100, 2400, 3),
(9, '2026-09-07 20:00:00', 100, 2000, 2),
(9, '2026-09-09 22:00:00', 100, 1900, 1),

-- Interstellar
(10, '2026-10-01 15:00:00', 100, 2100, 1),
(10, '2026-10-03 18:30:00', 100, 1700, 2),
(10, '2026-10-05 20:00:00', 100, 2200, 3);
