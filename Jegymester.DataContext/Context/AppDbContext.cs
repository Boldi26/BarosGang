using Jegymester.DataContext.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jegymester.DataContext.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Screening> Screenings { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Movie>()
                .HasKey(m => m.Id);
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity(j => j.ToTable("UserRoles"));
            modelBuilder.Entity<Screening>()
                .HasKey(s => s.Id);
            modelBuilder.Entity<Ticket>()
                .HasKey(t => t.Id);
            modelBuilder.Entity<Ticket>()
        .Property(t => t.Email)
        .HasMaxLength(255);

            modelBuilder.Entity<Ticket>()
                .Property(t => t.PhoneNumber)
                .HasMaxLength(20);
        }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
