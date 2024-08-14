using MyApi.Data;
using MyApi.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


namespace MyApi.Services
{
    public class DiscussionService
    {
        private readonly AppDbContext _context;

        public DiscussionService(AppDbContext context)
        {
            _context = context;
        }

        public Discussion? CreateDiscussion(Discussion discussion)
        {
            // Retrieve all discussions and compare the participants list in-memory
            var existingDiscussion = _context.Discussions
                .AsEnumerable()  // Forces evaluation in-memory
                .FirstOrDefault(d => d.Participants.OrderBy(p => p).SequenceEqual(discussion.Participants.OrderBy(p => p)));

            if (existingDiscussion != null)
            {
                return existingDiscussion; // Return the existing discussion if found
            }

            // Retrieve user names for the participants to create a discussion title
            var userNames = _context.Users
                .Where(u => discussion.Participants.Contains(u.UserId))
                .Select(u => $"{u.FirstName} {u.LastName}")
                .ToList();

            // Set the title of the discussion to the concatenated user names
            discussion.Title = string.Join(", ", userNames);

            // If no matching discussion exists, create a new one
            _context.Discussions.Add(discussion);
            _context.SaveChanges();
            return discussion;
        }



        public Discussion? GetDiscussionById(int id)
        {
            return _context.Discussions
                .Include(d => d.Messages) // Εξασφαλίζουμε ότι τα μηνύματα φορτώνονται
                .FirstOrDefault(d => d.Id == id);
        }


        public IEnumerable<Discussion> GetDiscussionsByUser(int userId)
        {
            return _context.Discussions
                .Where(d => d.Participants.Contains(userId))
                .ToList();
        }

        public Discussion? GetDiscussionByParticipants(int senderId, int receiverId)
        {
            return _context.Discussions
                .AsEnumerable()
                .FirstOrDefault(d => d.Participants.OrderBy(p => p).SequenceEqual(new List<int> { senderId, receiverId }.OrderBy(p => p)));
        }

        public List<int> GetParticipantsByDiscussionId(int discussionId)
        {   
            var discussion = _context.Discussions.FirstOrDefault(d => d.Id == discussionId);
            return discussion?.Participants ?? new List<int>();
        }

        public bool AddParticipantToDiscussion(int discussionId, int userId)
        {
            var discussion = _context.Discussions
                .FirstOrDefault(d => d.Id == discussionId);

            if (discussion == null)
            {
                return false;
            }

            if (!discussion.Participants.Contains(userId))
            {
                // Ανάκτηση του νέου χρήστη από τη βάση δεδομένων
                var newUser = _context.Users.FirstOrDefault(u => u.UserId == userId);
                if (newUser == null)
                {
                    return false;
                }

                // Προσθήκη του νέου χρήστη στη λίστα των συμμετεχόντων
                discussion.Participants.Add(userId);

                // Ενημέρωση του τίτλου με το όνομα και επώνυμο του νέου χρήστη
                if (!string.IsNullOrEmpty(discussion.Title))
                {
                    discussion.Title += ", ";
                }
                discussion.Title += $"{newUser.FirstName} {newUser.LastName}";

                // Αποθήκευση των αλλαγών στη βάση δεδομένων
                _context.SaveChanges();
                return true;
            }

            return false;
        }

        public bool RemoveParticipantFromDiscussion(int discussionId, int userId)
        {
            var discussion = _context.Discussions
                .FirstOrDefault(d => d.Id == discussionId);

            if (discussion == null)
            {
                return false;
            }

            if (discussion.Participants.Contains(userId))
            {
                // Αφαίρεση του χρήστη από τη λίστα των συμμετεχόντων
                discussion.Participants.Remove(userId);

                // Ανάκτηση του χρήστη από τη βάση δεδομένων για να ενημερώσουμε τον τίτλο
                var removedUser = _context.Users.FirstOrDefault(u => u.UserId == userId);
                
                // Έλεγχος αν το removedUser είναι null
                if (removedUser == null)
                {
                    return false;
                }

                // Αφαίρεση του ονόματος και επωνύμου του χρήστη από τον τίτλο
                var userFullName = $"{removedUser.FirstName} {removedUser.LastName}";

                // Διαχείριση αφαίρεσης του ονόματος από τον τίτλο
                if (!string.IsNullOrEmpty(discussion.Title))
                {
                    if (discussion.Title.Contains($", {userFullName}"))
                    {
                        discussion.Title = discussion.Title.Replace($", {userFullName}", "");
                    }
                    else if (discussion.Title.Contains($"{userFullName}, "))
                    {
                        discussion.Title = discussion.Title.Replace($"{userFullName}, ", "");
                    }
                    else
                    {
                        discussion.Title = discussion.Title.Replace(userFullName, "");
                    }
                }

                // Αποθήκευση των αλλαγών στη βάση δεδομένων
                _context.SaveChanges();
                return true;
            }

            return false;
        }

        public bool DeleteDiscussionOrRemoveParticipant(int discussionId, int userId)
        {
            var discussion = _context.Discussions
                .FirstOrDefault(d => d.Id == discussionId);

            if (discussion == null)
            {
                return false;
            }

            if (!discussion.Participants.Contains(userId))
            {
                return false;
            }

            if (discussion.Participants.Count == 2)
            {
                // Αν οι συμμετέχοντες είναι 2, διαγράφουμε τη συζήτηση
                _context.Discussions.Remove(discussion);
            }
            else
            {
                // Αν είναι περισσότεροι από 2, αφαιρούμε μόνο τον συγκεκριμένο συμμετέχοντα
                discussion.Participants.Remove(userId);

                // Ανάκτηση του χρήστη από τη βάση δεδομένων για να ενημερώσουμε τον τίτλο
                var removedUser = _context.Users.FirstOrDefault(u => u.UserId == userId);
                if (removedUser == null)
                {
                    return false;
                }

                // Αφαίρεση του ονόματος και επωνύμου του χρήστη από τον τίτλο
                var userFullName = $"{removedUser.FirstName} {removedUser.LastName}";

                // Διαχείριση αφαίρεσης του ονόματος από τον τίτλο
                if (!string.IsNullOrEmpty(discussion.Title))
                {
                    if (discussion.Title.Contains($", {userFullName}"))
                    {
                        discussion.Title = discussion.Title.Replace($", {userFullName}", "");
                    }
                    else if (discussion.Title.Contains($"{userFullName}, "))
                    {
                        discussion.Title = discussion.Title.Replace($"{userFullName}, ", "");
                    }
                    else
                    {
                        discussion.Title = discussion.Title.Replace(userFullName, "");
                    }
                }
            }

            // Αποθήκευση των αλλαγών στη βάση δεδομένων
            _context.SaveChanges();
            return true;
        }


    }
}
