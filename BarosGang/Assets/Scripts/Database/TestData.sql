-- Test data for BarosGang database

-- Insert roles
SET IDENTITY_INSERT [dbo].[Roles] ON
INSERT INTO [dbo].[Roles] ([Id], [Name]) VALUES (1, 'Admin')
INSERT INTO [dbo].[Roles] ([Id], [Name]) VALUES (2, 'User')
SET IDENTITY_INSERT [dbo].[Roles] OFF

-- Insert admin user with hashed password
SET IDENTITY_INSERT [dbo].[Users] ON
INSERT INTO [dbo].[Users] ([Id], [Email], [PasswordHash], [PhoneNumber], [IsRegistered])
VALUES (1, 'admin@barosgang.com', '$2a$11$fP5/YvUQIkJxMnQh3.7RaufMvHEm8IyQp3K/UCNmaNgwi/T5AXYJO', '+36301234567', 1)
SET IDENTITY_INSERT [dbo].[Users] OFF

-- Insert regular users with hashed passwords
INSERT INTO [dbo].[Users] ([Email], [PasswordHash], [PhoneNumber], [IsRegistered])
VALUES 
('user1@barosgang.com', '$2a$11$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKy7P/0qR8GqK0K', '+36309876543', 1),
('user2@barosgang.com', '$2a$11$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKy7P/0qR8GqK0K', '+36308897556', 1)

-- Assign admin role to admin user
INSERT INTO [dbo].[UserRoles] ([UsersId], [RolesId]) VALUES (1, 1)

-- Assign user role to regular users
INSERT INTO [dbo].[UserRoles] ([UsersId], [RolesId]) VALUES (2, 2)
INSERT INTO [dbo].[UserRoles] ([UsersId], [RolesId]) VALUES (3, 2)

-- Insert some test items
INSERT INTO Items (Name, Description, Price, Type, Rarity, CreatedAt)
VALUES 
('Test Item 1', 'A test item for demonstration', 100, 'Weapon', 'Common', CURRENT_TIMESTAMP),
('Test Item 2', 'Another test item', 200, 'Armor', 'Rare', CURRENT_TIMESTAMP);

-- Insert some test inventory items
INSERT INTO InventoryItems (UserId, ItemId, Quantity, AcquiredAt)
VALUES 
(1, 1, 1, CURRENT_TIMESTAMP),
(2, 2, 1, CURRENT_TIMESTAMP); 