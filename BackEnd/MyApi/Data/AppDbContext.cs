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
        public DbSet<NoteOfInterest> NotesOfInterest { get; set; }

        public DbSet<MessageReadStatus> MessageReadStatuses { get; set; }
        public DbSet<Advertisement> Advertisements { get; set; } 
        public DbSet<AdvertisementVector> AdvertisementVectors { get; set; }
        public DbSet<ArticleVector> ArticleVectors { get; set; }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<View> Views { get; set; }


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


            modelBuilder.Entity<User>()
                .HasMany(u => u.AdvertisementVectors)
                .WithOne()
                .HasForeignKey(av => av.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.ArticleVectors)
                .WithOne()
                .HasForeignKey(av => av.UserId)
                .OnDelete(DeleteBehavior.Cascade);

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
                .HasOne<User>() // Removing the navigation property `Sender`
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId);

            modelBuilder.Entity<Message>()
                .HasOne<Discussion>() // Removing the navigation property `Discussion`
                .WithMany(d => d.Messages)
                .HasForeignKey(m => m.DiscussionId);

            modelBuilder.Entity<Advertisement>()
                .HasOne(a => a.User)
                .WithMany(u => u.Advertisements)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            
            // New relationships for MessageReadStatus
            modelBuilder.Entity<MessageReadStatus>()
                .HasOne<Message>()
                .WithMany(m => m.ReadStatuses)
                .HasForeignKey(mrs => mrs.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MessageReadStatus>()
                .HasOne<User>()
                .WithMany() 
                .HasForeignKey(mrs => mrs.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<AdvertisementVector>()
                .HasKey(av => av.AdvertisementVectorId);

            modelBuilder.Entity<ArticleVector>()
                .HasKey(av => av.ArticleVectorId);

            // New relationships for Article, Like, and Comment
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Author)
                .WithMany(u => u.Articles)
                .HasForeignKey(a => a.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Like>()
                .HasOne(l => l.Liker)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.LikerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Like>()
                .HasOne(l => l.Article)
                .WithMany(a => a.Likes)
                .HasForeignKey(l => l.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Commenter)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.CommenterId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Article)
                .WithMany(a => a.Comments)
                .HasForeignKey(c => c.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<View>()
                .HasOne(v => v.Viewer)
                .WithMany(u => u.Views)
                .HasForeignKey(v => v.ViewerId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<View>()
                .HasOne(v => v.Article)
                .WithMany(a => a.Views)
                .HasForeignKey(v => v.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relationship between ArticleVector and User (AuthorId as foreign key)
            modelBuilder.Entity<ArticleVector>()
                .HasOne<User>(av => av.Author)  
                .WithMany(u => u.AuthoredVectors) 
                .HasForeignKey(av => av.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relationship between ArticleVector and User (UserId as foreign key)
            modelBuilder.Entity<ArticleVector>()
                .HasOne<User>(av => av.User) 
                .WithMany(u => u.ArticleVectors) 
                .HasForeignKey(av => av.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NoteOfInterest>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
