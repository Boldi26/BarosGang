USE [JegymesterDb]
GO

-- Movies
SET IDENTITY_INSERT [dbo].[Movies] ON
INSERT INTO [dbo].[Movies] ([Id], [Name], [Length], [Genre], [AgeLimit]) VALUES (1, N'Tenet', 140, N'Sci-Fi', 16)
INSERT INTO [dbo].[Movies] ([Id], [Name], [Length], [Genre], [AgeLimit]) VALUES (2, N'Minecraft', 101, N'Drama', 12)
INSERT INTO [dbo].[Movies] ([Id], [Name], [Length], [Genre], [AgeLimit]) VALUES (3, N'Super Mario Bros.', 92, N'Animation', 6)
SET IDENTITY_INSERT [dbo].[Movies] OFF
GO

-- Users
SET IDENTITY_INSERT [dbo].[Users] ON
INSERT INTO [dbo].[Users] ([Id], [Email], [Password], [PhoneNumber], [IsRegistered]) VALUES (1, N'alice@example.com', N'pass123', N'+36301234567', 1)
INSERT INTO [dbo].[Users] ([Id], [Email], [Password], [PhoneNumber], [IsRegistered]) VALUES (2, N'bob@example.com', N'qwerty', N'+36309876543', 1)
INSERT INTO [dbo].[Users] ([Id], [Email], [Password], [PhoneNumber], [IsRegistered]) VALUES (3, N'zimbabwei.zoltan@gmail.com', N'', N'+36308897556', 0)
INSERT INTO [dbo].[Users] ([Id], [Email], [Password], [PhoneNumber], [IsRegistered]) VALUES (4, N'johnpork123@gmail.com', N'cheese', N'+36308897556', 1)
INSERT INTO [dbo].[Users] ([Id], [Email], [Password], [PhoneNumber], [IsRegistered]) VALUES (5, N'abdulahmed911@gmail.com', N'', N'+36308897556', 0)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO

-- Screenings
SET IDENTITY_INSERT [dbo].[Screenings] ON
INSERT INTO [dbo].[Screenings] ([Id], [MovieId], [StartTime], [Capacity], [Price], [Room]) VALUES (1, 1, '2025-04-10 18:00:00', 100, 2500, 1)
INSERT INTO [dbo].[Screenings] ([Id], [MovieId], [StartTime], [Capacity], [Price], [Room]) VALUES (2, 2, '2025-04-11 20:00:00', 80, 3000, 2)
INSERT INTO [dbo].[Screenings] ([Id], [MovieId], [StartTime], [Capacity], [Price], [Room]) VALUES (3, 3, '2025-04-12 14:00:00', 120, 2000, 1)
SET IDENTITY_INSERT [dbo].[Screenings] OFF
GO

-- Tickets
SET IDENTITY_INSERT [dbo].[Tickets] ON
INSERT INTO [dbo].[Tickets] ([Id], [ScreeningId], [UserId]) VALUES (1, 1, 1)
INSERT INTO [dbo].[Tickets] ([Id], [ScreeningId], [UserId]) VALUES (2, 2, 2)
INSERT INTO [dbo].[Tickets] ([Id], [ScreeningId], [UserId]) VALUES (3, 3, 1)
INSERT INTO [dbo].[Tickets] ([Id], [ScreeningId], [UserId]) VALUES (4, 3, 4)
INSERT INTO [dbo].[Tickets] ([Id], [ScreeningId], [UserId]) VALUES (5, 2, 5)
SET IDENTITY_INSERT [dbo].[Tickets] OFF
GO