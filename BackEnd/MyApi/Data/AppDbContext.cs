using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<ConnectionRequest> ConnectionRequests { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Discussion> Discussions { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Advertisement> Advertisements { get; set; } 


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ignoring the Network property in User
            modelBuilder.Entity<User>().Ignore(u => u.Network);

            // Relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Education)
                .WithOne()
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Jobs)
                .WithOne()
                .HasForeignKey(j => j.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Skills)
                .WithOne()
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<Friendship>()
                .HasKey(f => new { f.UserId, f.FriendId });

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.Friend)
                .WithMany()
                .HasForeignKey(f => f.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ConnectionRequest>()
                .HasOne(cr => cr.Sender)
                .WithMany()
                .HasForeignKey(cr => cr.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ConnectionRequest>()
                .HasOne(cr => cr.Receiver)
                .WithMany()
                .HasForeignKey(cr => cr.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // New relationships for chat functionality
            modelBuilder.Entity<Message>()
                .HasOne<User>() // Αφαιρούμε την πλοηγητική ιδιότητα `Sender`
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId);

            modelBuilder.Entity<Message>()
                .HasOne<Discussion>() // Αφαιρούμε την πλοηγητική ιδιότητα `Discussion`
                .WithMany(d => d.Messages)
                .HasForeignKey(m => m.DiscussionId);


            modelBuilder.Entity<Advertisement>()
                .HasOne(a => a.User)
                .WithMany(u => u.Advertisements)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
