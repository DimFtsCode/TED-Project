using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyApi.Models
{
    public class Article
    {
        public int ArticleId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime PostedDate { get; set; }

        // Foreign key to User (Author)
        public int AuthorId { get; set; } 
        public User? Author { get; set; }

        // Properties for multimedia content
        public byte[]? PhotoData { get; set; }
        public string? PhotoMimeType { get; set; }
        public byte[]? VideoData { get; set; }
        public string? VideoMimeType { get; set; }

        // Navigation properties for Interactions
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }

    public class Like
    {
        public int LikeId { get; set; }

        // Foreign key to User (Liker)
        public int LikerId { get; set; }
        public User? Liker { get; set; }

        // Foreign key to Article
        public int ArticleId { get; set; }
        public Article? Article { get; set; }
    }

    public class Comment
    {
        public int CommentId { get; set; }
        public string? Content { get; set; }
        public DateTime PostedDate { get; set; }

        // Foreign key to User (Commenter)
        public int CommenterId { get; set; }
        public User? Commenter { get; set; }

        // Foreign key to Article
        public int ArticleId { get; set; }
        public Article? Article { get; set; }
    }
}